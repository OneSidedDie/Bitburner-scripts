import { findAvailRam } from 'lib.js';

/** @param {NS} ns */
export async function main(ns) {
  const debug = false; //Set true to enable logs.
  const target = ns.args[0];
  if (!debug) {
    ns.disableLog('ALL');
  } else {
    ns.tail();
    ns.print(`Launcher, target: ${target}`);
    ns.print(ns.args[0]);
    ns.print(`Launcher, debug: ${debug}`);
  }
  const hThreads = 1;
  const gThreads = 10;
  const wThreads1 = 1;
  const wThreads2 = 1;
  const hRam = 1.7 * hThreads; //Ram (GB) needed to run hThreads worth of hack.js
  const gRam = 1.75 * gThreads;//Ram (GB) needed to run gThreads worth of grow.js
  const wRam1 = 1.75 * wThreads1;//Ram (GB) needed to run wThreads worth of weaken.js
  const wRam2 = 1.75 * wThreads2;//Ram (GB) needed to run wThreads worth of weaken.js

  const buffer = 300;

  while (true) {
    const playerObj = ns.getPlayer();
    const serverObj = ns.getServer(target);
    serverObj.hackDifficulty = serverObj.minDifficulty;
    serverObj.moneyAvailable = serverObj.moneyMax;
    const hTime = ns.formulas.hacking.hackTime(serverObj, playerObj);
    const gTime = ns.formulas.hacking.growTime(serverObj, playerObj);
    const wTime1 = ns.formulas.hacking.weakenTime(serverObj, playerObj);
    const startTime = Date.now();
    const endTime = startTime + wTime1;
    const hEnd = endTime - buffer;
    const gEnd = endTime + buffer;
    const wEnd = endTime + buffer * 2;

    if (debug) {
    }
    //script, findAvailRam(ns, neededRam), threads, target, oTime, endTime, debug
    ns.exec('weaken.js', findAvailRam(ns, wRam1), wThreads1, target, wTime1, endTime, debug);
    ns.exec('weaken.js', findAvailRam(ns, wRam2 * wThreads2), wThreads2, target, wTime1, wEnd, debug);
    ns.exec('grow.js', findAvailRam(ns, gRam * gThreads), gThreads, target, gTime, gEnd, debug);
    ns.exec('hack.js', findAvailRam(ns, hRam), hThreads, target, hTime, hEnd, debug);
    await ns.sleep(buffer * 3);
  }
}
