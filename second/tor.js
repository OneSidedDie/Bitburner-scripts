/** @param {NS} ns */
export async function main(ns) {
  const col = {
    "r": "\x1b[31m",
    "g": "\x1b[32m",
    "b": "\x1b[34m",
    "c": "\x1b[36m",
    "m": "\x1b[35m",
    "y": "\x1b[33m",
    "bk": "\x1b[30m",
    "w": "\x1b[37m",
    "d": "\x1b[0m" //default color
  }
  const purchaseOrder = [{ 'name': 'BruteSSH.exe', 'cost': 5e+5 },
  { 'name': 'FTPCrack.exe', 'cost': 1.5e+5 },
  { 'name': 'relaySMTP.exe', 'cost': 5e+6 },
  { 'name': 'HTTPWorm.exe', 'cost': 3e+7 },
  { 'name': 'SQLInject.exe', 'cost': 25e+7 }];
  let has = 0;
  let purchased = 0;
  if (!ns.singularity.purchaseTor()) {
    ns.tprint(`You need to have $${ns.formatNumber(2e+5, 0)} to purchase a TOR router.`);
    ns.exit();
  }
  for (const program of purchaseOrder) {
    if (ns.fileExists(program.name, 'home')) { has++; continue; }
    const bought = ns.singularity.purchaseProgram(program.name);
    if (!bought) {
      const cash = ns.getPlayer().money;
      ns.tprint(col.r + `Need $${ns.formatNumber((program.cost - cash), 3)} more to purchase ${program.name}`);
      ns.exit();
    }
    purchased++;
    has++;
    ns.tprint(`You have purchased the ${program.name} program.The new program can be found on your home computer.`);
  }
  if (has >= purchaseOrder.length && purchased > 0) {
    ns.tprint(`All programs have been purchased.`);
    ns.exit();
  } else if (has >= purchaseOrder.length && purchased === 0) {
    ns.tprint(`All available programs have been purchased already.`);
  } else {
    ns.tprint(`probably an error somewhere.`);
    ns.tprint(has, ' ', purchased);
  }
}
