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
export function findAvailRam(ns, neededRam, reserved = 0, debug = false) {
  const hosts = JSON.parse(ns.read('hostsRam.txt').split(','));
  let result = 'none';
  //ns.print(hosts);
  //ns.print(hosts[hosts.length - 1]);
  for (const host of hosts) {
    const availRam = getServerAvailRam(ns, host.name, reserved, debug);
    if (neededRam <= availRam && !host.name.includes('hacknet')) {
      result = host.name;
      break;
    }
  }

  if (result === 'none') {
    throw new Error(`findAvailRam(ns,${neededRam},${reserved},${debug}): Found no servers with ${ns.formatRam(neededRam)} available RAM.`);
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
    ramList.push(availRam = getServerAvailRam(ns, hosts[i], reserved, debug));
  }
  return ramList;
}

/** 
 * Return the amount of available RAM (GB) on the specified server.
 * @param {NS} ns 
 * @param {string} server - Name of server.
 * @param {number} reserved - Amount of RAM (GB) to reserve.
 * @returns {number} - The amount of available RAM (GB) on the specified server.
 */
export function getServerAvailRam(ns, server, reserved = 0, debug = false) {
  if (!debug) { ns.disableLog('ALL'); }
  let maxRam = ns.getServerMaxRam(server);
  const usedRam = ns.getServerUsedRam(server);
  if (server === 'home') {
    maxRam -= homeReservedRam(ns, debug);
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
export function getRootedServersWithRam(ns, debug = false) {
  if (!debug) { ns.disableLog('ALL'); }
  const hosts = ns.read('hostNames.txt').split(',');
  const homeServer = { 'name': 'home', 'maxRam': ns.getServerMaxRam('home') - homeReservedRam(ns) };
  const withRam = [];
  for (const host of hosts) {
    if (!ns.hasRootAccess(host) || host === 'home') {
      continue;
    }
    const serverMaxRam = ns.getServerMaxRam(host);
    if (serverMaxRam > 0) {
      withRam.push({ "name": host, "maxRam": serverMaxRam });
    }
  }
  //const sortByMaxRam2 = withRam.sort((a, b) => a.maxRam - b.maxRam);
  const sortByMaxRam = withRam.sort((a, b) => a.maxRam - b.maxRam);
  sortByMaxRam.push(homeServer);
  ns.write('hostsRam.txt', JSON.stringify(sortByMaxRam), 'w');
  return sortByMaxRam;
}

/** 
 * Attempts to open ports on specified server. Returns true if server now has root
 * access and false if not.  Copies all scripts from home to server.
 * @param {NS} ns
 * @param {string} server - Server being pwn'd.
 * @returns {boolean} - True or false if server has root access.
 */
export function pwn(ns, server, files = []) {
  let openPorts = 5;
  try { ns.brutessh(server) } catch { openPorts -= 1 }
  try { ns.httpworm(server) } catch { openPorts -= 1 }
  try { ns.ftpcrack(server) } catch { openPorts -= 1 }
  try { ns.sqlinject(server) } catch { openPorts -= 1 }
  try { ns.relaysmtp(server) } catch { openPorts -= 1 }
  try { ns.nuke(server) } catch { return false }
  if (files.length > 0) {
    ns.scp(files, server, 'home');
  }
  //ns.exec('lube.js', server, 1, server);
  return true;
}

/** 
 * Returns number of RAM (GB) with floor of 4 and ceiling of 32 or 0.1 of home RAM.
 * @param {NS} ns
 * @returns {number} - True or false if server has root access.
 */
export function homeReservedRam(ns, debug = false) {
  ns.disableLog('ALL');
  const homeMaxRAM = ns.getServerMaxRam('home');
  let reserved = Math.floor(homeMaxRAM * 0.1);
  if (reserved < 32) {
    reserved = 32;
  } else if (reserved > 64) {
    reserved = 64;
  }
  if (debug) {
    ns.print(`Reserved ${ns.formatRam(reserved)} of RAM on home.`);
  }
  return reserved;
}

/**
 * Copies specified file across the network from 'home' to all servers that are rooted with
 * max RAM greater than 0.
 * @param {NS} ns
 * @param {string | string[]} files - file name or array of file names to distribute from 'home'.
 */
export function distributeFiles(ns, files) {
  const hosts = ns.read('hostNames.txt').split(','); //Array of objects with {'name':,'maxRam':}
  for (const host of hosts) {
    ns.scp(files, host, 'home');
  }
}

/**
 * 
 */
export function extraTimeNeeded(ns, server, buffer) {
  const startTime = Date.now();
  const endTime = Date.now() + ns.getWeakenTime() + (buffer * 2);
}

export function goto(ns, destination) {

  const endpoints = JSON.parse(ns.read("pathHome.txt"));

  try {
    ns.singularity.connect("home");
  } catch {
    ns.tprint('You do not have access to singularity functions.');
    ns.exit();
  }

  if (endpoints.length === 0) {
    ns.tprint("No host data. Please run map.js");
  }

  const mapIndex = endpoints.findIndex(item => { return item.includes(destination) });
  const map = endpoints[mapIndex];
  if (map === -1 || mapIndex === -1) {
    ns.tprint("Host not found.");
    ns.exit();
  }
  else {
    for (let i = map.length - 1; i < map.length; i--) {
      ns.singularity.connect(map[i]);
      if (map[i] == destination) {
        return true;
      }
    }
  }
}

/** @param {NS} ns */
export function calcRatios(ns, hThreads, player, server) {

  const bnMults = ns.getBitNodeMultipliers();// JSON.parse(ns.read('bitNodeMultipliers.txt'));
  const wHeal = 0.5 * bnMults.ServerWeakenRate;
  let gThreads = 0;
  let wThreadsH = 0;
  let wThreadsG = 0;
  const hDamage = hThreads * ns.formulas.hacking.hackPercent(server, player);

  server.moneyAvailable = (1 - hDamage) * server.moneyMax;
  gThreads = Math.ceil(ns.formulas.hacking.growThreads(server, player, server.moneyMax));
  wThreadsH = Math.ceil((0.2 * hThreads) / wHeal);
  wThreadsG = Math.ceil((0.4 * gThreads) / wHeal);


  return { 'gThreads': gThreads, 'wThreadsH': wThreadsH, 'wThreadsG': wThreadsG };
}
