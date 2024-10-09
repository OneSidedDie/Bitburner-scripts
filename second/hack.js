/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0];
  const debug = ns.args[1];
  if (!debug) {
    ns.disableLog('ALL');
  } else {
    //ns.tail();
    ns.print(`hack.js target: ${target}`);
  }
  await ns.hack(target);
}
