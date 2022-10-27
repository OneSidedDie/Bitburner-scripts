/** @param {NS} ns */
export async function main(ns) {
	ns.singularity.purchaseTor();
	let programs = ns.singularity.getDarkwebPrograms();
	for (let i = 0; i < programs.length; i++) {
		ns.singularity.purchaseProgram(programs[i]);
	}
}
