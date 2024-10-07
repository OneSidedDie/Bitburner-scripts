import { findAvailableRam } from 'lib.js';

/** @param {NS} ns */
export async function main(ns) {
  const debug = false; // Boolean set to true for verbose logging
  if (!debug) {
    ns.disableLog('ALL');
  }
  const lCost = 2.9; //Ram (GB) cost of 'launcher.js'
  const target = ns.args[0]; // String name of server to hack
  const hosts = ns.read('hosts.txt').split(',');
  if (hosts.indexOf(target) === -1) {
    ns.tprint('Batcher, Invalid hostname: ' + target);
  }
  const buffer = 500; //ms between calls so they don't overlap 
  while (true) {
    const hTime = ns.getHackTime(target);
    const gTime = hTime * 3.2; // Grow time is *always 3.2 times longer than hack time.
    const wTime = hTime * 4; // Weaken time is *always 4 times longer than hack time.
    // Insert function to determine total available RAM 'slots' across all servers for optimal thread usage.  For now use inefficient but easy 1/10/2 ratio for HGW.
    const hThreads = 1;
    const gThreads = 10;
    const wThreads = 2;
    ns.exec('launcher.js', findAvailableRam(lCost), 1, [target, hTime, gTime, wTime, hThreads, gThreads, wThreads, buffer, debug]);
    await ns.sleep(buffer * 4);
  }
}
