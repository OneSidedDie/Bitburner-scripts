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
  //Insert an exception for when wTime is shorter than (buffer *3) or grow is shorter than (buffer * 2) or hack is shorter than (buffer).  Should not actually be a problem without insanely high numbers. But y'know, just in case.
  ns.exec('weaken.js', findAvailableRam(wCost), wThreads, target, debug);
  await ns.sleep(wTime - gTime - buffer);
  ns.exec('grow.js', findAvailableRam(gCost), gThreads, target, debug);
  await ns.sleep(gTime - hTime - buffer);
  ns.exec('hack.js', findAvailableRam(hCost), hThreads, target, debug);
}
