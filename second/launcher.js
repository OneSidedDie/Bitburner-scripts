import { findAvailRam } from 'lib.js';

/** @param {NS} ns */
export async function main(ns) {
  const [target, hTime, gTime, wTime, hThreads, gThreads, wThreads, buffer, debug] = JSON.parse(ns.args[0]); //Grab the values sent from the batcher script to use.
  if (!debug) {
    ns.disableLog('ALL');
  } else {
    ns.tail();
    ns.print(`Launcher, target: ${target}`);
    ns.print(ns.args[0]);
    ns.print(`Launcher, debug: ${debug}`);
  }
  const hCost = 1.7 * hThreads; //Ram (GB) needed to run hThreads worth of hack.js
  const gCost = 1.75 * gThreads;//Ram (GB) needed to run gThreads worth of grow.js
  const wCost = 1.75 * wThreads;//Ram (GB) needed to run wThreads worth of weaken.js
  const batch = [];
  batch.push({ 'scriptName': 'hack.js', 'time': (buffer * 2) + hTime });
  batch.push({ 'scriptName': 'grow.js', 'time': buffer + gTime });
  batch.push({ 'scriptName': 'weaken.js', 'time': wTime });
  batch.sort((a, b) => b.time - a.time);
  const wait1 = batch[0].time - batch[1].time;
  const wait2 = batch[1].time - batch[2].time;
  for (let i = 0, j = batch.length; i < j; i++) {
    if (debug) {
      ns.print(`Launcher, scriptName: ${batch[i].scriptName}`);
      ns.print(`Launcher, batch: ${JSON.stringify(batch)}`);
      ns.print(`Launcher, wait1 - wait2: ${wait1}-${wait2}`);
    }
    switch (batch[i].scriptName) {
      case 'weaken.js':
        ns.exec('weaken.js', findAvailRam(ns, wCost), wThreads, target, debug);
        break;
      case 'grow.js':
        ns.exec('grow.js', findAvailRam(ns, gCost), gThreads, target, debug);
        break;
      case 'hack.js':
        ns.exec('hack.js', findAvailRam(ns, hCost), hThreads, target, debug);
        break;
    }
    if (i === j - 1) {
      ns.exit();
    }
    await ns.sleep(batch[i].time - batch[i + 1].time);
  }
}
