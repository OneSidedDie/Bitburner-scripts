/** @param {NS} ns */
export async function main(ns) {
	var debug = false;
	ns.disableLog("sleep");
	ns.disableLog("singularity.purchaseAugmentation");
	ns.run("startup.js");
	ns.run("dev.js");
	ns.run("gearup.js");
	ns.run("lube.js", 1, "joesguns");
	let buffer = 1000;
	ns.tail();
	let avAug = getAvailableAugs(ns, debug);
	let runs = 0;
	let installed = ns.singularity.getOwnedAugmentations(true).length - ns.singularity.getOwnedAugmentations().length;
	let delay = 600000;
	const cycles = 1000;
	while (delay > 0) {
		ns.clearLog();
		ns.print(new Date(delay).toISOString().slice(11, 19));
		await ns.sleep(cycles);
		delay -= cycles;
		if (joinFactions(ns, debug) > 0) {
			avAug = getAvailableAugs(ns, debug);
		}
	}
	delay = 300000;
	while (true) {
		ns.clearLog();
		ns.print(new Date(delay).toISOString().slice(11, 19), " Installed: ", installed);
		if (debug) { ns.print(avAug); }
		for (let i = 0; i < avAug.length; i++) {
			//ns.print(avAug[i] + "[" + i + "]");
			if (avAug[i].cost <= ns.getPlayer().money) {
				if (ns.singularity.purchaseAugmentation(avAug[i].faction, avAug[i].name)) {
					installed = ns.singularity.getOwnedAugmentations(true).length - ns.singularity.getOwnedAugmentations().length;
					delay = 300000;
				}
			}
		}
		if (joinFactions(ns, debug) > 0) {
			avAug = getAvailableAugs(ns, debug);
			delay = 300000;
		}
		avAug = getAvailableAugs(ns, debug);
		await ns.sleep(buffer);
		if (avAug[0].cost > ns.getPlayer().money && delay < 0 && installed > 0) {
			while (ns.singularity.upgradeHomeRam()) {
				await ns.sleep(buffer)
			}
			while (ns.singularity.upgradeHomeCores()) {
				await ns.sleep(buffer);
			}
			ns.singularity.installAugmentations("nfg.js");
		}
		delay -= 1000;
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

/** @param {NS} ns */
function joinFactions(ns, debug) {
	let invites = ns.singularity.checkFactionInvitations();
	let joined = 0;
	if (invites.length > 0) {
		let curFactions = ns.getPlayer().factions;
		let dontJoin = ["Aevum", "Chongqing", "Ishima", "New Tokyo", "Sector-12", "Volhaven"];
		const intersection = curFactions.filter(element => dontJoin.includes(element));
		if (intersection.length > 0) {
			dontJoin = [];
		}
		for (let i = 0; i < invites.length; i++) {
			if (dontJoin.includes(invites[i])) {
				continue;
			}
			ns.singularity.joinFaction(invites[i]);
			joined += 1;
		}
	}
	return joined;
}
