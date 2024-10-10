/** @param {NS} ns */
export async function main(ns) {
  //target, opTime, endTime, debug
  const target = ns.args[0];
  const opTime = ns.args[1];
  const endTime = ns.args[2];
  const debug = ns.args[3];
  let addTime = 0;
  if (!debug) {
    ns.disableLog('ALL');
  } else {
    //ns.tail();
    ns.print(`weaken.js target: ${target}`);
  }
  const startTime = Date.now();
  if (startTime + opTime < endTime && endTime != 0) {
    addTime = endTime - startTime - opTime;
    if (debug) {
      ns.print('Weaken: ${endTime} - ${startTime} + ${opTime}')
      ns.print(`Weaken: ${endTime} - ${startTime} + ${opTime}`);
      ns.print(`Weaken: ${addTime}`)
    }
  }
  await ns.weaken(target, { additionalMsec: Math.round(addTime) });
  if (debug) {
    const nowTime = Date.now();
    ns.print(`Weaken: died ${nowTime}`);
    ns.print(`Expected time: ${endTime}`);
    ns.print('Difference: ', endTime - nowTime);
  }
}
