import { pwn, getRootedServersWithRam } from 'lib.js';

/** @param {NS} ns */
export async function main(ns) {
  const buffer = 50;
  const hosts = ['home'];
  const serverObjs = [];
  for (let i = 0; i < hosts.length; i++) {
    let thisScan = ns.scan(hosts[i]);
    for (let j = 0; j < thisScan.length; j++) {
      if (hosts.indexOf(thisScan[j]) == -1) {
        hosts.push(thisScan[j]);
        if (thisScan[j] === 'darkweb') { continue }
        if (!thisScan[j].startsWith('pserv')) {
          pwn(ns, thisScan[j]);
          const curServer = ns.getServer(thisScan[j]);
          curServer.moneyAvailable = curServer.moneyMax;
          curServer.hackDifficulty = curServer.minDifficulty;
          serverObjs.push(curServer);
        }
      }
    }
    await ns.sleep(buffer);
  }
  ns.write('hostNames.txt', hosts.join(), "w");
  ns.write('serverObs.txt', JSON.stringify(serverObjs), 'w');
  getRootedServersWithRam(ns);
  const sortedServerObjs = serverObjs.sort((a, b) => a.numOpenPortsRequired - b.numOpenPortsRequired);
  for (let i = 0, j = sortedServerObjs.length; i < j; i++) {
    while (!pwn(ns, sortedServerObjs[i].hostname)) {
      await ns.sleep(10000);
    }
  }
  ns.tail();
  ns.print("All servers have been pwn'd.");
}
