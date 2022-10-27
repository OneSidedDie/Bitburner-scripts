/** @param {NS} ns */
export async function main(ns) {
	let destination = ns.args[0];
	let file = ns.read("pathHome.txt");
	if (file.length == 0) {
		ns.tprint("No host data. Please run map.js");
	}
	let endpoints = JSON.parse(file);
	let mapIndex = endpoints.findIndex(item => { return item.includes(destination) });
	let map = endpoints[mapIndex];
	if (map === -1) {
		ns.tprint("Host not found.");
		ns.exit();
	}
	else {
		if (ns.singularity.connect("home")) {
			for (let i = map.length - 1; i < map.length; i--) {
				ns.singularity.connect(map[i]);
				if (map[i] == destination) {
					ns.exit();
				}
			}
		}
	}
}
