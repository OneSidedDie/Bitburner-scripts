/** @param {NS} ns */
export async function main(ns) {
  ns.tail();
  const namePool = ns.read('/gang/gangNamePool.txt').split(',');
  let gangList = JSON.parse(ns.read('/gang/gangList.txt'));
  const equipmentList = ns.read('/gang/gangEquipmentList.txt').split(',');
  const taskList = ns.read('/gang/tastList.txt').split(',');
  while (true) {
    if (ns.gang.canRecruitMember()) {
      gangList = recruit(ns, gangList, namePool);
    }
    ascend(ns, gangList);
    await ns.gang.nextUpdate();
  }
}
/**
 * @param {NS} ns
 */
function recruit(ns, gangList, namePool) {
  let roll = die(namePool.length);
  let nameChoice = namePool[roll];
  while (gangList.includes(nameChoice)) {
    roll = die[namePool.length];
    nameChoice = namePool[roll];
  }
  if (ns.gang.recruitMember(nameChoice)) {
    gangList.push(nameChoice);
    ns.gang.setMemberTask(nameChoice, 'Train Combat');
    ns.write('/gang/gangList.txt', JSON.stringify(gangList), 'w');
  }
  return gangList;
}

/**
 * @param {NS} ns
 */
function buyEquipment(ns) {

}

/** 1.66 - 0.62 / Math.exp((2 / ns.gang.getMemberInformation(member).str_asc_mult) ** 2.24)
 * @param {NS} ns
 */
function ascend(ns, gangList) {
  for (const member of gangList) {
    const stats = ns.gang.getMemberInformation(member);
    if (stats.task === 'Terrorism') {
      continue;
    }
    let result;
    try { result = ns.gang.getAscensionResult(member).str } catch { continue };
    if (result > 1.66 - 0.62 / Math.exp((2 / stats.str_asc_mult) ** 2.24)) {
      ns.gang.ascendMember(member);
      ns.gang.setMemberTask(member, 'Train Combat');
    }
  }
}

/** Random number between and including 0 through max.
 * @param {number} max - Maximum number to roll.
 * @returns {number} result - Number chosen from 0 to max.
 */
function die(max) {
  const result = Math.floor(Math.random() * max);
  return result;
}
