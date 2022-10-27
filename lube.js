/** @param {NS} ns */
export async function main(ns) {
	const debug = false;
	//ns.disableLog("ALL");
	if (debug) { ns.tail(); }
	const target = ns.args[0];
	const saveRam = ns.args[1] ?? 0;
	const verbose = ns.args[2] ?? true;
	const forever = ns.args[3] ?? false;
	const cost = 1.75;
	const buffer = 100;
	let root = ns.hasRootAccess(target);
	const maxCash = ns.getServerMaxMoney(target);
	let curCash = ns.getServerMoneyAvailable(target);
	let needCash = maxCash - curCash;
	let needSec = getSecurityDamage(ns, target);
	if (root != true) {
		ns.run("pwn.js", 1, target);
		await ns.sleep(1000);
		root = ns.hasRootAccess(target);
		if (root != true) {
			ns.tprint("Lube was not applied. ", target, " is not rooted.");
			ns.exit();
		}
	}
	while (needCash > 0 || needSec > 0 || forever) {
		let growThreads = 0;
		let weakThreads = 0;
		curCash = ns.getServerMoneyAvailable(target);
		needCash = maxCash - curCash;
		needSec = getSecurityDamage(ns, target);
		let cores = ns.getServer(ns.getHostname()).cpuCores
		let weakHeal = ns.weakenAnalyze(1, cores);
		let needGrowThreads = Math.ceil(ns.growthAnalyze(target, (needCash / curCash) + 1, cores));
		ns.print((needCash / curCash) + 1, " = ", curCash, " / ", needCash, " + 1, ", cores);
		let needWeakThreads = Math.ceil(needSec / weakHeal);
		let maxThreads = Math.floor(getFreeRam(ns, saveRam) / cost);
		let maxGrowThreads = Math.floor((maxThreads - needWeakThreads) / 3);
		ns.print("maxGrThr: ", maxGrowThreads);
		ns.print("needSec: ", needSec, " weakHeal: ", weakHeal);
		ns.print("needweak: ", needWeakThreads, " maxThreads: ", maxThreads);
		if (needWeakThreads > maxThreads) {
			if (maxThreads > 0) {
				if (ns.run("weak.js", maxThreads, target) == 0) {
					await ns.sleep(buffer);
					continue;
				}
				await ns.sleep(ns.getWeakenTime(target) + buffer);
			}
		}
		else if (needSec == 0 && needCash == 0) {
			await ns.sleep(buffer * 10);
			continue;
		}
		else {
			if (maxGrowThreads > needGrowThreads) {
				growThreads = needGrowThreads;
			}
			else { growThreads = maxGrowThreads }
			weakThreads = growThreads * 2 + needWeakThreads;
			if (weakThreads > 0) { if (ns.run("weak.js", weakThreads, target) == 0) { await ns.sleep(buffer); continue }; }
			await ns.sleep(ns.getWeakenTime(target) - ns.getGrowTime(target) - buffer);
			if (growThreads > 0) {
				ns.run("grow.js", growThreads, target);
				await ns.sleep(ns.getGrowTime(target) + buffer * 2);
			}
		}
		await ns.sleep(buffer);
	}
	if (verbose) { ns.toast(target + " is lubed up.", "success", null); }
}

/** @param {NS} ns */
function getFreeRam(ns) {
	const self = ns.getHostname();
	return ns.getServerMaxRam(self) - ns.getServerUsedRam(self);
}

/** @param {NS} ns */
function getSecurityDamage(ns, target) {
	return ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
}
