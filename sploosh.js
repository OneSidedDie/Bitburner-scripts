/** @param {NS} ns */
export async function main(ns) {
	let file = ns.read("hosts.txt");
	let hosts = file.split(",");
	let max = hosts.length;
	let hlvl = ns.getHackingLevel();
	let target = ns.args[0];
	let forever = ns.args[1] ?? false;
	if (target == null) {
		ns.tprint("sploosh usage: sploosh targetHost");
		ns.exit();
	}
	else if (hlvl >= ns.getServerRequiredHackingLevel(target)) {
		for (let runs = 1; max > runs; runs++) {
			if (ns.hasRootAccess(hosts[runs])) {
				ns.exec("lube.js", hosts[runs], 1, target, 0, false, forever);
				await ns.sleep(1000);
			}
		}
	}
	else {
		ns.tprint("You need ", ns.getServerRequiredHackingLevel(target), " to hack ", target);
	}

}
