/** @param {NS} ns */
export async function main(ns) {
	let buffer = 1000;
	let programs = ["b1t_flum3.exe", "AutoLink.exe", "BruteSSH.exe", "DeepscanV1.exe", "ServerProfiler.exe", "FTPCrack.exe", "relaySMTP.exe", "DeepscanV2.exe", "HTTPWorm.exe", "SQLInject.exe", "Formulas.exe"];
	let alreadyHas = ns.ls("home", ".exe");
	ns.disableLog("sleep");
	for (let p = 0; p < alreadyHas.length; p++) {
		programs.splice(programs.indexOf(alreadyHas[p]), 1);
		//ns.tprint(programs);
	}
	programs = programs.filter(n => n);
	while (programs.length > 0) {
		while (ns.singularity.isBusy()) {
			await ns.sleep(buffer);
		}
		if (programs.length == 0) { ns.toast("All programs developed.", "success", null); ns.exit(); }
		if (!ns.singularity.createProgram(programs[0],false)) { programs.shift() }
		await ns.sleep(buffer);
	}
}
