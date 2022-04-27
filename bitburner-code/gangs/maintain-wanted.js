import { GANGS } from "/CONFIG.js"

/**
 * Uses a single gang member to maintain wanted losses between 0 and 1/12.
 * 
 * @param {ns} ns Netscript object
 */
export async function main(ns) {
    if (ns.args.length != 3) {
        ns.tprint("Usage: maintain-wanted.js [member name] [management task] [default task]");
        return;
    }
    if (!GANGS) {
        ns.tprint("Gangs must be unlocked to use this call.");
        return;
    }

    var shrinkingWanted = false;

    while (true) {
        if (shrinkingWanted) {
            ns.gang.setMemberTask(ns.args[0], ns.args[1]);
            if (ns.gang.getGangInformation().wantedPenalty > 0.9999) {
                shrinkingWanted = false;
            }
        }
        else {
            ns.gang.setMemberTask(ns.args[0], ns.args[2]);
            if (ns.gang.getGangInformation().wantedPenalty <= 11.0/12.0) {
                shrinkingWanted = true;
            }
        }

        await ns.sleep(10000);
    }
    
}