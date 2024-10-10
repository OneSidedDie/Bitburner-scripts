/*
Lube script outline
target one server
calculate how many weaken threads are needed to get it to
 minimum security.
Find available RAM "chunks"
Throw as many weaken threads, up to needed, at it.
Keep track of threads "in the air" so it doesn't keep throwing
 things after the last thread needed is sent but before it actually lands.
If any RAM 'chunks' left over or if already at min security
 start sending grow/weaken batches.
reiterate above functions until at max money and minimum security.

Bonus: take server cores into account and choose the RAM source
 with 'optimal' cores.
*/
import { findAvailRam, getAllAvailableRam } from 'lib.js';
/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0]// String with name of host to prep
  const hosts = ns.read('hostNames.txt').split(',');
  const port = 0;
  if (hosts.indexOf(target) === -1) {
    ns.tail();
    ns.print(`lube: ${target} is not a valid hostname.`);
    ns.exit();
  }
  if (debug) {
    ns.tail();
    ns.print(`lube target: ${target}`);
  } else {
    ns.disableLog('ALL');
  }
  const buffer = 200; //Time (ms) between batches
  const tCost = 1.75; // RAM cost per weaken/hack threod
  let projectedSecAdj = 0;
  let projectedCashAdj = 0;
  while (true) {
    const serverObj = ns.getServer(target);
    const playerObj = ns.getPlayer();
    const hSkill = playerObj.skills.hacking.valueOf;
    const hReq = serverObj.requiredHackingSkill;
    if (hSkill < hReq) {
      ns.tail();
      ns.print(`lube ${target}: Hacking skill(${hSkill}) does not meet minimum (${hReq})`);
      await ns.sleep(10000);
      continue;
    }
    //Cash and security states
    const minSec = serverObj.minDifficulty;
    const curSec = Math.max(serverObj.hackDifficulty - projectedSecAdj, minSec);
    const needSec = curSec - minSec - projectedSecAdj;
    const maxCash = serverObj.moneyMax;
    const curCash = Math.min(serverObj.moneyAvailable + projectedCashAdj, maxCash);
    const needCash = maxCash - curCash;

    //Effects of grow/weaken on target
    const gEffect = ns.formulas.hacking.growAmount(target, playerObj, 1, 1); //Amount of cash recovered on target per thread
    const wEffect = 0.05;//Security reduction per weaken thread. Adjust for cores later

    //Expected timing of start to finish of w || g/w batch
    const gTime = ns.formulas.hacking.growTime(serverObj, playerObj);
    const wTime = ns.formulas.hacking.weakenTime(serverObj, playerObj);
    const startTime = Date.now();
    const wEnd = startTime + wTime; //Time when the weaken should land
    const gEnd = wTime - buffer; //Time when the weak should land

    if (needSec - projectedSecAdj > 0) {
      while (needSec - projectedSecAdj > 0) {
        const wNeedThreads = Math.ceil(needSec / wEffect);
        let threadsAvail = 0;
        const ramAvail = getAllAvailableRam(ns);
        for (let i = 0, j = ramAvail.length; i < j; i++) {
          threadsAvail += Math.floor(ramAvail[i].availRam / tCost);
        }
        if (threadsAvail < wNeedThreads) {
          for (let i = 0, j = ramAvail.length; i < j; i++) {
            const availThreads = Math.floor(ramAvail[i].availRam / tCost);
            if (availThreads === 0) {
              continue;
            }
            //Script, hostName, threads || {additionalMsec: number, threads: number}, target, opTime, wEnd, debug
            ns.exec('weaken.js', ramAvail[i].hostName, availThreads, target, wTime, wEnd, debug);
            projectedSecAdj += availThreads * wEffect;
          }
          await ns.sleep(wTime + buffer);
          continue;
        } else {
          for (let i = ramAvail.length - 1, j = 0; i >= j; i--) {
            const availThreads = Math.floor(ramAvail[i].availRam / tCost);
            if (availThreads === 0) {
              continue;
            }
            let wThreads = Math.min(wNeedThreads, availThreads);
            wNeedThreads -= wThreads;
            availThreads -= wThreads;
            //Script, hostName, threads || {additionalMsec: number, threads: number}, target, opTime, wEnd, debug
            ns.exec('weaken.js', ramAvail[i].hostName, wThreads, target, wTime, wEnd, debug);
            projectedSecAdj += wThreads * wEffect;
            if (wNeedThreads === 0 && availThreads > 1) {
              wThreads = Math.min(Math.ceil(availThreads / 13), 1);
              let gThreads = availThreads - wThreads;
              ns.exec('weaken.js', ramAvail[i].hostName, wThreads, target, wTime, wEnd, debug);
              ns.exec('grow.js', ramAvail[i].hostName, gThreads, target, gTime, gEnd, debug);
              projectedCashAdj = gEffect * gThreads;
            }
          }
          await ns.sleep(buffer * 2);
          continue;
        }
      }
    } else if (needCash > 0) {

    } else {
      ns.exit();
    }

    ns.exit();
  }
}
