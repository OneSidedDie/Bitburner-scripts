/** @param {NS} ns */
export async function main(ns) {
    let debug = false;
    let faction = "Slum Snakes";
    ns.disableLog("sleep");
    ns.disableLog("gang.purchaseEquipment");
    let buffer = 2000;
    let gangTrainingRoster = ns.read("gangTrainingRoster.txt");
    gangTrainingRoster = gangTrainingRoster.split(",");
    let gangWarfareRoster = ns.read("gangWarfareRoster.txt");
    gangWarfareRoster = gangWarfareRoster.split(",");
    let armors = ns.read("gangArmors.txt");
    armors = armors.split(",");
    let namePool = ns.read("gangMemberNamePool.txt");
    namePool = namePool.split(",");
    while (!ns.gang.inGang()) {
        if (ns.gang.createGang(faction)) {
            gangTrainingRoster = [];
            gangWarfareRoster = [];
            ns.rm("TrainingRoster.txt", "home");
            ns.rm("gangWarfareRoster.txt", "home");
            let equipment = ns.gang.getEquipmentNames();
            for (let i = 0; i < equipment.length; i++) {
                if (ns.gang.getEquipmentType(equipment[i]).toLowerCase() == "armor") {
                    let cost = ns.gang.getEquipmentCost(equipment[i]);
                    let name = equipment[i];
                    if (armors.length == 0) {
                        armors[0] = { "name": name, "cost": cost };
                    }
                    else {
                        armors.push({ "name": name, "cost": cost });
                    }
                }
            }
            armors.sort((a, b) => a.cost - b.cost);
            let armorOutput = [];
            for (let i = 0; i < armors.length; i++) {
                armorOutput[i] = armors[i].name;
            }
            armorOutput = armorOutput.filter(n => n);
            armors = armorOutput;
            ns.write("gangArmors.txt", armors.join(","), "w");
        }
        await ns.sleep(buffer);
    }
    ns.tail();
    while (true) {
        if (debug) { ns.print("bonusTime: ", Math.floor(ns.gang.getBonusTime())); }
        if (Math.floor(ns.gang.getBonusTime()) > 5000) { buffer = 400 }
        else { buffer = 2000 }
        let rosters = pruneMissingMembers(ns, gangTrainingRoster, gangWarfareRoster);
        gangTrainingRoster = rosters[0];
        gangWarfareRoster = rosters[1];
        //ns.print(gangTrainingRoster , gangWarfareRoster );
        let gangRoster = ns.gang.getMemberNames();
        if (gangRoster.length < 12) {
            for (let i = 0; i < gangRoster.length; i++) {
                let gangRecruiter = ns.gang.getMemberInformation(gangRoster[i]);
                let ascRes = ns.gang.getAscensionResult(gangRecruiter.name);
                if (ascRes == undefined) { continue };
                if ((gangRecruiter.agi_mult + gangRecruiter.agi_asc_mult) >= gangRoster.length - 2 && ascRes.agi >= 1.15) {
                    if (gangRecruiter.agi >= 400) {
                        ns.gang.setMemberTask(gangRecruiter[i], "Terrorism");
                    }
                    else {
                        ns.gang.setMemberTask(gangRecruiter[i], "Mug People");
                    }
                }
            }
            if (ns.gang.canRecruitMember()) {
                let rndNum = getRndInteger(0, namePool.length - 1);
                while (!ns.gang.recruitMember(namePool[rndNum])) {
                    rndNum = getRndInteger(0, namePool.length - 1);
                }
                let newRecruit = namePool[rndNum];
                ns.gang.setMemberTask(newRecruit, "Train Combat");
                gangTrainingRoster.push(newRecruit);
                ns.write("gangTrainingRoster.txt", gangTrainingRoster.join(","), "w");
            }

        }
        gangRoster = ns.gang.getMemberNames();
        let gangInfo = ns.gang.getGangInformation();
        let repNeeded = [0, 0, 0, 5, 25, 125, 625, 3125, 15625, 78125, 390625, 1953125];
        let timeToRecruit = (repNeeded[gangRoster.length - 1] - gangInfo.respect) / gangInfo.respectGainRate;
        if (gangRoster.length < 12 && timeToRecruit > 600) {
            for (let i = 0; i < gangTrainingRoster.length; i++) {
                ns.gang.setMemberTask(gangTrainingRoster[i], "Train Combat")
                if (gangRoster.includes(gangTrainingRoster[i])) {
                    gangRoster.splice(gangRoster.indexOf(gangTrainingRoster[i], 1));
                }
            }
            for (let i = 0; i < gangWarfareRoster.length; i++) {
                ns.gang.setMemberTask(gangWarefareRoster[i], "Territory Warfare");
                if (gangRoster.includes(gangWarfareRoster[i])) {
                    gangRoster.splice(gangRoster.indexOf(gangWarfareRoster[i], 1));
                }
            }
            for (let i = 0; i < gangRoster.length; i++) {
                ns.gang.setMemberTask(gangRoster[i], "Human Trafficking");
            }
        }
        for (let i = 0; i < gangTrainingRoster.length; i++) {
            if (debug) { ns.print(gangTrainingRoster.length) }
            if (gangTrainingRoster[i] == '') { continue }
            let gangTrainee = ns.gang.getMemberInformation(gangTrainingRoster[i]);
            let ascRes = ns.gang.getAscensionResult(gangTrainee.name);
            if (ascRes == undefined) { continue };
            if (debug) { ns.print(ascRes.str, " ", ascRes.def, " ", ascRes.dex, " ", ascRes.agi) }
            if (ascRes.agi >= 1.2) {
                if (gangTrainee.agi_asc_mult >= 20) {
                    gangTrainingRoster.splice(i, 1);
                    gangWarfareRoster.push(gangTrainee.name);
                    if (ns.gang.getGangInformation().territory == 1) {
                        ns.gang.setMemberTask(gangTrainee.name, "Human Trafficking");
                    }
                    else {
                        ns.gang.setMemberTask(gangTrainee.name, "Territory Warfare");
                    }
                    ns.write("gangTrainingRoster.txt", gangTrainingRoster.join(","), "w");
                    ns.write("gangWarfareRoster.txt", gangWarfareRoster.join(","), "w");
                }
                else {
                    ns.gang.ascendMember(gangTrainee.name);
                }
            }
        }
        if (getWarfareWinChance(ns) >= 0.6 && gangInfo.territory < 1) {
            if (!gangInfo.territoryWarfareEngaged) {
                ns.gang.setTerritoryWarfare(true);
                gangInfo.territoryWarfareEngaged = true;
            }
            // ns.print(gangTrainingRoster, gangWarfareRoster);
            for (let i = 0; i < armors.length; i++) {
                for (let k = 0; k < gangWarfareRoster.length; k++) {
                    ns.gang.purchaseEquipment(gangWarfareRoster[k], armors[i]);
                }
            }
        }
        else if (gangInfo.territoryWarfareEngaged && getWarfareWinChance(ns) < 0.6) {
            ns.gang.setTerritoryWarfare(false);
            gangInfo.territoryWarfareEngaged = false;
        }
        else if (gangInfo.territory === 1 && gangInfo.territoryWarfareEngaged) {
            ns.gang.setTerritoryWarfare(false);
            for (let i = 0; i < gangWarfareRoster.length; i++) {
                ns.gang.setMemberTask(gangWarfareRoster[i], "Human Trafficking");
            }
        }
        await ns.sleep(buffer);
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** @param {NS} ns */
function getWarfareWinChance(ns) {
    let curFaction = ns.gang.getGangInformation().faction;
    let competition = ["Slum Snakes", "Tetrads", "The Syndicate", "The Dark Army", "Speakers for the Dead", "NiteSec", "The Black Hand"];
    competition.splice(competition.indexOf(curFaction), 1);
    let winChance = [];
    for (let i = 0; i < competition.length; i++) {
        winChance[i] = ns.gang.getChanceToWinClash(competition[i]);
    }
    winChance.sort();

    return winChance[winChance.length - 1];
}
/** @param {NS} ns */
function pruneMissingMembers(ns, gangTrainingRoster, gangWarfareRoster) {
    let gangRoster = ns.gang.getMemberNames();
    for (let i = 0; i < gangTrainingRoster.length; i++) {
        let exists = gangRoster.includes(gangTrainingRoster[i]);
        if (!exists) {
            gangTrainingRoster.splice(i, 1);
        }
    }
    gangTrainingRoster = gangTrainingRoster.filter(n => n);
    ns.write("gangTrainingRoster.txt", gangTrainingRoster.join(","), "w");
    for (let i = 0; i < gangWarfareRoster.length; i++) {
        let exists = gangRoster.includes(gangWarfareRoster[i]);
        if (!exists) {
            gangWarfareRoster.splice(i, 1);
        }
    }
    gangWarfareRoster = gangWarfareRoster.filter(n => n);
    ns.write("gangWarfareRoster.txt", gangWarfareRoster.join(","), "w");
    //ns.print(gangTrainingRoster, gangWarfareRoster );
    return [gangTrainingRoster, gangWarfareRoster];
}
