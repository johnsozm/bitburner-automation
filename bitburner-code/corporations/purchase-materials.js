import { CORPORATIONS } from "/CONFIG";
const cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];

/**
 * Buys a fixed quantity of materials for all cities in a division.
 * 
 * @param {ns} ns Netscript object
 */
export async function main(ns) {
    if (!CORPORATIONS) {
        ns.tprint("Must have unlocked corporations to use this script.");
        return;
    }

    if (ns.args.length != 3) {
        ns.tprint("Usage: purchase-material.js [division] [material] [quantity]");
        return;
    }

    const divisionName = ns.args[0];
    const materialName = ns.args[1];
    const quantity = parseFloat(ns.args[2]);

    if (!ns.corporation.hasResearched(divisionName, "Bulk Purchasing")) {
        ns.tprint("Must have researched bulk purchasing to use this script.");
        return;
    }

    cities.forEach((cityName) => {
        ns.corporation.bulkPurchase(divisionName, cityName, materialName, quantity);
    });
}