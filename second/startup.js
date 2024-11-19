/** @param {NS} ns */
export async function main(ns) {
  const programs = ['bn.js', '/gang/gangStart.js', 'htp.js', 'cc.js'];
  ns.singularity.universityCourse('rothman university', 'Study Computer Science', false);
  for (const program of programs) {
    ns.run(program);
    if (program === 'htp.js') {
      await ns.sleep(1000);
    }
  }
}
