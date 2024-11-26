/** @param {NS} ns */
export async function main(ns) {
  const genNames = ["Training", "Field Analysis", "Recruitment", "Diplomacy", "Hyperbolic Regeneration Chamber", "Incite Violence"];
  const blOpNames = ["Operation Typhoon", "Operation Zero", "Operation X", "Operation Titan", "Operation Ares", "Operation Archangel", "Operation Juggernaut", "Operation Red Dragon", "Operation K", "Operation Deckard", "Operation Tyrell", "Operation Wallace", "Operation Shoulder of Orion", "Operation Hyron", "Operation Morpheus", "Operation Ion Storm", "Operation Annihilus", "Operation Ultron", "Operation Centurion", "Operation Vindictus", "Operation Daedalus"];
  const conNames = ["Tracking", "Bounty Hunter", "Retirement"];
  const opNames = ["Investigation", "Undercover Operation", "Sting Operation", "Raid", "Stealth Retirement Operation", "Assassination"];
  const skNames = ["Blade's Intuition", "Cloak", "Short-Circuit", "Digital Observer", "Tracer", "Overclock", "Reaper", "Evasive System", "Datamancer", "Cyber's Edge", "Hands of Midas", "Hyperdrive"];
  const easyJobs = [{ "type": "Operation", "name": "Sting Operation" }, { "type": "Operation", "name": "Undercover Operation" }, { "type": "Operation", "name": "Investigation" }, { "type": "Contract", "name": "Tracking" }]
  const actTypes = ["General", "Contracts", "Operations", "BlackOps"];
  let recovery = false;
  while (true) {
    await ns.bladeburner.nextUpdate();
    let found = false;
    const curAct = ns.bladeburner.getCurrentAction() ?? { "name": "nothing" };
    const nextBlOp = ns.bladeburner.getNextBlackOp();
    const [blOp1, blOp2] = ns.bladeburner.getActionEstimatedSuccessChance("BlackOp", nextBlOp.name);
    if (!recovery) {
      if (blOp2 === 1) {
        if (blOp1 !== 1 && curAct.name !== "Field Analysis") {
          ns.bladeburner.startAction("General", "Field Analysis");
          found = true;
          continue;
        } else if (curAct.name !== nextBlOp.name && curAct.name !== "Field Analysis") {
          ns.bladeburner.startAction("BlackOp", nextBlOp.name);
        }
        found = true;
        continue;
      }
      for (const action of easyJobs) {
        const [suc1, suc2] = ns.bladeburner.getActionEstimatedSuccessChance(action.type, action.name);

        if (suc1 !== suc2) {
          if (curAct.name !== "Field Analysis") {
            ns.bladeburner.startAction("General", "Field Analysis");
          }
          found = true;
          break;
        } else if (curAct.name !== action.name) {
          ns.bladeburner.startAction(action.type, action.name);
        }
        found = true;
        break;
      }
    }

    const [sta, staMax] = ns.bladeburner.getStamina();

    if (sta <= staMax / 2 && !recovery) {
      recovery = true;
      ns.bladeburner.startAction("General", "Field Analysis");
    } else if (recovery && sta === staMax) {
      recovery = false;
    } else if (!found && curAct.name !== "Training" && curAct.name !== "Field Analysis") {
      ns.bladeburner.startAction("General", "Training");
    }

  }
}
