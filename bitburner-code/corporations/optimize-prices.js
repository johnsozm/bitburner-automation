import { CORPORATIONS } from "../CONFIG";
const materials = ["Water", "Energy", "Metal", "Hardware", "Robots", "AI Cores", "Real Estate", "Food", "Plants", "Chemicals", "Drugs"];

/**
 * Sets optimal TA2 prices on all sold goods.
 * 
 * @param {ns} ns Netscript object
 */
export async function main(ns) {
    if (!CORPORATIONS) {
        ns.tprint("Must have unlocked corporations to use this script.");
        return;
    }

    ns.corporation.getCorporation().divisions.forEach((division) => {
        if (ns.corporation.hasResearched(division.name, "Market-TA.II")) {
            division.products.forEach((product) => {
                ns.corporation.setProductMarketTA2(division.name, product, true);
            });
            materials.forEach((material) => {
                division.cities.forEach((city) => {
                    const mat = ns.corporation.getMaterial(division.name, city, material);
                    if (mat.prod > 0) {
                        ns.corporation.setMaterialMarketTA2(division.name, city, material, true);
                    }
                });
            });
        }
        else if (ns.corporation.hasResearched(division.name, "Market-TA.I")) {
            division.products.forEach((product) => {
                ns.corporation.setProductMarketTA1(division.name, product, true);
            });
            materials.forEach((material) => {
                division.cities.forEach((city) => {
                    const mat = ns.corporation.getMaterial(division.name, city, material);
                    if (mat.prod > 0) {
                        ns.corporation.setMaterialMarketTA1(division.name, city, material, true);
                    }
                });
            });
        }
        else {
            division.products.forEach((product) => {
                division.cities.forEach((city) => {
                    ns.corporation.sellProduct(division.name, city, product, "MAX", "MP", true);
                });
            });
            materials.forEach((material) => {
                division.cities.forEach((city) => {
                    const mat = ns.corporation.getMaterial(division.name, city, material);
                    if (mat.prod > 0) {
                        ns.corporation.sellMaterial(division.name, city, material, "MAX", "MP");
                    }
                });
            });
        }
    });
}