/** @param {NS} ns */
export async function main(ns) {
  ns.tail();
  const listenPort = Number.MAX_SAFE_INTEGER - 1;
  const hostsPort = listenPort - 1;
  const ramPort = listenPort - 2;
  ns.clearPort(hostsPort);
  ns.clearPort(ramPort);

  ns.disableLog('scan');
  ns.tail();
  saveHostsLists(ns);
  let HOST_NAMES = ns.peek(hostsPort);
  let hostsRam = ns.peek(ramPort);
  ns.print(`Listening on port ${listenPort}`);
  while (true) {
    let message = {};
    await ns.nextPortWrite(listenPort);
    [HOST_NAMES, hostsRam] = saveHostsLists(ns);
    try {
      message = ns.readPort(listenPort);
      ns.print(JSON.stringify(message));
    } catch ({ name, message }) {
      ns.print(`${name}: ${message}`);
    }
    const request = message.request;
    const sender = message.sender;
    switch (request) {
      case 'hosts':
        ns.writePort(sender, HOST_NAMES);
        break;
      case 'ram':
        let reply = 'none';
        const needRam = message.needRam;
        try {
          reply = findAvailRam(ns, needRam);
        } catch ({ name, message }) {
          ns.print(`${name}: ${message}`);
        } finally {
          ns.writePort(sender, reply);
        }
        break;
      case 'hostsRam':
        ns.writePort(sender, hostsRam);
        break;
    }
  }
}


/**
 * Return array of objects with the names of all servers and their maximum amount of RAM that you have admin access
 * to with a maximum RAM (GB) greater than 0.
 * @param {NS} ns
 * @returns {object[]} withRam - Returns an array of strings with the names of
 * all servers with admin access that have max RAM (GB) greater than 0.
 */
function saveHostsLists(ns) {
  ns.print('saveHostsList');
  const hostsPort = Number.MAX_SAFE_INTEGER - 2;
  const ramPort = Number.MAX_SAFE_INTEGER - 3;
  const HOST_NAMES = new Set(['home']);
  const hostNames = ['home'];
  const hostsRam = [];
  for (let i = 0; i < hostNames.length; i++) {
    const thisScan = ns.scan(hostNames[i])
    thisScan.forEach((value) => {
      if (!HOST_NAMES.has(value)) {
        hostNames.push(value);
        HOST_NAMES.add(value);
        const serverMaxRam = ns.getServerMaxRam(value);
        const rooted = ns.hasRootAccess(value);
        if (serverMaxRam > 0 && rooted) {
          hostsRam.push({ 'hostName': value, 'maxRam': serverMaxRam });
        }
      }
    });
  }
  const homeServer = { 'name': 'home', 'maxRam': ns.getServerMaxRam('home') - homeReservedRam(ns) };
  const sortByMaxRam = hostsRam.sort((a, b) => b.maxRam - a.maxRam);
  sortByMaxRam.unshift(homeServer);
  ns.writePort(hostsPort, HOST_NAMES);
  ns.writePort(ramPort, sortByMaxRam);
  return HOST_NAMES, hostsRam;
}

/** 
 * Search all servers with admin access with available RAM (GB) of a certain
 * size and returns a string with the name of the server. Returns 'none' if not available.
 * @param {NS} ns
 * @param {string[]} hosts - Array of strings with a list of server names that have admin
 * access with a maximum RAM (GB) greater than 0.
 * @param {number} neededRam - Amount of free RAM to find on any server that is available.
 * @param {number} reserved - Amount of ram to leave free on 'home' if 'home' is chosen.
 * @returns {string} - Name of host with required free RAM or 'none' if none available.
 * @description 
 */
function findAvailRam(ns, neededRam, reserved = 0, debug = false) {
  ns.print('findAvailRam');
  const ramPort = Number.MAX_SAFE_INTEGER - 3;
  const hosts = ns.peek(ramPort);
  let result = 'none';
  //ns.print(hosts);
  //ns.print(hosts[hosts.length - 1]);
  for (let i = hosts.length - 1, j = 0; i >= j; i--) {
    const availRam = getServerAvailRam(ns, hosts[i].hostName, reserved, debug);
    if (neededRam <= availRam) {
      result = hosts[i].hostName;
      break;
    }
  }

  if (result === 'none') {
    throw new Error(`findAvailRam(ns,${neededRam},${reserved},${debug}): Found no servers with ${neededRam} (GB)available RAM.`);
  }
  return result;
}

/** 
 * Return the amount of available RAM (GB) on the specified server.
 * @param {NS} ns 
 * @param {string} server - Name of server.
 * @param {number} reserved - Amount of RAM (GB) to reserve.
 * @returns {number} - The amount of available RAM (GB) on the specified server.
 */
function getServerAvailRam(ns, server, reserved = 0, debug = false) {
  ns.print('getServerAvailRam');
  if (!debug) { ns.disableLog('ALL'); }
  ns.print('getServerAvailRam1', " ", server);
  let maxRam = ns.getServerMaxRam(server);
  ns.print('getServerAvailRam2', " ", maxRam);
  const usedRam = ns.getServerUsedRam(server);
  ns.print('getServerAvailRam3');
  if (server === 'home') {
    ns.print('getServerAvailRam4');
    maxRam -= homeReservedRam(ns, debug);
    ns.print('getServerAvailRam5');
  } else {
    ns.print('getServerAvailRam6');
    maxRam -= reserved;
    ns.print('getServerAvailRam7');
  }
  ns.print('getServerAvailRam8');
  const availRam = Math.max(maxRam - usedRam, 0);
  ns.print('getServerAvailRam9');
  return availRam;
}

/** 
 * Returns number of RAM (GB) with floor of 4 and ceiling of 32 or 0.1 of home RAM.
 * @param {NS} ns
 * @returns {number} - True or false if server has root access.
 */
function homeReservedRam(ns, debug = false) {
  ns.print('homeReservedRam');
  ns.disableLog('ALL');
  const homeMaxRAM = ns.getServerMaxRam('home');
  let reserved = Math.floor(homeMaxRAM * 0.05);
  if (reserved < 4) {
    reserved = 4;
  } else if (reserved > 32) {
    reserved = 32;
  }
  return reserved;
}
