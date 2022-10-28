/** @param {NS} ns */
export async function main(ns) {
	//ns.run("dontkillMCP.js");
	let target = ns.args[0] ?? "n00dles";
	let refresh = ns.args[1] ?? false;
	let hosts = ["home"];
	for (let i = 0; i < hosts.length; i++) {
		let thisScan = ns.scan(hosts[i]);
		for (let p = 0; p < thisScan.length; p++) {
			if (hosts.indexOf(thisScan[p]) == -1) {
				hosts.push(thisScan[p]);
			}
			await ns.sleep(10);
		}
		await ns.sleep(10);
	}
	ns.write("hosts.txt", hosts.join(), "w");
	if (refresh) {
		ns.tprint("Refresh completed. ", hosts.length, " hosts found.");
		while (!ns.run("map.js") === 0) {
			await ns.sleep(1000);
		}
		ns.exit();
	}
	while (!ns.run("map.js") === 0) {
		await ns.sleep(1000);
	}
	while (ns.run("htp.js", 1, target) === 0) {
		await ns.sleep(1000);
	}
	ns.tprint("Startup script completed. ", hosts.length, " hosts found.");
}
