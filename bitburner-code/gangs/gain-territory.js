import { GANGS } from "/CONFIG.js"

/**
 * Simple territory war manager.
 * 
 * @param {ns} ns Netscript object
 */
export async function main(ns) {
    if (!GANGS) {
        ns.tprint("Gangs must be unlocked to use this call.");
        return;
    }

    const gangs = ["Slum Snakes", "Speakers for the Dead", "The Black Hand", "The Dark Army", "The Syndicate", "NiteSec", "Tetrads"];
    const myGang = ns.gang.getGangInformation().faction;

    while (true) {
        const members = ns.gang.getMemberNames();
        const gangInfo = ns.gang.getOtherGangInformation();

        //Assign all non-training members to territory warfare
        members.forEach((name) => {
            const currentAssignment = ns.gang.getMemberInformation(name).task;
            if (currentAssignment != "Territory Warfare" && !currentAssignment.startsWith("Train")) {
                ns.gang.setMemberTask(name, "Territory Warfare");
            }
        });

        var minWinChance = 1;
        var maxTerritory = 0;
        gangs.forEach((gang) => {
            if (gang == myGang || gangInfo[gang].territory == 0) {
                return;
            }

            const winChance = ns.gang.getChanceToWinClash(gang);
            if (winChance < minWinChance) {
                minWinChance = winChance;
            }
            if (gangInfo[gang].territory > maxTerritory) {
                maxTerritory = gangInfo[gang].territory;
            }
        });

        if (maxTerritory == 0) {
            ns.tprint("Territory war finished.");
            break;
        }

        if (minWinChance >= 0.9) {
            ns.gang.setTerritoryWarfare(true);
        }

        if (minWinChance <= 0.8) {
            ns.gang.setTerritoryWarfare(false);
        }

        await ns.sleep(10000);
    }
}