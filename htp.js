/** @param {NS} ns */
export async function main(ns) {
	let debug = false;
	if (debug) { ns.tail(); }
	if (ns.getHostname() != "home") { ns.scp(["hosts.txt", "packages.txt"], ns.getHostname(), "home"); }
	let file = ns.read("hosts.txt");
	let hosts = file.split(",");
	let max = hosts.length;
	let packages = ns.ls("home", ".js");
	let hlvl = ns.getHackingLevel();
	let pwnd = 1;
	let target = ns.args[0] ?? "n00dles";
	let wgh = ["weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "weaks.js", "grows.js", "weaks.js", "hacks.js"];
	let i = 0;
	for (let runs = 1; max > runs; runs++) {
		ns.scp("hosts.txt", hosts[runs], "home");
		ns.scp(packages, hosts[runs], "home");
		if (ns.fileExists("BruteSSH.exe", "home")) { ns.brutessh(hosts[runs]) };
		if (ns.fileExists("FTPcrack.exe", "home")) { ns.ftpcrack(hosts[runs]) };
		if (ns.fileExists("relaySMTP.exe", "home")) { ns.relaysmtp(hosts[runs]) };
		if (ns.fileExists("HTTPworm.exe", "home")) { ns.httpworm(hosts[runs]) };
		if (ns.fileExists("SQLInject.exe", "home")) { ns.sqlinject(hosts[runs]) };
		let server = ns.getServer(hosts[runs]);
		if (server.numOpenPortsRequired <= server.openPortCount || server.hostname.startsWith("server")) {
			ns.nuke(hosts[runs]);
			pwnd = pwnd + 1;
			if (hlvl >= ns.getServerRequiredHackingLevel(target) || server.hostname.startsWith("server")) {
				let unique = 0;
				if (debug) { ns.tprint(wgh[i], " ", i, " ", unique, " whg.length ", wgh.length); }
				let success = ns.exec(wgh[i], hosts[runs], 1, target, true, unique);
				while (success != 0) {
					unique = unique + 1;
					i = i + 1;
					if (i == wgh.length) { i = 0; }
					if (debug) { ns.tprint(wgh[i], " ", i, " ", unique, " whg.length ", wgh.length); }
					let ramMult = Math.log2(ns.getServerMaxRam(hosts[runs]));
					success = ns.exec(wgh[i], hosts[runs], ramMult, target, true, unique);
					await ns.sleep(10);
				}
			}
		}
		await ns.sleep(10);
	}
	ns.exec("solver.js", "home");
	ns.tprint("Hacked the planet! ", pwnd, "/", hosts.length, " hosts PWNd.");
}
