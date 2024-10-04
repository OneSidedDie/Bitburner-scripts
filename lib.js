/** @param {NS} ns */
/** @param {number} amount - Amount of free RAM to find on any server that is available. */
/** @returns {string} - Name of host with required free RAM or 'none' if none available. */
export async function findFreeRam(ns, neededRAM) {
	const hosts = ns.read('hostsRAM.txt').split(',');
	for (let i = hosts.length, j = 0; i < j; i--) {
		const maxRam = ns.getServerMaxRam(hosts[i]);
		const ramUsed = ns.getServerUsedRam(hosts[i]);
		if (ns.hasRootAccess(hosts[i]) === true) {
			if (neededRAM <= maxRam - ramUsed) {
                          return hosts[i];
			}
		}
	}
	return 'none';
}
