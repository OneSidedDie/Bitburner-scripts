import { findAvailRam } from 'lib.js';

/** @param {NS} ns */
export async function main(ns) {
  const debug = false; // Boolean set to true for verbose logging
  if (!debug) {
    ns.disableLog('ALL');
  } else {
    ns.tail();
  }
  const lCost = 3; //Ram (GB) cost of 'launcher.js'
  const target = ns.args[0]; // String name of server to hack
  const hosts = ns.read('hostNames.txt').split(',');
  if (hosts.indexOf(target) === -1) {
    ns.tprint(`Batcher, Invalid hostname: ${target}`);
  }
  const buffer = 200; //ms between calls so they don't overlap
  let oneTime = true;
  while (true) {
    const hTime = Math.floor(ns.getHackTime(target));
    const gTime = hTime * 3.2; // Grow time is *always 3.2 times longer than hack time.
    const wTime = hTime * 4; // Weaken time is *always 4 times longer than hack time.
    // Insert function to determine total available RAM 'slots' across all servers for optimal thread usage.  For now use inefficient but easy 1/10/2 ratio for HGW.
    const hThreads = 1;
    const gThreads = 10;
    const wThreads = 2;
    const instructions = JSON.stringify([target, hTime, gTime, wTime, hThreads, gThreads, wThreads, buffer, debug]);
    ns.exec('launcher.js', findAvailRam(ns, lCost), 1, instructions);
    if (debug) {
      ns.print(instructions);
    }
    if (oneTime) {
      ns.tprint(`Batcher: first hack on ${target} landing in ${((wTime - (buffer * 2)) / 1000)}s`);
      ns.print(`Batcher: first hack on ${target} landing in ${((wTime - (buffer * 2)) / 1000)}s`);
      oneTime = false;
    } await ns.sleep(buffer * 3);
    if (debug) {
      ns.exit();
    }
  }
}
