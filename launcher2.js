import { findAvailableRam } from 'lib.js';

/** @param {NS} ns */
export async function main(ns) {
  const [target, hTime, gTime, wTime, hThreads, gThreads, wThreads, buffer, debug] = ns.args[0]; //Grab the values sent from the batcher script to use.
  if (!debug) {
    ns.disableLogs('ALL');
  }
  const hCost = 1.7 * hThreads; //Ram (GB) needed to run hThreads worth of hack.js
  const gCost = 1.75 * gThreads;//Ram (GB) needed to run gThreads worth of grow.js
  const wCost = 1.75 * wThreads;//Ram (GB) needed to run wThreads worth of weaken.js
  const batch = [];
  batch.push({ 'scriptName': 'hack.js', 'time': buffer * 2 + hTime });
  batch.push({ 'scriptName': 'grow.js', 'time': buffer + gTime });
  batch.push({ 'scriptName': 'weaken.js', 'time': wTime });
  batch.sort((a, b) => a.time - b.time);
  for (i = 0, j = batch.length; i < j; i++) {
    switch (batch[i].scriptName) {
      case 'weaken.js':
        ns.exec('weaken.js', findAvailableRam(wCost), wThreads, target, debug);
        break;
      case 'grow.js':
        ns.exec('grow.js', findAvailableRam(gCost), gThreads, target, debug);
        break;
      case 'hack.js':
        ns.exec('hack.js', findAvailableRam(hCost), hThreads, target, debug);
        break;
    }
    if (i === j) {
      ns.exit();
    }
    await ns.sleep(batch[i].time - batch[i + 1].time);
  }
}
