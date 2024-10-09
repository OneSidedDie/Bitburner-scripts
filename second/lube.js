import { getServerAvailRam } from 'lib.js';

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
  let reserved = 0;
  while (minSec < curSec || curCash < maxCash || forever) {
    curSec = ns.getServerSecurityLevel(target);
    curCash = ns.getServerMoneyAvailable(target);
    let threads = Math.floor(getServerAvailRam(ns, self, reserved) / ramCost);
    if (threads === 0) {
      await ns.sleep(10000);
      continue;
    }
    if (minSec < curSec) {
      ns.exec('weaken.js', self, threads, target, true);
      await ns.asleep(ns.getWeakenTime(target));
    } else if (curCash < maxCash) {
      ns.exec('grow.js', self, threads, target, true);
      await ns.asleep(ns.getGrowTime(target));
    }
    await ns.sleep(50);
  }
  ns.toast(`${target} has been lubed.`, "success", null);
  ns.exit();
}
