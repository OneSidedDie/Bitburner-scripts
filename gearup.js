/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    let equipment = ns.gang.getEquipmentNames();
    let gangRoster = ns.gang.getMemberNames();
    let equipList = [];
    for (let i = 0; i < equipment.length; i++) {

        let cost = ns.gang.getEquipmentCost(equipment[i])
        let name = equipment[i];

        if (equipList.length == 0) {

            equipList[0] = { "name": name, "cost": cost };

        }
        else {

            equipList.push({ "name": name, "cost": cost });

        }
    }
    equipList.sort((a, b) => a.cost - b.cost);
    equipList.filter(n => n);
    while (true) {
        gangRoster = ns.gang.getMemberNames();
        for (let i = 0; i < equipList.length; i++) {
            for (let m = 0; m < gangRoster.length; m++) {
                ns.gang.purchaseEquipment(gangRoster[m], equipList[i].name);
            }
        }
        await ns.sleep(2000);
    }
}
