/** @param {NS} ns */
export async function main(ns) {
  ns.tail();
  const requestPort = Number.MAX_SAFE_INTEGER - 1;
  const hostsPort = Number.MAX_SAFE_INTEGER - 2;
  const ramPort = Number.MAX_SAFE_INTEGER - 3;
  const listenPort = ns.pid;
  const requests = [1.75, 1.75];
  for (const request of requests) {
    const command = { 'request': 'ram', 'sender': listenPort, 'needRam': request };
    //ns.print(`sending ${command} to ${requestPort}.`);
    ns.writePort(requestPort, command);
    await ns.nextPortWrite(listenPort);
    try { ns.exec('grow.js', ns.readPort(listenPort), 1, 'n00dles') } catch { };
    await ns.sleep(1000);
  }
}
