import { findAvailRam, calcRatios } from 'lib.js';

/** @param {NS} ns */
export async function main(ns) {
  const debug = false; //Set true to enable logs.
  const target = ns.args[0];
  let hThreads = ns.args[1] ?? 1;
  const buffer = 50;

  if (target === null) {
    ns.tprint('batcher.js usage: batcher.js [target] [hackThreads]');
  }

  if (!debug) {
    ns.disableLog('ALL');
  } else {
    ns.tail();
    ns.tprint(ns.args[0]);
    ns.tprint(`Launcher, debug: ${debug}`);
  }
  let fireOnce = true;
  while (true) {

    const playerObj = ns.getPlayer();
    const serverObj = ns.getServer(target);
    const threads = calcRatios(ns, hThreads, playerObj, serverObj);
    let gThreads = threads.gThreads;
    const wThreads1 = threads.wThreadsH;
    const wThreads2 = threads.wThreadsG;
    const hRam = 1.7 * hThreads; //Ram (GB) needed to run hThreads worth of hack.js
    const gRam = 1.75 * gThreads;//Ram (GB) needed to run gThreads worth of grow.js
    const wRam1 = 1.75 * wThreads1;//Ram (GB) needed to run wThreads worth of weaken.js
    const wRam2 = 1.75 * wThreads2;//Ram (GB) needed to run wThreads worth of weaken.js
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
    const timeUntil = ns.tFormat(hEnd - startTime);
    if (fireOnce) {
      const timeToEnd = new Date(wEnd);
      ns.tprint(`First batch landing at ${timeToEnd.toLocaleTimeString('en-US', { 'timeStyle': 'medium', 'hour12': false })} (${timeUntil})`);
      ns.print(`First batch landing at ${timeToEnd.toLocaleTimeString('en-US', { 'timeStyle': 'medium', 'hour12': false })} (${timeUntil})`);
      fireOnce = false;
    }
    //script, findAvailRam(ns, neededRam), threads, target, oTime, endTime, debug
    try {
      batchPids.push = ns.exec('weaken.js', findAvailRam(ns, wRam1), wThreads1, target, wTime1, endTime, debug);
    } catch ({ name, message }) {
      if (debug) {
        ns.print(`${name}: ${message} `)
      }
      clearBatch(ns, batchPids)
      await ns.sleep(buffer * 3);
      continue;
    }
    try {
      batchPids.push = ns.exec('weaken.js', findAvailRam(ns, wRam2), wThreads2, target, wTime1, wEnd, debug);
    } catch ({ name, message }) {
      if (debug) {
        ns.print(`${name}: ${message} `)
      }
      clearBatch(ns, batchPids);
      await ns.sleep(buffer * 3);
      continue;
    }
    try {
      batchPids.push = ns.exec('grow.js', findAvailRam(ns, gRam), gThreads, target, gTime, gEnd, debug);
    } catch ({ name, message }) {
      if (debug) {
        ns.print(`Error ${name}: ${message} `)
      }
      clearBatch(ns, batchPids);
      await ns.sleep(buffer * 3);
      continue;
    }
    try {
      ns.exec('hack.js', findAvailRam(ns, hRam), hThreads, target, hTime, hEnd, debug);
    } catch ({ name, message }) {
      if (debug) {
        ns.print(`Error ${name}: ${message} `)
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

export function autocomplete(data, args) {
  return [...data.servers];
}
