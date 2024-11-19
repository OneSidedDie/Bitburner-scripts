import { getServerAvailRam } from 'lib.js';
/** @param {NS} ns */
export async function main(ns) {
  const host = ns.getHostname();
  const availRam = getServerAvailRam(ns, host);
  const threads = Math.floor(availRam / 4);
  ns.run('share.js', threads);
}
