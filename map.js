/** @param {NS} ns */
export async function main(ns) {
	let hosts = ["home"];
	let fullmap = [];
	for (let i = 0; i < hosts.length; i++) {
		let thisScan = ns.scan(hosts[i]);
		fullmap[i] = { "name": hosts[i], "nextTo": thisScan }
		for (let p = 0; p < thisScan.length; p++) {
			if (hosts.indexOf(thisScan[p]) == -1) {
				hosts.push(thisScan[p]);
			}
			await ns.sleep(10);
		}
		await ns.sleep(10);
	}
	fullmap[0].depth = 0;
	for (let h = 0; h < fullmap.length; h++) {
		for (let i = 0; i < fullmap[h].nextTo.length; i++) {
			const index = fullmap.findIndex(item => item.name === fullmap[h].nextTo[i]);
			if (fullmap[index].depth === undefined) {
				fullmap[index].depth = fullmap[h].depth + 1;
			}
		}
	}
	//ns.tprint(fullmap);

	let endpoints = [];
	for (let i = 0; i < fullmap.length; i++) {
		if (fullmap[i].nextTo.length === 1) {
			endpoints.push(fullmap[i]);
		}
	}
	//ns.tprint(fullmap);
	let pathHome = [];
	for (let e = 0; e < endpoints.length; e++) {
		let curHost = endpoints[e];
		let thisPath = [endpoints[e].name];
		while (curHost.name !== "home") {
			let thisScan = curHost.nextTo;
			for (let i = 0; i < thisScan.length; i++) {
				const index = fullmap.findIndex(item => item.name === thisScan[i]);
				if (fullmap[index].depth < curHost.depth) {
					thisPath.push(fullmap[index].name);
					curHost = fullmap[index];
				}
				await ns.sleep(10);
			}
			await ns.sleep(10);
		}
		pathHome[e] = thisPath;
		await ns.sleep(10);
	}
	ns.write("pathHome.txt", JSON.stringify(pathHome), "w");
}
