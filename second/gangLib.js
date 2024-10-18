class GangMember {
  #ns;
  name;
  taskStats;
constructor(ns, name, taskStats){
  this#ns = ns;
  this.name = name;
  this.taskStats = taskStats;
}
  getGangMemberTaskInfo(task){
    const taskIndex = this.task
    const gangInfo = this.#ns.getGangInformation();
    const memberInfo = this.#ns.getMemberInformation(this.name);
    const taskInfo = this.taskStats[]
    return [gangInfo, memberInfo, this.taskStats(task);
  }
  
  respectGain(task){
    const info = this.getGangMemberTaskInfo();
    return this.#ns.respectGain(...info);
  }
}
