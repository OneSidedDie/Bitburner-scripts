/** @param {NS} ns */
export async function main(ns) {
  const ramCost = 1.75;
  while (true) {
    let maxRAM = ns.getServerMaxRam('home');
    let usedRAM = ns.getServerUsedRam('home');
    let availRAM = maxRAM - usedRAM;
    let threadCount = Math.floor(availRAM / ramCost);
    ns.run('grow.js', threadCount, 'joesguns');
    await ns.asleep(ns.getGrowTime('joesguns') + 200);
  }
}
