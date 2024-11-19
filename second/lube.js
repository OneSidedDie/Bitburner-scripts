import { findAvailRam } from 'lib.js';

/** @param {NS} ns */
export async function main(ns) {
  const debug = false; //Set true to enable logs.
  const target = ns.args[0];
  if (!debug) {
    ns.disableLog('ALL');
  } else {
    ns.tail();
    ns.print(ns.args[0]);
    ns.print(`Lube, debug: ${debug}`);
  }
  const pids = [];
  let fireOnce = true;
  let serverObj = ns.getServer(target);
  let needCash = Math.abs(serverObj.moneyMax - serverObj.moneyAvailable);
  let needSec = Math.abs(serverObj.hackDifficulty - serverObj.minDifficulty);
  if (needCash === 0 && needSec === 0) {
    ns.tprint(`${target} is already lubed!`); ns.exit();
  } else if (!serverObj.hasAdminRights) {
    ns.print(`You do not have admin rights to ${serverObj.hostname}.`);
    ns.exit();
  }
  while (needCash > 0 || needSec > 0) {
    let threadMult = 6;
    let homeRam = ns.getServerMaxRam('home');
    if (homeRam < 256) {
      threadMult = 1;
    } else if (homeRam < 1024) {
      threadMult = 2;
    } else if (homeRam < 4096) {
      threadMult = 3;
    } else if (homeRam < 16384) {
      threadMult = 4;
    } else if (homeRam < 65536) {
      threadMult = 5;
    }

    let gThreads = 6 * threadMult;
    const wThreads = Math.ceil(gThreads / 12);
    const gRam = 1.75 * gThreads;//Ram (GB) needed to run gThreads worth of grow.js
    const wRam = 1.75 * wThreads;//Ram (GB) needed to run wThreads worth of weaken.js

    const buffer = 50;
    const playerObj = ns.getPlayer();
    const gTime = ns.formulas.hacking.growTime(serverObj, playerObj);
    const wTime = ns.formulas.hacking.weakenTime(serverObj, playerObj);
    const startTime = Date.now();
    const endTime = startTime + wTime;
    const gEnd = endTime - buffer;
    let wPid = 0;
    let gPid = 0;
    const timeUntil = ns.tFormat(gEnd - startTime);
    if (fireOnce) {
      const timeToEnd = new Date(endTime);
      ns.tprint(`First batch landing on ${target} at ${timeToEnd.toLocaleTimeString('en-US', { 'timeStyle': 'medium', 'hour12': false })} (${timeUntil})`);
      ns.print(`First batch landing on ${target} at ${timeToEnd.toLocaleTimeString('en-US', { 'timeStyle': 'medium', 'hour12': false })} (${timeUntil})`);
      fireOnce = false;
    }
    //script, findAvailRam(ns, neededRam), threads, target, oTime, endTime, debug
    try {
      wPid = ns.exec('weaken.js', findAvailRam(ns, wRam, 0, debug), wThreads, target, wTime, endTime, debug);
    } catch ({ name, message }) {
      if (debug) {
        ns.print(`${name}: ${message}`)
      }
      await ns.sleep(wTime + buffer * 3);
      continue;
    }
    if (needSec == 0) {
      try {
        gPid = ns.exec('grow.js', findAvailRam(ns, gRam, 0, debug), gThreads, target, gTime, gEnd, debug);
      } catch ({ name, message }) {
        if (debug) {
          ns.print(`${name}: ${message} ${wPid}`)
        }
        ns.kill(wPid);
        await ns.sleep(wTime + buffer * 3);
        continue;
      }
    }
    pids.push(wPid);
    pids.push(gPid);
    await ns.sleep(buffer * 1);
    serverObj = ns.getServer(target);
    needCash = Math.abs(serverObj.moneyMax - serverObj.moneyAvailable);
    needSec = Math.abs(serverObj.hackDifficulty - serverObj.minDifficulty);
  }
  for (const script of pids) {
    ns.kill(script);
  }
  ns.toast(`${target} has been lubed!`, "success", null);
  ns.print(`${target} has been lubed!`);
}

export function autocomplete(data, args) {
  return [...data.servers];
}
