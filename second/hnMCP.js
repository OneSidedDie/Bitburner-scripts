/** @param {NS} ns */
export async function main(ns) {
  const hnConstants = { "HashesPerLevel": 0.001, "BaseCost": 50000, "RamBaseCost": 200000, "CoreBaseCost": 1000000, "CacheBaseCost": 10000000, "PurchaseMult": 3.2, "UpgradeLevelMult": 1.1, "UpgradeRamMult": 1.4, "UpgradeCoreMult": 1.55, "UpgradeCacheMult": 1.85, "MaxServers": 20, "MaxLevel": 300, "MaxRam": 8192, "MaxCores": 128, "MaxCache": 15 };
  const upgrades = ["Sell for Money", "Sell for Corporation Funds", "Reduce Minimum Security", "Increase Maximum Money", "Improve Studying", "Improve Gym Training", "Exchange for Corporation Research", "Exchange for Bladeburner Rank", "Exchange for Bladeburner SP", "Generate Coding Contract", "Company Favor"];
  while (true) {
    while (ns.hacknet.spendHashes(upgrades[0])) {

    }
    await ns.sleep(1000);
    ns.print(ns.formulas.hacknetServers.levelUpgradeCost(0, 5, 1.1));
  }
}
