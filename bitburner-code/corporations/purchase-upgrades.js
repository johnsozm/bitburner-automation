import { CORPORATIONS } from "/CONFIG";
const upgradeNames = ["Smart Factories", "Wilson Analytics", "Neural Accelerators", "Project Insight", "Smart Storage",
                        "Nuoptimal Nootropic Injector Implants", "FocusWires", "DreamSense", "Speech Processor Implants", "ABC SalesBots"];

/**
 * Buys all upgrades up to 1/1000 of corporate funds
 * 
 * @param {ns} ns Netscript object
 */
export async function main(ns) {
    if (!CORPORATIONS) {
        ns.tprint("Must have unlocked corporations to use this script.");
        return;
    }

    while (true) {
        const maxCost = ns.corporation.getCorporation().funds / 10000;

        upgradeNames.forEach((upgrade) => {
            while (ns.corporation.getUpgradeLevelCost(upgrade) < maxCost) {
                ns.corporation.levelUpgrade(upgrade);
            }
        });

        const divisions = ns.corporation.getCorporation().divisions;
        divisions.forEach((division) => {
            while (ns.corporation.getHireAdVertCost(division.name) < maxCost) {
                ns.corporation.hireAdVert(division.name);
            }
        });

        await ns.sleep(10000);
    }
}