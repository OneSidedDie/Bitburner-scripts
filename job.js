/** @param {NS} ns */
export async function main(ns) {
	let gangRoster = ns.gang.getMemberNames();
	let jobSelection = ns.args[0] ?? "poop";
	let gangJobs = ["Unassigned", "Mug People", "Deal Drugs", "Strongarm Civilians", "Run a Con", "Armed Robbery", "Traffick Illegal Arms", "Threaten & Blackmail", "Human Trafficking", "Terrorism", "Vigilante Justice", "Train Combat", "Train Hacking", "Train Charisma", "Territory Warfare"];
	let jobValid = false;
	switch (jobSelection.toLowerCase()) {
		case "mp": jobSelection = "Mug People"; break;
		case "dd": jobSelection = "Deal Drugs"; break;
		case "sc": jobSelection = "Strongarm Civilians"; break;
		case "rc": jobSelection = "Run a Con"; break;
		case "ar": jobSelection = "Armed Robery"; break;
		case "tia": jobSelection = "Traffick Illegal Arms"; break;
		case "tb": jobSelection = "Threaten & Blackmail"; break;
		case "ht": jobSelection = "Human Trafficking"; break;
		case "te": jobSelection = "Terrorism"; break;
		case "vj": jobSelection = "Vigilante Justice"; break;
		case "tcom": jobSelection = "Train Combat"; break;
		case "thack": jobSelection = "Train Hacking"; break;
		case "tcha": jobSelection = "Train Charisma"; break;
		case "tw": jobSelection = "Territory Warfare"; break;
		case "war": jobSelection = "Territory Warfare"; break;
		case "ter": jobSelection = "Terrorism"; break;
	}
	for (let i = 0; i < gangJobs.length; i++) {
		if (gangJobs[i].toLowerCase() == jobSelection.toLowerCase()) {
			jobSelection = gangJobs[i];
			jobValid = true;
			break;
		}
	}
	if (!jobValid) { ns.tprint("Job type ", jobSelection, " not found."); ns.exit(); }
	for (let i = 0; i < gangRoster.length; i++) {
		ns.gang.setMemberTask(gangRoster[i], jobSelection);
	}
	ns.tprint("All gang members set to ", jobSelection);
}
