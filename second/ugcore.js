/** @param {NS} ns */
export async function main(ns) {
  const server = ns.getServer('home');
  const message = [];
  const cashAvailable = ns.getServerMoneyAvailable('home');
  const cost = ns.singularity.getUpgradeHomeCoresCost();
  if (ns.singularity.upgradeHomeCores()) {
    server.cpuCores++;
    message.push(`Upgraded 'home' cores (${server.cpuCores - 1} → ${server.cpuCores}) - $${ns.formatNumber(cost, 2, 1000, true)}`)
  } else if (server.moneyAvailable < cost) {
    message.push(`Need $${ns.formatNumber((cost - cashAvailable), 3)} more to upgrade home cores to ${server.cpuCores + 1}`)
  } else {
    message.push(`Unable to upgrade cores on 'home'.  Possibally at maximum cores allowed`)
  }
  message.push(`Home server cores: ${server.cpuCores}`);
  for (const line of message) {
    ns.tprint(line);
  }
}
