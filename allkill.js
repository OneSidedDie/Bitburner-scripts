/** @param {NS} ns */
export async function main(ns) {
    let opt = ns.args[0];
    let file = ns.read("hosts.txt");
    let hosts = file.split(",");
    //ns.tail();
    //ns.print(hosts, " ?")
    for (let i = opt ?? 1; i < hosts.length; i++) {
        ns.killall(hosts[i], true);
        //ns.print("killing scripts on ", hosts[i]);
    }
}
