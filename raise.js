/** @param {NS} ns */
export async function main(ns) {
	let debug = true;
	let maxServ = ns.getPurchasedServerLimit();
	let hostname = "server";
	let newServNum = ns.args[0];
	let ram = Math.pow(2, newServNum);
	if (typeof ram != typeof 0) {
		ns.tprint("Raise usage: raise ram [?/killyeskill]");
		ns.tprint("ram will be the power of 2. ? option to list price. killyeskill will kill current servers and buy new ones.")
	}
	let tag = ns.args[1];
	let ownedServers = ns.getPurchasedServers();
	let toHas = ownedServers.length;
	let toBuy = maxServ - toHas;
	if (tag == "?" && toBuy == 0) {
		let cash = ns.getPurchasedServerCost(ram);
		ns.tprint(toBuy, " servers with ", ram, "Gb RAM would cost ", denom(cash), "(25: ", denom(cash * 25), ")");
		if (ns.getPurchasedServers().length == ns.getPurchasedServerLimit()) {
			ns.tprint("Unable to purchase new server. Already at maximum.");
			ns.exit();
		}
	}
	else if (tag == "?") {
		let cash = ns.getPurchasedServerCost(ram) * toBuy;
		ns.tprint(toBuy, " servers with ", ram, "Gb RAM would cost ", denom(cash)), ")";
		ns.exit();
	}
	else if (tag == "killyeskill") {
		let curServRam = ns.getServerMaxRam("server");
		let curServNum = Math.log2(curServRam);
		if (curServRam <= newServNum) {
			ns.tprint("Raise ", newServNum, ": This is a bad idea. Your servers are already a ", curServNum);
		}
		else {
			let p = 0;
			let deleted = 0;
			for (p = 0; p < ownedServers.length; p++) {
				if (ns.killall(ownedServers[p])) {
				}
				ns.deleteServer(ownedServers[p]);
				deleted = deleted + 1;
			}
			ns.tprint("Deleted ", p, " servers valued at ", denom(ns.getPurchasedServerCost(curServRam) * p));
		}
	}
	else if (tag != undefined) {
		ns.tprint("Raise: unknown option ", tag);
		ns.exit();
	}
	if (ns.getPurchasedServers().length == ns.getPurchasedServerLimit()) {
		ns.tprint("Unable to purchase new server. Already at maximum.");
		ns.exit();
	}
	let bought = 0;
	for (let i = 0; i < toBuy; i++) {
		let newServer = ns.purchaseServer(hostname, ram);
		if (newServer === "") {
			continue;
		}
		else {
			bought = bought + 1;
			let source = ns.read("packages.txt");
			let files = source.split(",");
			let max = toBuy.length;
			for (let runs = 1; max > runs; runs++) {
				ns.scp("hosts.txt", newServer, "home");
				ns.scp(files, newServer, "home");
			}
		}
	}
	let cash = ns.getPurchasedServerCost(ram) * bought;
	ns.tprint("Purchased ", bought, " servers for ", denom(cash));
}
function denom(num) {
	const suffixes = ["k", "m", "b", "t", "q", "Q", "s", "S", "o", "O", "n", "N"];

	let sign = num < 0 ? "-" : "";
	let value = Math.abs(num);
	if (value <= 1000) return Math.floor(value + "");
	if (Math.log10(value) >= (suffixes.length + 1) * 3) return value.toExponential(3) + "";


	let exp = Math.floor(Math.log10(value));
	let s = Math.floor(exp / 3);
	return sign + Math.floor(value / (10 ** (3 * (s - 1)))) / 1000 + suffixes[s - 1];
}
