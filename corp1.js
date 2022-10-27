/** @param {NS} ns */
export async function main(ns) {
    ns.tail();
    ns.disableLog("sleep");
    let parentCorp = ns.corporation.getCorporation() ?? false;
    if (parentCorp == false) {
        ns.corporation.createCorporation("Shiawase", false);
        ns.corporation.unlockUpgrade("Smart Supply");
        ns.corporation.expandIndustry("Agriculture", "Aggro Culture");
        let cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];
        for (let i = 0; i < cities.length; i++) {
            ns.corporation.expandCity("Aggro Culture", cities[i]);

            if (!ns.corporation.hasWarehouse()) { ns.corporation.purchaseWarehouse("Aggro Culture", cities[i]); }

            ns.corporation.upgradeWarehouse("Aggro Culture", cities[i]);
            ns.corporation.upgradeWarehouse("Aggro Culture", cities[i]);

            let offices = ns.corporation.getOffice("Aggro Culture", cities[i]);
            let jobs = ["Operations", "Engineer", "Business"];
            for (let i = offices.employees.length; i < offices.size; i++) {
                let newEmployee = ns.corporation.hireEmployee("Aggro Culture", cities[i]);
                ns.corporation.assignJob("Aggro Culture", cities[i], newEmployee.name, jobs[i]);
            }

            ns.corporation.setSmartSupply("Aggro Culture", cities[i], true);
            ns.corporation.sellMaterial("Aggro Culture", cities[i], "Plants", "MAX", "MP");
            ns.corporation.sellMaterial("Aggro Culture", cities[i], "Food", "MAX", "MP");

            ns.corporation.buyMaterial("Aggro Culture", cities[i], "Hardware", 12.5);
            ns.corporation.buyMaterial("Aggro Culture", cities[i], "AI Cores", 7.5);
            ns.corporation.buyMaterial("Aggro Culture", cities[i], "Real Estate", 2700);

        }

        await ns.sleep(10000);

        for (let i = 0; i < cities.length; i++) {
            ns.corporation.buyMaterial("Aggro Culture", cities[i], "Hardware", 0);
            ns.corporation.buyMaterial("Aggro Culture", cities[i], "AI Cores", 0);
            ns.corporation.buyMaterial("Aggro Culture", cities[i], "Real Estate", 0);
        }

        ns.corporation.hireAdVert("Aggro Culture");
        let initialUpgrades = ["FocusWires", "Neural Accelerators", "Speech Processor Implants", "Nuoptimal Nootropic Injector Implants", "Smart Factories", "FocusWires", "Neural Accelerators", "Speech Processor Implants", "Nuoptimal Nootropic Injector Implants", "Smart Factories"];

        for (let i = 0; i < initialUpgrades.length; i++) {
            ns.corporation.unlockUpgrade(initialUpgrades[i]);
        }

        let invOffer = ns.corporation.getInvestmentOffer();

        while (invOffer < 21e10) {
            invOffer = ns.corporation.getInvestmentOffer();
            await ns.sleep(1000);
        }

        ns.corporation.acceptInvestmentOffer();

        let initialUpgrades2 = ["Smart Factories", "Smart Factories", "Smart Factories", "Smart Factories", "Smart Factories", "Smart Factories", "Smart Factories", "Smart Factories", "Smart Factories", "Smart Factories", " Smart Storage", " Smart Storage", " Smart Storage", " Smart Storage", " Smart Storage", " Smart Storage", " Smart Storage", " Smart Storage", " Smart Storage", " Smart Storage"];

        for (let i = 0; i < initialUpgrades2.length; i++) {
            ns.corporation.unlockUpgrade(initialUpgrades2[i]);
        }


        for (let i = 0; i < cities.length; i++) {

            ns.corporation.upgradeWarehouse("Aggro Culture", cities[i]);
            ns.corporation.upgradeWarehouse("Aggro Culture", cities[i]);
            ns.corporation.upgradeWarehouse("Aggro Culture", cities[i]);
            ns.corporation.upgradeWarehouse("Aggro Culture", cities[i]);
            ns.corporation.upgradeWarehouse("Aggro Culture", cities[i]);
            ns.corporation.upgradeWarehouse("Aggro Culture", cities[i]);
            ns.corporation.upgradeWarehouse("Aggro Culture", cities[i]);

            ns.corporation.upgradeOfficeSize("Aggro Culture", cities[i], 6);

            let offices = ns.corporation.getOffice("Aggro Culture", cities[i]);
            let jobs = ["Operations", "Engineer", "Management", "Management", "Research & Development", "Research & Development"];
            for (let i = offices.employees.length; i < offices.size; i++) {
                let newEmployee = ns.corporation.hireEmployee("Aggro Culture", cities[i]);
                ns.corporation.assignJob("Aggro Culture", cities[i], newEmployee.name, jobs[i]);
            }

            ns.corporation.buyMaterial("Aggro Culture", cities[i], "Hardware", 267.5);
            ns.corporation.buyMaterial("Aggro Culture", cities[i], "Robots", 9.6);
            ns.corporation.buyMaterial("Aggro Culture", cities[i], "AI Cores", 244.5);
            ns.corporation.buyMaterial("Aggro Culture", cities[i], "Real Estate", 11940);

        }

        await ns.sleep(10000);

        for (let i = 0; i < cities.length; i++) {

            ns.corporation.buyMaterial("Aggro Culture", cities[i], "Hardware", 0);
            ns.corporation.buyMaterial("Aggro Culture", cities[i], "Robots", 0);
            ns.corporation.buyMaterial("Aggro Culture", cities[i], "AI Cores", 0);
            ns.corporation.buyMaterial("Aggro Culture", cities[i], "Real Estate", 0);

        }

        while (invOffer < 5e12) {
            invOffer = ns.corporation.getInvestmentOffer();
            await ns.sleep(1000);
        }

        ns.corporation.acceptInvestmentOffer();

        for (let i = 0; i < cities.length; i++) {

            ns.corporation.upgradeWarehouse("Aggro Culture", cities[i]);
            ns.corporation.upgradeWarehouse("Aggro Culture", cities[i]);
            ns.corporation.upgradeWarehouse("Aggro Culture", cities[i]);
            ns.corporation.upgradeWarehouse("Aggro Culture", cities[i]);
            ns.corporation.upgradeWarehouse("Aggro Culture", cities[i]);
            ns.corporation.upgradeWarehouse("Aggro Culture", cities[i]);
            ns.corporation.upgradeWarehouse("Aggro Culture", cities[i]);
            ns.corporation.upgradeWarehouse("Aggro Culture", cities[i]);
            ns.corporation.upgradeWarehouse("Aggro Culture", cities[i]);



            let offices = ns.corporation.getOffice("Aggro Culture", cities[i]);
            let jobs = ["Operations", "Engineer", "Business"];
            for (let i = offices.employees.length; i < offices.size; i++) {
                let newEmployee = ns.corporation.hireEmployee("Aggro Culture", cities[i]);
                ns.corporation.assignJob("Aggro Culture", cities[i], newEmployee.name, jobs[i]);
            }

            ns.corporation.buyMaterial("Aggro Culture", cities[i], "Hardware", 650);
            ns.corporation.buyMaterial("Aggro Culture", cities[i], "Robots", 63);
            ns.corporation.buyMaterial("Aggro Culture", cities[i], "AI Cores", 375);
            ns.corporation.buyMaterial("Aggro Culture", cities[i], "Real Estate", 8400);

        }

        await ns.sleep(10000);

        for (let i = 0; i < cities.length; i++) {

            ns.corporation.buyMaterial("Aggro Culture", cities[i], "Hardware", 0);
            ns.corporation.buyMaterial("Aggro Culture", cities[i], "Robots", 0);
            ns.corporation.buyMaterial("Aggro Culture", cities[i], "AI Cores", 0);
            ns.corporation.buyMaterial("Aggro Culture", cities[i], "Real Estate", 0);

        }
        ns.alert("First stage corporation complete.");
    }
}
