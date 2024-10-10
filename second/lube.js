import { getServerAvailRam, findAvailRam } from 'lib.js';

/** @param {NS} ns */
export async function main(ns) {
  const ramCost = 1.75
  const target = ns.args[0];
  const forever = ns.args[1] ?? false;
  const minSec = ns.getServerMinSecurityLevel(target)
  let curSec = ns.getServerSecurityLevel(target);
  const maxCash = ns.getServerMaxMoney(target);
  let curCash = ns.getServerMoneyAvailable(target);
  const self = ns.getRunningScript().server;
  while (minSec < curSec || curCash < maxCash || forever) {
    curSec = ns.getServerSecurityLevel(target);
    curCash = ns.getServerMoneyAvailable(target);
    const hosts = ns.read('hostsRam.txt').split(',');
    //let threads = Math.floor(getServerAvailRam(ns, self, reserved) / ramCost);
    if (minSec < curSec) {
      for (let i = 0, j = hosts.length; i < j; i++) {
        //target, opTime, endTime, debug
        ns.exec('weaken.js', findAvailRam(ns, ramCost), 1, target, 0, 0, true);
        await ns.sleep(50);
      }
    } else if (curCash < maxCash) {
      for (let i = 0, j = hosts.length; i < j; i++) {
        //target, opTime, endTime, debug
        ns.exec('grow.js', findAvailRam(ns, ramCost), 1, target, 0, 0, true);
        await ns.asleep(50);
      }
    }
    await ns.sleep(50);
  }
  ns.toast(`${target} has been lubed.`, "success", null);
  ns.exit();
}
