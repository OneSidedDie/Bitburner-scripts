/** @param {NS} ns */
export async function main(ns) {
  const hostsPort = Number.MAX_SAFE_INTEGER - 1;
  const availableRamPort = hostsPort - 1;
  const listenPort = availableRamPort - 1;
  ns.disableLog('scan');
  ns.tail();
  const HOST_NAMES = new Set(['home']);
  let hosts = ['home'];
  for (let i = 0; i < hosts.length; i++) {
    const thisScan = ns.scan(hosts[i])
    thisScan.forEach((value) => {
      if (!HOST_NAMES.has(value)) {
        hosts.push(value);
        HOST_NAMES.add(value);
      }
    });
  }
  ns.print(HOST_NAMES);
  ns.print(hosts);
  const hostsPackage = JSON.stringify(HOST_NAMES);
  ns.writePort(hostsPort, hostsPackage);
  while (true) {
    await ns.nextPortWrite(listenPort);
    const request = ns.readPort(listenPort);
    switch (request) {
      case 'hug':
        ns.print("Hugs!");
        break;
      case 'kiss':
        ns.print("Kisses!");
        break;
      default:
        ns.print(`I dont do ${result}`);
    }
  }
}
