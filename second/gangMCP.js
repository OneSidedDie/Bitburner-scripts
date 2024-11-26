/** @param {NS} ns */
export async function main(ns) {
  //TODO: Don't ascend if penalty over 1%
  //TODO: Wait intil maybe 10x or higher (or calucate!) multiplier before recruit 
  //TODO: If can't human traffick, train combat
  //TODO: Make each member have their own stage of progress (train, rep, money, etc)
  ns.tail();
  ns.disableLog('disableLog');
  ns.disableLog('enableLog');
  const namePool = ns.read('/gang/gangNamePool.txt').split(',');
  let gangNames = JSON.parse(ns.read('/gang/gangNames.txt'));
  const equipmentList = JSON.parse(ns.read('/gang/equipmentList.txt'));
  const taskList = JSON.parse(ns.read('/gang/taskList.txt'));
  const terrorismTask = taskList.find((entry) => entry.name === 'Terrorism');
  const traffickTask = taskList.find((entry) => entry.name === 'Human Trafficking');
  equipmentList.sort((a, b) => a.cost - b.cost);


  while (true) {
    const gangInfo = ns.gang.getGangInformation();
    if (gangNames.length < 12 && gangInfo.respect >= gangInfo.respectForNextRecruit) {
      gangNames = recruit(ns, gangNames, namePool);
    } else if (gangInfo.respect < gangInfo.respectForNextRecruit && gangNames.length < 11) {
      buyGear(ns, equipmentList, gangNames);
      if (shouldWeRecruit(ns, gangInfo, gangNames, terrorismTask) || gangInfo.wantedPenalty >= 0.5) {
        canTerrorize(ns, gangInfo, gangNames, terrorismTask);
      }
    } else if (gangInfo.territory < 1 && !gangInfo.territoryWarfareEngaged) {
      buyGear(ns, equipmentList, gangNames, true);
      if (buildGangPower(ns, gangInfo, gangNames, traffickTask)) {
        ns.gang.setTerritoryWarfare(true);
        for (const member of gangNames) {
          ns.gang.setMemberTask(member, 'Train Combat');
        }
      }
      for (const member of gangNames) {
        if (gangNames.indexOf(member) > 2) {
          continue;
        }
        const memberInfo = ns.gang.getMemberInformation(member);
        bestMoneyTask(ns, gangInfo, memberInfo, traffickTask, true);
      }
    } else {
      buyGear(ns, equipmentList, gangNames, false);
      for (const member of gangNames) {
        const memberInfo = ns.gang.getMemberInformation(member);
        bestMoneyTask(ns, gangInfo, memberInfo, traffickTask);
      }
    }
    ascend(ns, gangNames);
    await ns.gang.nextUpdate();
  }
}

/**
 * @param {NS} ns
 */
function recruit(ns, gangNames, namePool) {
  let roll = die(namePool.length);
  let nameChoice = namePool[roll - 1];
  while (gangNames.includes(nameChoice)) {
    roll = die[namePool.length - 1];
    nameChoice = namePool[roll];
  }
  if (ns.gang.recruitMember(nameChoice)) {
    gangNames.push(nameChoice);
    ns.gang.setMemberTask(nameChoice, 'Train Combat');
    ns.write('/gang/gangNames.txt', JSON.stringify(gangNames), 'w');
  }
  return gangNames;
}

/**
 * @param {NS} ns
 */
function canTerrorize(ns, gangInfo, gangNames, terrorismTask) {
  for (const member of gangNames) {
    const memberInfo = ns.gang.getMemberInformation(member);
    if (memberInfo.task === 'Terrorism') {
      continue;
    }
    let result;
    try { result = ns.gang.getAscensionResult(memberInfo.name).str } catch { return false };
    if (result <= 1.63 - 0.62 / Math.exp((2 / memberInfo.str_asc_mult) ** 2.24)) {
      if (memberInfo.task !== 'Train Combat') {
        ns.gang.setMemberTask(memberInfo.name, 'Train Combat');
      }
      return false;
    }
    const gangInfoAfter = Object.assign({}, gangInfo);
    const respectAfter = ns.formulas.gang.respectGain(gangInfo, memberInfo, terrorismTask);
    gangInfoAfter.respect += respectAfter;
    const wantedLevelAfter = ns.formulas.gang.wantedLevelGain(gangInfo, memberInfo, terrorismTask);
    gangInfoAfter.wantedLevel += wantedLevelAfter;
    const wantedPenaltyAfter = ns.formulas.gang.wantedPenalty(gangInfoAfter);
    //ns.print(wantedPenaltyAfter, ' >= ', gangInfo.wantedPenalty);
    if (wantedPenaltyAfter > gangInfo.wantedPenalty || memberInfo.str >= 600) {
      //ns.print(wantedPenaltyAfter, ' - ', gangInfo.wantedPenalty);
      ns.gang.setMemberTask(memberInfo.name, 'Terrorism');
    } else {
      ns.gang.setMemberTask(memberInfo.name, 'Train Combat');
    }
  }
}

/**
 * Calculate how long it would take to recruit member at current reputation gain rate.
* @param {NS} ns
*/
function shouldWeRecruit(ns, gangInfo, gangNames, terrorismTask) {
  let respectPerTick = gangInfo.respectGainRate;
  for (const member of gangNames) {
    const memberInfo = ns.gang.getMemberInformation(member);
    if (memberInfo.task === 'Terrorism') {
      continue;
    }
    const gangInfoAfter = Object.assign({}, gangInfo);
    const respectAfter = ns.formulas.gang.respectGain(gangInfo, memberInfo, terrorismTask);
    gangInfoAfter.respect += respectAfter;
    const wantedLevelAfter = ns.formulas.gang.wantedLevelGain(gangInfo, memberInfo, terrorismTask);
    gangInfoAfter.wantedLevel += wantedLevelAfter;
    const wantedPenaltyAfter = ns.formulas.gang.wantedPenalty(gangInfoAfter);
    //ns.print(wantedPenaltyAfter, ' - ', gangInfo.wantedPenalty, ' - ', respectAfter, ' - ', gangInfo.respect)
    if (wantedPenaltyAfter > gangInfo.wantedPenalty && gangInfoAfter.respect > gangInfo.respect) {
      respectPerTick += respectAfter;
    }
  }
  //ns.print(gangInfo.respectForNextRecruit, ' <= ', gangInfo.respect + respectPerTick * 600);
  if (gangInfo.respectForNextRecruit <= gangInfo.respect + (respectPerTick * 1000)) {
    return true;
  } else {
    return false;
  }
}
/**
* @param {NS} ns
*/
function bestMoneyTask(ns, gangInfo, memberInfo, traffickTask, atWar = false) {
  const skipTasks = ['Territory Warfare', 'Vigilante Justice', 'Human Trafficking'];
  let result;

  if (skipTasks.includes(memberInfo.task)) {
    return false;
  }
  try { result = ns.gang.getAscensionResult(memberInfo.name).str } catch { return false };
  //ns.print(result, ' <= ', 1.63 - 0.62 / Math.exp((2 / memberInfo.str_asc_mult) ** 2.24), ' && ', memberInfo.task, ' !== ', 'Train Combat');
  //ns.print(result, ' <= ', 1.66 - 0.62 / Math.exp((2 / memberInfo.str_asc_mult) ** 2.24), ' && ', memberInfo.task, ' !== ', 'Train Combat');
  if (result <= 1.63 - 0.62 / Math.exp((2 / memberInfo.str_asc_mult) ** 2.24)) {
    if (memberInfo.task !== 'Train Combat') {
      ns.gang.setMemberTask(memberInfo.name, 'Train Combat');
    }
    return false;
  }
  const gangInfoAfter = Object.assign({}, gangInfo);
  const moneyGainAfter = ns.formulas.gang.moneyGain(gangInfo, memberInfo, traffickTask);
  gangInfoAfter.moneyGainRate += moneyGainAfter;
  const respectAfter = ns.formulas.gang.respectGain(gangInfo, memberInfo, traffickTask);
  gangInfoAfter.respect += respectAfter;
  const wantedLevelAfter = ns.formulas.gang.wantedLevelGain(gangInfo, memberInfo, traffickTask);
  gangInfoAfter.wantedLevel += wantedLevelAfter;
  const wantedPenaltyAfter = ns.formulas.gang.wantedPenalty(gangInfoAfter);
  if (wantedPenaltyAfter >= gangInfo.wantedPenalty && moneyGainAfter > gangInfo.moneyGainRate) {
    ns.gang.setMemberTask(memberInfo.name, traffickTask.name);
    return true;
  }
  return false;
}

/** 1.66 - 0.62 / Math.exp((2 / ns.gang.getMemberInformation(memberInfo).str_asc_mult) ** 2.24)
 * @param {NS} ns
 */
function ascend(ns, gangNames) {
  //const forbidTasks = ['Terrorism', 'Human Trafficking', 'Territory Warfare'];
  for (const member of gangNames) {
    const memberInfo = ns.gang.getMemberInformation(member);
    /*    if (forbidTasks.includes(stats.task)) {
          continue;
        } */
    let result;
    try { result = ns.gang.getAscensionResult(memberInfo.name).str } catch { continue };
    //ns.print(result, ' 1.65: ', 1.65 - 0.62 / Math.exp((2 / memberInfo.str_asc_mult) ** 2.24), " 1.66: ", 1.66 - 0.62 / Math.exp((2 / memberInfo.str_asc_mult) ** 2.24));
    if (result > 1.66 - 0.62 / Math.exp((2 / memberInfo.str_asc_mult) ** 2.24)) {
      ns.gang.ascendMember(memberInfo.name);
      if (memberInfo.task !== 'Train Combat') {
        ns.gang.setMemberTask(memberInfo.name, 'Train Combat');
      }
    }
  }
}

/**
* @param {NS} ns
*/
function buildGangPower(ns, gangInfo, gangNames, traffickTask, atWar = false) {
  let startWar = false;
  const rivalGangs = ns.gang.getOtherGangInformation();
  let maxGangPower = 0;
  let strongestGang;
  for (const member in gangNames) {
    const memberInfo = ns.gang.getMemberInformation(gangNames[member]);
    let result;
    if (memberInfo.task === 'Territory Warfare' || memberInfo.moneyGain > 0) {
      continue;
    }
    //ns.print('buildgangpower');
    try { result = ns.gang.getAscensionResult(memberInfo.name).str } catch { continue };
    //ns.print(result, ' ', 1.60 - 0.62 / Math.exp((2 / memberInfo.str_asc_mult) ** 2.24));
    if (result > 1.63 - 0.62 / Math.exp((2 / memberInfo.str_asc_mult) ** 2.24) && memberInfo.str_asc_mult >= 25) {
      ns.gang.setMemberTask(memberInfo.name, 'Territory Warfare');
    } else if (result > 1.63 - 0.62 / Math.exp((2 / memberInfo.str_asc_mult) ** 2.24)) {
      bestMoneyTask(ns, gangInfo, memberInfo, traffickTask);
    } else if (memberInfo.task !== 'Train Combat') {
      ns.gang.setMemberTask(memberInfo.name, 'Train Combat');
    }
  }
  for (const rival in rivalGangs) {
    if (gangInfo.faction === rival) {
      continue;
    }
    if (maxGangPower < rivalGangs[rival].power && rivalGangs[rival].territory > 0) {
      maxGangPower = rivalGangs[rival].power;
      strongestGang = rival;
    }
  }
  const winChance = gangInfo.power / (rivalGangs[strongestGang].power + gangInfo.power); //ns.gang.getChanceToWinClash(strongestGang);// Decimil (i.e. 0.2 instead of 20%)
  //ns.print(winChance, " ", rivalGangs[strongestGang], " ", strongestGang);
  if (winChance > 0.85) {
    startWar = true;
  }
  return startWar;
}

/**
 * Purchase equipment in price order, skipping hacking gear.
* @param {NS} ns
*/
function buyGear(ns, equipmentList, gangNames, atWar = false) {
  //make equipment list not a class

  for (const gear of equipmentList) {
    for (const member in gangNames) {
      const memberInfo = ns.gang.getMemberInformation(gangNames[member]);
      const gearOwned = [...memberInfo.augmentations, ...memberInfo.upgrades]
      if (atWar && member > 2) {
        continue;
      } else

        if (gearOwned.includes(gear.name)) {
          continue;
        }
      const cost = ns.gang.getEquipmentCost(gear.name);
      const cash = ns.getPlayer().money;
      let purchased = false;
      if (cost <= cash * 0.1) {
        ns.disableLog('gang.purchaseEquipment');
        purchased = ns.gang.purchaseEquipment(gangNames[member], gear.name);
        ns.enableLog('gang.purchaseEquipment');
      }
      if (!purchased) {
        return false;
      }
    }
  }
}


/** Random number between and including min through max.
 * @param {number} max - Maximum number to roll.
 * @param {number} min - Minimum number to roll.
 * @returns {number} result - Number chosen from min (inclusive) to max (inclusive). */
function die(max, min = 1) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
