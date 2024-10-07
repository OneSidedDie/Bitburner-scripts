/** @param {NS} ns */
export async function main(ns) {
  const [target, debug] = ns.args[0];
  If(!debug){
    ns.disableLog('ALL');
  }
  await ns.weaken(target);
}
