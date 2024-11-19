import { getRootedServersWithRam } from 'lib.js';
/** @param {NS} ns */
export async function main(ns) {
  const server = ns.getServer('home');
  const upgradedRAM = server.maxRam * 2;
  const message = [];
  const cashAvailable = ns.getServerMoneyAvailable('home');
  const cost = ns.singularity.getUpgradeHomeRamCost();
  if (ns.singularity.upgradeHomeRam()) {
    getRootedServersWithRam(ns);
    message.push(`Upgraded 'home' RAM (${ns.formatRam(server.maxRam)} → ${ns.formatRam(upgradedRAM)}) - $${ns.formatNumber(cost, 2, 1000, true)}`)
  } else if (server.moneyAvailable < cost) {
    message.push(`Need $${ns.formatNumber((cost - cashAvailable), 3)} more to upgrade RAM to ${ns.formatRam(upgradedRAM)}`)
  } else {
    message.push(`Unable to upgrade RAM on 'home'.  Possibally at maximum RAM allowed`)
  }
  message.push(`Home server RAM: ${ns.formatRam(server.maxRam)}`);
  for (const line of message) {
    ns.tprint(line);
  }
}
