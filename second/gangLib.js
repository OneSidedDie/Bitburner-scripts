/**
 * @params {NS} ns
 */
class GangMember {
  state = "train";
  static taskNames = new Set(["Unassigned", "Mug People", "Deal Drugs", "Strongarm Civilians", "Run a Con", "Armed Robbery", "Traffick Illegal Arms", "Threaten & Blackmail", "Human Trafficking", "Terrorism", "Vigilante Justice", "Train Combat", "Train Hacking", "Train Charisma", "Territory Warfare"]);
  constructor(ns, name, taskStats) {
    this.ns = ns;
    this.name = name;
    this.taskStats = taskStats;
    this.state = state;
  }

  getGangMemberTaskInfo(task) {
    if (!taskNames.has(task)) {
      throw new RangeError(`getGangMemberTaskInfo(task): task ${task} not a valid task name.`);
    }
    const gangInfo = this.ns.getGangInformation();
    const memberInfo = this.ns.getMemberInformation(this.name);
    const taskInfo = this.taskStats.find(x => x.name === task);
    return [gangInfo, memberInfo, taskInfo];
  }

  getRespectGain(task, info) {
    if (!taskNames.has(task)) {
      this.ns.print(`${this.name}: ${task} not a valid task name.`);
      return 0;
    }
    return this.ns.formulas.gang.respectGain(...info);
  }

  getMoneyGain(task, info) {
    if (!taskNames.has(task)) {
      this.ns.print(`${this.name}: ${task} not a valid task name.`);
      return 0;
    }
    return this.ns.formulas.gang.moneyGain(...info);
  }

  getWantedLevelGain(task, info) {
    if (!taskNames.has(task)) {
      this.ns.print(`${this.name}: ${task} not a valid task name.`);
      return 0;
    }
    return this.ns.formulas.gang.wantedLevelGain(...info)
  }

  isTaskNetPositive(task) {
    if (!taskNames.has(task)) {
      this.ns.print(`${this.name}: ${task} not a valid task name.`);
      return 0;
    }
    const info = getGangMemberTaskInfo(task);
    const infoAfter = this.getInfoAfterTask(task, info);
    const wantedBefore = this.ns.formulas.gang.wantedPenalty(info[0]);
    const wantedAfter = this.formulas.gang.wantedPenalty(infoAfter[0])
  }

  getInfoAfterTask(task, info) {
    const [gangInfo, memberInfo, taskInfo] = [...info];
    const infoAfter = info;
    const taskMoney = this.getMoneyGain(task, info);
    const taskReputation = this.getRespectGain(task, info);
    const taskWanted = this.getWantedLevelGain(task, info);

    infoAfter[0].
    infoAfter[1].
    infoAfter[1].
  }
}
