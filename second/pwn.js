import { pwn } from 'lib.js';

/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0];
  if (pwn(ns, target)) {
    ns.tprint(`${target} has been pwn'd.`);
  } else {
    ns.tprint(`${target} unable to be pwn'd.`);
  }
}
