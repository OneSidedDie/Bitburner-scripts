import { getServerAvailRam } from 'lib.js';

/** @param {NS} ns */
export async function main(ns) {
  const ramCost = 1.75;
  while (true) {
    const hosts = JSON.parse(ns.read('hostsRam.txt'));
    for (const host of hosts) {
      const availRam = getServerAvailRam(ns, host.name);
      const threadCount = Math.floor(availRam / ramCost);
      if (threadCount <= 0 || host.name.includes('hacknet')) { //
        continue;
      }
      ns.exec('grow.js', host.name, threadCount, 'joesguns');
    }
    await ns.asleep(ns.getGrowTime('joesguns') + 50);
  }
}
