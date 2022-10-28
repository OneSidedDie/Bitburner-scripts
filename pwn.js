/** @param {NS} ns */
export async function main(ns) {
	let target = ns.args[0];
	if (target == null) {
		target = ns.getHostname();
	}
	let source = ns.read("packages.txt");
	let files = source.split(",");
	if (ns.fileExists("BruteSSH.exe", "home")) { ns.brutessh(target) };
	if (ns.fileExists("FTPcrack.exe", "home")) { ns.ftpcrack(target) };
	if (ns.fileExists("relaySMTP.exe", "home")) { ns.relaysmtp(target) };
	if (ns.fileExists("HTTPworm.exe", "home")) { ns.httpworm(target) };
	if (ns.fileExists("SQLInjeck.exe", "home")) { ns.sqlinject(target) };
	let server = ns.getServer(target);
	if (server.numOpenPortsRequired <= server.openPortCount) {
		if (ns.fileExists("NUKE.exe", "home")) { ns.nuke(target) };
		ns.tprint("PWNd ", target, ".");
	}
	else {
		ns.tprint(target + " needs " + (server.numOpenPortsRequired - server.openPortCount) + " more ports open.");
	}
	ns.scp(files, target, "home");
}
