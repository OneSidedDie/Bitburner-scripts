/** @param {NS} ns */
export async function main(ns) {
    let hostname = ns.args[0];
    let ram = ns.args[1];
    let denom = ["", "k", "m", "b", "t", "q"];
    let i = 0;
    let cash = ns.getPurchasedServerCost(ram);
    while (cash > 1000) {
        cash = (cash / 1000);
        i = i + 1;
    }
    cash = Math.trunc(cash * 1000) / 1000;
    if (hostname == undefined || ram == undefined || typeof (ram) != "number") {
        ns.tprint("Usage: buyserver hostname RAM(divisible by 2) ");
        ns.exit();
    }
    else if (ns.args[0] == "?") {
        ns.tprint("Purchased server with ", ram, " would cost ", cash, denom[i]);
        ns.exit()
    }
    if (ns.getPurchasedServers().length == ns.getPurchasedServerLimit()) {
        ns.tprint("Unable to purchase new server. Already at maximum.");
        ns.exit();
    }
    ns.purchaseServer(hostname, ram);
    ns.tprint("Purchased server ", hostname, " for ", cash);
    ns.run("arm.js", hostname);
}
