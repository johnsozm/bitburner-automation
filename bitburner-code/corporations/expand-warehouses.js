import { CORPORATIONS } from "/CONFIG";
const cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];

/**
 * Expands all of a division's warehouses to the target size.
 * 
 * @param {ns} ns Netscript object
 */
export async function main(ns) {
    if (!CORPORATIONS) {
        ns.tprint("Must have unlocked corporations to use this script.");
        return;
    }

    if (ns.args.length != 2) {
        ns.tprint("Usage: expand-warehouses.js [division] [target size]");
        return;
    }

    const divisionName = ns.args[0];
    const size = parseFloat(ns.args[1]);

    if (ns.corporation.getDivision(divisionName) == null) {
        ns.tprint("No such division " + divisionName);
        return;
    }

    var upgradeDone = false;

    while (!upgradeDone) {
        cities.forEach((cityName) => {
            while (ns.corporation.getUpgradeWarehouseCost(divisionName, cityName) < ns.corporation.getCorporation().funds) {
                if (ns.corporation.getWarehouse(divisionName, cityName).size >= size) {
                    break;
                }
                ns.corporation.upgradeWarehouse(divisionName, cityName);
            }
        });

        upgradeDone = true;
        cities.forEach((cityName) => {
            if (ns.corporation.getWarehouse(divisionName, cityName).size < size) {
                upgradeDone = false;
            }
        })

        await ns.sleep(10000);
    }
}