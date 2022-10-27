/** @param {NS} ns */
export async function main(ns) {
    let divisions = ns.corporation.getCorporation().divisions;
    for (let i = 0; i < divisions.length; i++) {
        let cities = divisions[i].cities;
        for (let k = 0; k < cities.length; k++) {
            let officeSpace = ns.corporation.getOffice(divisions[i].name , cities[k]).size;
            let vacancies = officeSpace - ns.corporation.getOffice(divisions[i].name , cities[k]).employees;
            for (let h = 0;h < vacancies;h++) {
                ns.corporation.hireEmployee(divisions[i].name , cities[k]);
            }
        }
    }
}
