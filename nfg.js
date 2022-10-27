/** @param {NS} ns */
export async function main(ns) {
	var debug = false;
	ns.disableLog("sleep");
	ns.disableLog("singularity.purchaseAugmentation");
	ns.run("startup.js");
	//	ns.run("dev.js");
	ns.run("gearup.js");
	ns.run("lube.js", 1, "joesguns");
	let buffer = 2000;
	ns.tail();
	let avAug = getAvailableAugs(ns, debug);
	let runs = 0;
	let installed = ns.singularity.getOwnedAugmentations(true).length - ns.singularity.getOwnedAugmentations().length;
	let factionNum = ns.getPlayer().factions.length;
	let delay = 600000;
	const cycles = 1000;
	while (delay > 0) {
		ns.clearLog();
		ns.print(new Date(delay).toISOString().slice(11, 19));
		await ns.sleep(cycles);
		delay -= cycles;
	}
	while (true) {
		if (debug) { ns.print(avAug); }
		let invites = ns.singularity.checkFactionInvitations() ?? 0;
		if (invites.length > 0) {
			let joined = 0;
			for (let i = 0; i < invites.length; i++) {
				let dontJoin = ["Aevum", "Chongqing", "Ishima", "New Tokyo", "Sector-12", "Volhaven"]
				if (dontJoin.includes(invites[i])) {
					continue;
				}
				ns.singularity.joinFaction(invites[i]);
				joined += 1;
				runs = 0;
			}
			if (joined > 0) {
				avAug = getAvailableAugs(ns, debug);
			}
			factionNum = ns.getPlayer().factions.length;
		}
		if (factionNum < ns.getPlayer().factions.length) {
			avAug = getAvailableAugs(ns, debug);
		}
		for (let i = 0; i < avAug.length; i++) {
			//ns.print(avAug[i] + "[" + i + "]");
			if (avAug[i].cost <= ns.getPlayer().money) {
				if (ns.singularity.purchaseAugmentation(avAug[i].faction, avAug[i].name)) {
					installed = ns.singularity.getOwnedAugmentations(true).length - ns.singularity.getOwnedAugmentations().length;
					runs = 0;
				}
			}
		}
		runs = runs + 1;
		ns.clearLog();
		avAug = getAvailableAugs(ns, debug);
		ns.print(runs, "/150 runs Installed: ", installed);
		await ns.sleep(buffer);
		if (avAug[0].cost > ns.getPlayer().money && runs >= 150 && installed > 0) {
			while (ns.singularity.upgradeHomeRam()) {
				await ns.sleep(buffer)
			}
			while (ns.singularity.upgradeHomeCores()) {
				await ns.sleep(buffer);
			}
			ns.singularity.installAugmentations("nfg.js");
		}

	}
}

/** @param {NS} ns */
function getAvailableAugs(ns, debug) {
	let player = ns.getPlayer();
	let factions = player.factions;
	let curAug = ns.singularity.getOwnedAugmentations(true);
	if (curAug.includes("NeuroFlux Governor")) {
		while (curAug.includes("NeuroFlux Governor")) {
			curAug.splice(curAug.indexOf("NeuroFlux Governor"), 1);
		}
	}
	let avAug2 = [];
	for (let f = 0; f < factions.length; f++) {
		if (factions[f] == "Shadows of Anarchy") { continue }
		let avAug1 = ns.singularity.getAugmentationsFromFaction(factions[f]);
		for (let i = 0; i < avAug1.length; i++) {
			if (debug) { ns.print("[", i, "]", curAug[i], " = ", curAug.includes(avAug1[i])); }
			if (!curAug.includes(avAug1[i])) {
				if (avAug1[i] == "CashRoot Starter Kit" || avAug1[i] == "PCMatrix" || avAug1[i] == "The Red Pill") { continue }
				avAug2.push({ "name": avAug1[i], "cost": ns.singularity.getAugmentationPrice(avAug1[i]), "faction": factions[f] });
			}
		}
	}
	avAug2.sort((a, b) => b.cost - a.cost);
	if (debug) { ns.print(avAug2); }
	return avAug2;
}
