/** @param {NS} ns */
export async function main(ns) {
	let debug = false;
	if (debug) { ns.tail(); }
	let fake = false;
	let oneshot = false;
	let buffer = 200;
	let target = ns.args[0];
	let maxCash = ns.getServerMaxMoney(target);
	let server = ns.getServer(target);
	if (ns.getServerMaxMoney(target) == 0) { ns.tprint("Can't get blood from the ", target, " stone."); ns.exit(); }
	let host = ns.getServer(ns.getHostname());
	let hostName = host.hostname;
	let player = ns.getPlayer();
	let cores = host.cpuCores;
	let i = 1;
	let hackThreads = ns.args[1] ?? 1;
	while (true) {
		server = ns.getServer(target);
		player = ns.getPlayer();
		let curCash = ns.getServerMoneyAvailable(target);
		if (hackThreads < 1) { hackThreads = 1; }
		let hackDrain = (Math.ceil(curCash * ns.hackAnalyze(target)) * hackThreads) - hackThreads;
		let hackDamage = 0.02 * hackThreads;
		let growMult = ns.formulas.hacking.growPercent(server, 1, player, cores) - 1;
		let growThreads = Math.ceil((curCash / (curCash - hackDrain) - 1) / growMult);
		let growDamage = 0.1 * growThreads;
		let weakHeal = ns.weakenAnalyze(1, cores);
		let hackHeal = Math.ceil(hackDamage / weakHeal);
		let growHeal = Math.ceil(growDamage / weakHeal);
		let hTime = ns.getHackTime(target);
		let wTime = hTime * 4;
		let gTime = hTime * 3.2;

		//packages instuctions as strings
		let weak1 = [hackHeal, Math.ceil(wTime)].join();
		let weak2 = [growHeal, Math.ceil(wTime)].join();
		let grow1 = [growThreads, Math.ceil(gTime)].join();
		let hack1 = [hackThreads, Math.ceil(hTime)].join();
		if (hackHeal < 1 || growHeal < 1 || growThreads < 1 || hackThreads < 0) { debug = true; fake = true; }
		if (debug) {
			ns.tprint("target: ", target);
			ns.tprint("cores: ", cores);
			ns.tprint("maxCash: ", maxCash);
			ns.tprint("curCash: ", curCash);
			ns.tprint("hackThreads: ", hackThreads);
			ns.tprint("hackDrain: ", hackDrain, "  = Math.ceil(", maxCash, "*", ns.hackAnalyze(target), ")*", hackThreads);
			ns.tprint("hackDamage: ", hackDamage);
			ns.tprint("growMult: ", growMult);
			ns.tprint("growThreads: ", growThreads, " (Math.ceil((", maxCash, "/(", maxCash - hackDrain, "))*(", growMult * 100, "))");
			ns.tprint("growDamage: ", growDamage);
			ns.tprint("weakHeal: ", weakHeal);
			ns.tprint("hackHeal: ", hackHeal);
			ns.tprint("growHeal: ", growHeal);
			ns.tprint("weak1: ", weak1);
			ns.tprint("weak2: ", weak2);
			ns.tprint("grow1: ", grow1);
			ns.tprint("hack1: ", hack1);
			if (fake) { ns.exit(); }
		}
		ns.exec("salvo2.js", hostName, 1, hostName, target, weak1, weak2, grow1, hack1, i, buffer, debug);
		if (oneshot) { ns.exit(); }
		await ns.sleep(buffer * 6);
		i = i + 1;
		if (i == 1000) { i = 0 };
	}
}
