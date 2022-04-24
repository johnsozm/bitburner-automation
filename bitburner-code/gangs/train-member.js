import { GANGS } from "/CONFIG.js"

/**
 * Trains a gang member to the specified minimum stats.
 * 
 * @param {ns} ns Netscript object
 */
export async function main(ns) {
    if (ns.args.length != 2) {
        ns.tprint("Usage: train-member.js [member name] [skill level]");
        return;
    }

    if (!GANGS) {
        ns.tprint("Gangs must be unlocked to use this call.");
        return;
    }

    const member = ns.args[0];
    const targetLevel = parseInt(ns.args[1]);

    if (!ns.gang.getMemberNames().includes(member)) {
        ns.tprint("No such gang member " + member);
        return;
    }

    while (true) {
        const stats = ns.gang.getMemberInformation(member);
        const ascensionResults = ns.gang.getAscensionResult(member);

        const hackDone = stats.hack >= targetLevel;
        const combatDone = (stats.agi >= targetLevel) && (stats.def >= targetLevel)
                        && (stats.dex >= targetLevel) && (stats.str >= targetLevel);
        const chaDone = stats.cha >= targetLevel;

        const hackAscend = ascensionResults == null ? false : (ascensionResults.hack >= 1.5 * stats.hack_asc_mult || ascensionResults.hack >= stats.hack_asc_mult + 2);
        const combatAscend = ascensionResults == null ? false : (ascensionResults.agi >= 1.5 * stats.agi_asc_mult || ascensionResults.agi >= stats.agi_asc_mult + 2)
                            && (ascensionResults.def >= 1.5 * stats.def_asc_mult || ascensionResults.def >= stats.def_asc_mult + 2)
                            && (ascensionResults.dex >= 1.5 * stats.dex_asc_mult || ascensionResults.dex >= stats.dex_asc_mult + 2)
                            && (ascensionResults.str >= 1.5 * stats.str_asc_mult || ascensionResults.str >= stats.str_asc_mult + 2);
        const chaAscend = ascensionResults == null ? false : (ascensionResults.cha >= 1.5 * stats.cha_asc_mult || ascensionResults.cha >= stats.cha_asc_mult + 2);

        if (hackDone && combatDone && chaDone) {
            ns.gang.setMemberTask(member, "Territory Warfare");
            break;
        }
        else if (!hackDone  && !hackAscend) {
            ns.gang.setMemberTask(member, "Train Hacking");
        }
        else if (!combatDone && !combatAscend) {
            ns.gang.setMemberTask(member, "Train Combat");
        }
        else if (!chaDone && !chaAscend) {
            ns.gang.setMemberTask(member, "Train Charisma");
        }
        else {
            ns.gang.ascendMember(member);
        }

        await ns.sleep(10000);
    }

    ns.tprint("Finished training " + member);
}

