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
export function findAvailRam(ns, neededRam, reserved = 0) {
  const hosts = JSON.parse(ns.read('hostsRam.txt').split(','));
  let result = 'none';
  //ns.print(hosts);
  //ns.print(hosts[hosts.length - 1]);
  for (let i = hosts.length - 1, j = 0; i >= j; i--) {
    const availRam = getServerAvailRam(ns, hosts[i].name, reserved);
    if (neededRam < availRam) {
      result = hosts[i].name;
      break;
    }
  }
  return result;
}

/** 
 * Search all servers with admin access and return an array of numbers with the amount of RAM (GB)
 * available across all servers.
 * @param {NS} ns
 * @param {string[]} hosts - Array of strings with a list of server names that have admin
 * access with a maximum RAM (GB) greater than 0.
 * @param {number} reserved - Amount of RAM to reserve on home.
 * @returns {number[]} 
 */
export function getAllAvailableRam(ns, hosts, reserved = 0) {
  const ramList = [];
  for (let i = 0, j = hosts.length; i < j; i++) {
    ramList.push(availRam = getServerAvailRam(ns, hosts[i], reserved));
  }
  return ramList;
}

/** 
 * Return the amount of available RAM (GB) on the specified server.
 * @param {NS} ns 
 * @param {string} server - Name of server.
 * @param {number} reserved - Amount of RAM (GB) to reserve on home.
 * @returns {number} - The amount of available RAM (GB) on the specified server.
 */
export function getServerAvailRam(ns, server, reserved = 0) {
  let maxRam = ns.getServerMaxRam(server);
  const usedRam = ns.getServerUsedRam(server);
  if (server === 'home') {
    maxRam -= homeReservedRam(ns);
  } else {
    maxRam -= reserved;
  }
  const availRam = Math.max(maxRam - usedRam, 0);
  return availRam;
}

/**
 * Return array of objects with the names of all servers and their maximum amount of RAM that you have admin access
 * to with a maximum RAM (GB) greater than 0.
 * @param {NS} ns
 * @returns {object[]} withRam - Returns an array of strings with the names of
 * all servers with admin access that have max RAM (GB) greater than 0.
 */
export function getRootedServersWithRam(ns) {
  ns.disableLog('getServerMaxRam');
  const hosts = ns.read('hostNames.txt').split(',');
  const homeServer = { 'name': 'home', 'maxRam': ns.getServerMaxRam('home') - homeReservedRam(ns) };
  const withRam = [];
  for (let i = 1, j = hosts.length; i < j; i++) {
    if (!ns.hasRootAccess(hosts[i])) {
      continue;
    }
    const serverMaxRam = ns.getServerMaxRam(hosts[i]);
    if (serverMaxRam > 0) {
      withRam.push({ "name": hosts[i], "maxRam": serverMaxRam });
    }
  }
  //const sortByMaxRam2 = withRam.sort((a, b) => a.maxRam - b.maxRam);
  const sortByMaxRam = withRam.sort((a, b) => b.maxRam - a.maxRam);
  sortByMaxRam.unshift(homeServer);
  ns.write('hostsRam.txt', JSON.stringify(sortByMaxRam), 'w');
  //ns.write('hostsRam2.txt', JSON.stringify(sortByMaxRam2), 'w');
  return sortByMaxRam;
}

/** 
 * Attempts to open ports on specified server. Returns true if server now has root
 * access and false if not.  Copies all scripts from home to server.
 * @param {NS} ns
 * @param {string} server - Server being pwn'd.
 * @returns {boolean} - True or false if server has root access.
 */
export function pwn(ns, server) {
  let openPorts = 5;
  try { ns.brutessh(server) } catch (error) { openPorts -= 1 }
  try { ns.httpworm(server) } catch (error) { openPorts -= 1 }
  try { ns.ftpcrack(server) } catch (error) { openPorts -= 1 }
  try { ns.sqlinject(server) } catch (error) { openPorts -= 1 }
  try { ns.relaysmtp(server) } catch (error) { openPorts -= 1 }
  try { ns.nuke(server) } catch (error) { return false }
  ns.scp(ns.ls('home', '.js'), server, 'home');
  ns.scp(ns.ls('home', '.txt'), server, 'home');
  //ns.exec('lube.js', server, 1, server);
  return true;
}

/** 
 * Returns number of RAM (GB) with floor of 4 and ceiling of 32 or 0.1 of home RAM.
 * @param {NS} ns
 * @returns {number} - True or false if server has root access.
 */
export function homeReservedRam(ns) {
  const homeMaxRAM = ns.getServerMaxRam('home');
  const reservedPercent = Math.ceil(homeMaxRAM * 0.05);
  let reserved = 0;
  if (homeMaxRAM * reservedPercent < 4) {
    reserved = 4;
  } else if (homeMaxRAM * reservedPercent > 32) {
    reserved = 32;
  }
  /*ns.print("homeMaxRam: " + homeMaxRAM);
  ns.print("reserved: " + reserved); */
  return reserved;
}

/**
 * Copies specified file across the network from 'home' to all servers that are rooted with
 * max RAM greater than 0.
 * @param {NS} ns
 * @param {string | string[]} files - file name or array of file names to distribute from 'home'.
 */
export function distributeFiles(ns, files) {
  const hosts = JSON.parse(ns.read('hostsRam.txt')); //Array of objects with {'name':,'maxRam':}
  for (let i = 1, j = hosts.length; i < j; i++) {
    ns.scp(files, hosts[i].name, 'home');
  }
}
