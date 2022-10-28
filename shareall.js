/** @param {NS} ns */
export async function main(ns) {
    let file = ns.read("hosts.txt");
    let hosts = file.split(",");
    for (let i = 0; i < hosts.length; i++) {
        let maxRam = ns.getServerMaxRam(hosts[i]);
        let usedRam = ns.getServerUsedRam(hosts[i]);
        let ram = maxRam - usedRam;
        let threads = Math.floor(ram / ns.getScriptRam("share.js", hosts[i]));
        if (threads == 0) {
            continue ;
        }
        ns.exec("share.js", hosts[i], threads);
    }
    ns.tprint("Sharing is careing.");
}
