/** @param {NS} ns */
export async function main(ns) {
	let servers = ns.read("hosts.txt");
	let host = servers.split(",");
	let maxCash = [{ "name": "home", "value": 0 }];
	for (let i = 1; i < host.length; i++) {
		maxCash[i] = { "name": host[i], "value": ns.getServerMaxMoney(host[i]), "diff": ns.getServerRequiredHackingLevel(host[i]), "secu": ns.getServerMinSecurityLevel(host[i]), "root": ns.hasRootAccess(host[i]) }
	}
	if (ns.args[0] == "all") {
		maxCash.sort((a, b) => (a.value < b.value) ? 1 : -1)
		for (let i = 1; i < maxCash.length; i++) {
			if (maxCash[i].value == 0) { continue; }
			let cash = maxCash[i].value;
			ns.tprint(maxCash[i].name, " = ", denom(cash), " Hlvl: ", maxCash[i].diff, " Msec: ", maxCash[i].secu, " Root: ", maxCash[i].root);
		}
		ns.exit();
	}
	else if (ns.args[0] == null) {
		maxCash.sort((a, b) => (a.value < b.value) ? 1 : -1)
		let cash = maxCash[0].value;
		ns.tprint(maxCash[0].name, ", Max: ", denom(cash), " Hlvl: ", maxCash[0].diff, " Msec: ", maxCash[0].secu), " Root: ", maxCash[0].root;
		ns.exit();
	}
	else if (ns.args[0] == "hackable" || ns.args[0] == "h") {
		maxCash.sort((a, b) => (a.value < b.value) ? 1 : -1)
		let k = 0;
		for (let i = 1; i < maxCash.length; i++) {
			if (maxCash[i].value == 0) { continue; }
			if (maxCash[i].root == false) { continue; }
			let cash = maxCash[i].value;
			ns.tprint(maxCash[i].name, " = ", denom(cash), " Hlvl: ", maxCash[i].diff, " Msec: ", maxCash[i].secu, " Root: ", maxCash[i].root);
		}
		ns.exit();
	}
	let cash = ns.getServerMaxMoney(ns.args[0]);
	ns.tprint(ns.args[0], ", Max: ", denom(cash));
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
