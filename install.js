/** @param {NS} ns */
export async function main(ns) {
	while (ns.singularity.upgradeHomeRam()) {
		await ns.sleep(buffer)
	}
	while (ns.singularity.upgradeHomeCores()) {
		await ns.sleep(buffer);
	}
	ns.singularity.installAugmentations("nfg.js");
}
