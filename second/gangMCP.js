/** @param {NS} ns */
export async function main(ns) {
  let gangCreated = false;
  try {
    ns.rm('/gang/gangList.txt', 'home');
    ns.rm('/gang/equipmentInfo.txt', 'home');
    gangCreated = ns.gang.inGang();
  }
  catch {
    ns.tprint('You do not have access to gangs in this bitnode.');
    ns.exit();
  }
  while (!gangCreated) {
    gangCreated = ns.gang.createGang('Slum Snakes');
    await ns.sleep(10000);
  }

  const gangList = ns.gang.getMemberNames();
  const equipmentList = getGangEquipment(ns);
  const taskList = getGangTasks(ns);

  ns.write('/gang/gangList.txt', JSON.stringify(gangList), 'w');
  ns.write('/gang/equipmentList.txt', JSON.stringify(equipmentList), 'w');
  ns.write('/gang/taskList.txt', JSON.stringify(taskList), 'w');
  ns.spawn('/gang/gangMCU.js', { 'spawnDelay': 1 });
}

class GangEquipment {
  constructor(name, cost, stats, type) {
    this.name = name;
    this.cost = cost;
    this.stats = stats;
    this.type = type;
  }
}

class GangTask {
  constructor(name, stats) {
    this.name = name;
    this.stats = stats;
  }
}

/**
 * @param {NS} ns
 */
export function getGangEquipment(ns) {
  const equipmentList = [];
  const equipmentNames = ns.gang.getEquipmentNames();
  for (const equipment of equipmentNames) {
    const equipmentCost = ns.gang.getEquipmentCost(equipment);
    const equipmentStats = ns.gang.getEquipmentStats(equipment);
    const equipmentType = ns.gang.getEquipmentType(equipment);
    const equipmentEntry = new GangEquipment(equipment, equipmentCost, equipmentStats, equipmentType);
    equipmentList.push(equipmentEntry);
  }
  return equipmentList;
}

/**
 * @param {NS} ns
 */
export function getGangTasks(ns) {
  const gangTasks = [];
  const taskNames = ns.gang.getTaskNames();
  for (const task of taskNames) {
    const taskStats = ns.gang.getTaskStats(task);
    const taskEntry = new GangTask(task, taskStats);
    gangTasks.push(taskEntry);
  }
  return gangTasks;
}
