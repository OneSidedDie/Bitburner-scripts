import { findAvailRam } from 'lib.js';

/** @param {NS} ns */
export async function main(ns) {
  const debug = false; //Set true to enable logs.
  ns.tail();
  const target = ns.args[0];
  if (!debug) {
    ns.disableLog('ALL');
  } else {
    ns.tail();
    ns.print(ns.args[0]);
    ns.print(`Launcher, debug: ${debug}`);
  }

  while (true) {
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

    let hThreads = threadMult;
    let gThreads = 2 * threadMult;
    const wThreads1 = 1;
    const wThreads2 = 1;
    if (target === 'n00dles') {
      hThreads = 4 * threadMult;
      gThreads = threadMult;
    }
    const hRam = 1.7 * hThreads; //Ram (GB) needed to run hThreads worth of hack.js
    const gRam = 1.75 * gThreads;//Ram (GB) needed to run gThreads worth of grow.js
    const wRam1 = 1.75 * wThreads1;//Ram (GB) needed to run wThreads worth of weaken.js
    const wRam2 = 1.75 * wThreads2;//Ram (GB) needed to run wThreads worth of weaken.js

    const buffer = 100;
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
    const batchPids = [];
    //script, findAvailRam(ns, neededRam), threads, target, oTime, endTime, debug
    try {
      batchPids.push = ns.exec('weaken.js', findAvailRam(ns, wRam1), wThreads1, target, wTime1, endTime, debug);
    } catch ({ name, message }) {
      if (debug) {
        ns.print(`${name}: ${message}`)
      }
      clearBatch(ns, batchPids)
      await ns.sleep(buffer * 3);
      continue;
    }
    try {
      batchPids.push = ns.exec('weaken.js', findAvailRam(ns, wRam2), wThreads2, target, wTime1, wEnd, debug);
    } catch ({ name, message }) {
      if (debug) {
        ns.print(`${name}: ${message}`)
      }
      clearBatch(ns, batchPids);
      await ns.sleep(buffer * 3);
      continue;
    }
    try {
      batchPids.push = ns.exec('grow.js', findAvailRam(ns, gRam), gThreads, target, gTime, gEnd, debug);
    } catch ({ name, message }) {
      if (debug) {
        ns.print(`Error ${name}: ${message}`)
      }
      clearBatch(ns, batchPids);
      await ns.sleep(buffer * 3);
      continue;
    }
    try {
      ns.exec('hack.js', findAvailRam(ns, hRam), hThreads, target, hTime, hEnd, debug);
    } catch ({ name, message }) {
      if (debug) {
        ns.print(`Error ${name}: ${message}`)
      }
      clearBatch(ns, batchPids);
      await ns.sleep(buffer * 3);
      continue;
    }
    await ns.sleep(buffer * 3);
  }
}

/** 
 * Kills all running scripts in the batch if it can not run all 4.
 * @param {NS} ns 
 * @param {number[]} batchPids - An array of all PIDs created to be killed due to an error.
 * */
function clearBatch(ns, batchPids) {
  for (const scriptPID of batchPids) {
    ns.kill(scriptPID);
  }
}
