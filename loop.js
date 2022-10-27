/** @param {NS} ns */
export async function main(ns) {
	let script = ns.args[0];
	let target = ns.args[1];
	let count = ns.args[2];
	let self = ns.getHostname();
	let maxRam = ns.getServerMaxRam(self);
	let usedRam = ns.getServerUsedRam(self);
	let cost = ns.getScriptRam(script);
	let freeRam = maxRam - usedRam
	let programs = Math.floor(freeRam / cost);
	let threads = programs / count;
	if (threads == 0) {
		ns.tprint("Looping ", script, " failed. Not enough RAM.");
		ns.exit();
	}
	let timer = Math.floor(ns.getWeakenTime(target) / count);
	for (let i = 0; i < count; i++) {
		ns.run(script, threads, target, i);
		await ns.sleep(timer);
	}
}
