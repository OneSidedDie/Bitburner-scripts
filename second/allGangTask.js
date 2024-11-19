/** @param {NS} ns */
export async function main(ns) {
  if (!ns.gang.inGang()) {
    ns.tprint('You are not in a gang.');
    ns.exit();
  }
  const task = ns.args.join(' ');
  const taskNames = ["Unassigned", "Mug People", "Deal Drugs", "Strongarm Civilians", "Run a Con", "Armed Robbery", "Traffick Illegal Arms", "Threaten & Blackmail", "Human Trafficking", "Terrorism", "Vigilante Justice", "Train Combat", "Train Hacking", "Train Charisma", "Territory Warfare"];

  if (!taskNames.includes(task)) {
    ns.tprint(`Task ${task} does not exist.  Check spelling, dingus.`);
    ns.exit();
  }
  const gangNames = JSON.parse(ns.read('/gang/gangNames.txt'));
  let tasksCompleted = 0;
  for (const member of gangNames) {
    if (ns.gang.setMemberTask(member, task)) {
      tasksCompleted++;
    }
  }
  if (tasksCompleted === gangNames.length) {
    ns.tprint(`Task:  All gang members have been assigned to ${task}.`);
  } else if (tasksCompleted > 0) {
    ns.tprint(`Task: ${tasksCompleted} out of ${gangNames.length} members have been assigned to ${task}.`);
  } else {
    ns.tprint(`Task: No members were assigned to ${task}.`);
  }
}

export function autocomplete(data, args) {
  return ["Unassigned", "Mug People", "Deal Drugs", "Strongarm Civilians", "Run a Con", "Armed Robbery", "Traffick Illegal Arms", "Threaten & Blackmail", "Human Trafficking", "Terrorism", "Vigilante Justice", "Train Combat", "Train Hacking", "Train Charisma", "Territory Warfare"];
}
