import { pwn, getRootedServersWithRam, goto } from 'lib.js';

/* TODO:
--If done run separate script to backdoor available servers.
--
*/

/** @param {NS} ns */
export async function main(ns) {
  const debug = ns.args[0] ?? false;
  ns.tail();
  const disabledLogs = ['disableLog', 'brutessh', 'httpworm', 'ftpcrack', 'sqlinject', 'relaysmtp', 'nuke', 'scp', 'scan', 'sleep'];
  const pwndList = ['home']
  for (const log of disabledLogs) {
    ns.disableLog(log);
  }
  const hosts = ['home'];
  const serverObjs = [];
  const fullMap = [{ 'name': 'home', 'depth': 0 }];
  const files = ['hack.js', 'grow.js', 'weaken.js', 'xp.js', 'share.js', 'goto.js', 'shareAll.js', 'lib.js'];
  const backdoorable = ['CSEC', 'avmnite-02h', 'I.I.I.I', 'run4theh111z'];
  let runOnce = true;

  for (const host of hosts) {
    const thisScan = ns.scan(host);
    //ns.print(host);
    //ns.print(fullMap.find((entry) => entry.name === host));
    const thisDepth = fullMap.find((entry) => entry.name === host).depth;
    fullMap.find((entry) => entry.name === host).nextTo = thisScan;
    //ns.print(fullMap.find((entry) => entry.name === host), ' - 2 ');
    for (const server of thisScan) {
      if (hosts.indexOf(server) === -1) {
        fullMap.push({ 'name': server, 'depth': thisDepth + 1 });
        const curServer = ns.getServer(server);
        hosts.push(server);
        pwn(ns, server, files);
        curServer.moneyAvailable = curServer.moneyMax;
        curServer.hackDifficulty = curServer.minDifficulty;
        serverObjs.push(curServer);
      }
    }
  }

  await drawMap(ns, fullMap);

  ns.write('hostNames.txt', hosts.join(), "w");
  ns.write('serverObs.txt', JSON.stringify(serverObjs), 'w');
  const sortedServerObjs = serverObjs.sort((a, b) => a.numOpenPortsRequired - b.numOpenPortsRequired);

  for (const server of sortedServerObjs) {
    while (!pwn(ns, server.hostname, files)) {
      if (runOnce) {
        runOnce = false;
        getRootedServersWithRam(ns, debug);
      }
      await ns.sleep(10000);
    }
    if (backdoorable.includes(server.hostname)) {
      ns.print(server.hostname);
      try {
        goto(ns, server.hostname);
        try {
          await ns.singularity.installBackdoor();
        } catch { }
        goto(ns, 'home');
      } catch { }
    }
    pwndList.push(server.hostname);
    runOnce = true;
  }

  getRootedServersWithRam(ns, debug)
  ns.tail();
  ns.print("All servers have been pwn'd.");
}

/** @param {NS} ns */
async function drawMap(ns, fullMap) {
  const endpoints = [];
  for (const host of fullMap) {
    if (host.nextTo.length === 1) {
      endpoints.push(host);
    }
  }

  let pathHome = [];

  for (let point of endpoints) {
    let thisPath = [point.name];
    while (point.name !== 'home') {
      const neighbors = point.nextTo;
      for (const host of neighbors) {
        const result = fullMap.find((entry) => entry.name === host);
        if (result.depth < point.depth) {
          thisPath.push(host);
          point = result;
        }
      }
    }
    //ns.print(thisPath);
    pathHome.push(thisPath);
  }
  //ns.print(pathHome);
  ns.write("pathHome.txt", JSON.stringify(pathHome), "w");
  return true;
}
