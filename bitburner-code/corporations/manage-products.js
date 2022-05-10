import { CORPORATIONS } from "/CONFIG";

/**
 * Maintains the products for a given division.
 * 
 * @param {ns} ns Netscript object
 */
export async function main(ns) {
    if (!CORPORATIONS) {
        ns.tprint("Must have unlocked corporations to use this script.");
        return;
    }    

    if (ns.args.length != 2) {
        ns.tprint("Usage: manage-products.js [division name] [minimum investment]");
        return;
    }

    const divisionName = ns.args[0];

    if (ns.corporation.getDivision(divisionName) == null) {
        ns.tprint("No such division " + divisionName);
        return;
    }

    if (!ns.corporation.hasResearched(divisionName, "Market-TA.II")) {
        ns.tprint("Must have researched Market-TA.II to use this script.");
        return;
    }

    var lastCost = parseFloat(ns.args[1]);

    while (true) {
        const money = ns.corporation.getCorporation().funds;
        
        if (money > lastCost * 10) {
            const division = ns.corporation.getDivision(divisionName);
            const products = division.products.map(function (product) {
                return ns.corporation.getProduct(divisionName, product);
            });

            var maxProducts = 3;
            if (ns.corporation.hasResearched(divisionName, "uPgrade: Capacity.I")) {
                maxProducts++;
            }
            if (ns.corporation.hasResearched(divisionName, "uPgrade: Capacity.II")) {
                maxProducts++;
            }

            //Assess current products status
            var developing = false;
            products.forEach((product) => {
                if (product.developmentProgress < 100) {
                    developing = true;
                }
                ns.corporation.setProductMarketTA2(divisionName, product.name, true);
                ns.corporation.sellProduct(divisionName, "Aevum", product.name, "MAX", "MP", true);
            });

            if (!developing) {
                //Discontinue least profitable product if needed
                if (products.length == maxProducts) {
                    var minRating = Infinity;
                    var minProductName = "";

                    products.forEach((product) => {
                        if (product.rat < minRating) {
                            minRating = product.rat;
                            minProductName = product.name;
                        }
                    });

                    ns.corporation.discontinueProduct(divisionName, minProductName);
                }

                //Research new product
                lastCost = money;
                ns.corporation.makeProduct(divisionName, "Aevum", Math.random().toString().substring(2, 6), money / 2, money / 2);
            }
        }

        await ns.sleep(10000);
    }
}