import { CORPORATIONS } from "/CONFIG";
const jobNames = ["Operations", "Engineer", "Business", "Management", "Research & Development"];

/**
 * Expands office to the target size, distributing employees equally.
 * 
 * @param {ns} ns Netscript object
 */
export async function main(ns) {
    if (!CORPORATIONS) {
        ns.tprint("Must have unlocked corporations to use this script.");
        return;
    }

    if (ns.args.length != 3) {
        ns.tprint("Usage: expand-office.js [division] [city] [size]");
        return;
    }

    const divisionName = ns.args[0];
    const cityName = ns.args[1];
    const targetSize = parseInt(ns.args[2]);
    const office = ns.corporation.getOffice(divisionName, cityName);

    if (office == null) {
        ns.tprint("Division " + divisionName + " has no office in " + cityName);
        return;
    }

    if (office.size >= targetSize) {
        return;
    }

    const upgradeCost = ns.corporation.getOfficeSizeUpgradeCost(divisionName, cityName, targetSize - office.size);

    if (upgradeCost > ns.corporation.getCorporation().funds) {
        ns.tprint("Not enough funds to perform upgrade.");
        return;
    }
    else {
        ns.corporation.upgradeOfficeSize(divisionName, cityName, targetSize - office.size);
        for (let i = 0; i < targetSize - office.size; i++) {
            ns.corporation.hireEmployee(divisionName, cityName);
        }
        for (let i = 0; i < jobNames.length; i++) {
            await ns.corporation.setAutoJobAssignment(divisionName, cityName, jobNames[i], targetSize / 5);
        }
    }
}