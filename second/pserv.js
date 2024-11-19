import { getRootedServersWithRam, distributeFiles } from 'lib.js';

/** @param {NS} ns */
export async function main(ns) {
  const col = {
    "r": "\x1b[31m",
    "g": "\x1b[32m",
    "b": "\x1b[34m",
    "c": "\x1b[36m",
    "m": "\x1b[35m",
    "y": "\x1b[33m",
    "bk": "\x1b[30m",
    "w": "\x1b[37m",
    "d": "\x1b[0m" //default color
  }
  const cash = ns.getServerMoneyAvailable('home');
  const hosts = ns.read('hostNames.txt').split(',');
  const files = ['hack.js', 'grow.js', 'weaken.js', 'xp.js', 'share.js', 'goto.js', 'shareAll.js', 'lib.js'];
  const input = ns.args[0];
  const upgrade = ns.args[1] ?? false;
  let power = 2 ** input;
  const limit = ns.getPurchasedServerLimit();
  if (limit === 0) {
    ns.tprint('This bitnode does not allow you to purchase servers.');
    ns.exit();
  }
  const maxRam = ns.getPurchasedServerMaxRam();
  const servers = ns.getPurchasedServers();
  let price = 0;
  let ownedServers = servers.length;
  let purchased = 0;
  let upgraded = 0;
  let report = [];

  try {
    price = ns.getPurchasedServerCost(power);
  } catch {
    //Check inputs and report error.
    if (isNaN(power) || power < 4) {
      ns.tprint(`: Please enter a power from 4 to ${Math.log2(maxRam)}.`);
      ns.tprint(`: Usage: pserv [4-${Math.log2(maxRam)} || ?]`);
      ns.tprint(`You have ${ownedServers}/${limit} servers purchased.`);
      ns.exit();
    }
  }

  if (power > maxRam) {
    ns.tprint(`: Maximum ram is limited to ${Math.log2(maxRam)}.`);
    ns.tprint(`: Usage: pserv [4-${Math.log2(maxRam)} || ?]`);
    ns.tprint(`You have ${ownedServers}/${limit} servers purchased.`);
    ns.exit();
  }

  if (upgrade === '?') {
    ns.tprint(`You have ${ownedServers}/${limit} servers purchased.`);
  }

  while (ownedServers <= limit) {
    const newServer = ns.purchaseServer(`pserv${ownedServers + 1}`, power);
    if (newServer.length > 0) {
      ownedServers++;
      purchased++;
      hosts.push(newServer);
    } else {
      break;
    }
  }

  if (upgrade) {
    for (const server of servers) {
      if (ns.upgradePurchasedServer(server, power)) {
        upgraded++;
      }
    }
  }

  switch (purchased) {
    case 0:
      report.push('Unable to purchase any servers.');
      break;
    case 1:
      report.push(`Purchased ${purchased} server with ${ns.formatRam(power)} for $${ns.formatNumber(price * purchased, 2)}.`);
      break
    default:
      report.push(`Purchased ${purchased} servers with ${ns.formatRam(power * purchased)}(${ns.formatRam(power)} each) for $${ns.formatNumber(price * purchased, 2)}.`);
  }
  if (upgrade) {
    switch (upgraded) {
      case 0:
        report.push(`Unable to upgrade any servers.`);
        break;
      case 1:
        report.push(`Upgraded ${upgraded} server with ${ns.formatRam(power)} for $${ns.formatNumber(price * upgraded, 2)}.`);
        break
      default:
        report.push(`Upgraded ${upgraded} servers with ${ns.formatRam(power * upgraded)}(${ns.formatRam(power)} each) for $${ns.formatNumber(price * upgraded, 2)}.`);
    }
  }
  for (const entry of report) {
    ns.tprint(entry);
  }

  ns.tprint(`You have ${ownedServers}/${limit} servers purchased.`);

  if (purchased > 0 || upgraded > 0) {
    ns.write('hostNames.txt', hosts.join(), 'w');
    getRootedServersWithRam(ns);
    distributeFiles(ns, files);
  } else if (ownedServers === limit) {
    let maxedServers = 0;
    for (const server of servers) {
      if (ns.getServerMaxRam(server) === maxRam) {
        maxedServers++;
      }
    }


    if (upgrade && maxedServers === ownedServers) {
      ns.tprint(`You already have maximum servers at maximum RAM capacity.  pserv will not serve you.`);
      ns.exit();
    } else {
      ns.tprint(`You are at the maximum number of servers. Use pserv [4-${Math.log2(maxRam)}] to upgrade.`);
    }

    ns.tprint(col.r + `Need $${ns.formatNumber((price - cash), 3)} more to purchase/upgrade a ${ns.formatRam(power)} server`);

  }
}
