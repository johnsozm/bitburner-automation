/**
 * Script which executes a hack after a specified delay.
 * Should only be called by batcher.
 * 
 * @param {ns} ns Netscript object
 */
export async function main(ns) {
    if (ns.args.length != 3) {
        ns.tprint("Usage: hack-delayed.js [target] [delay (ms)] [randomizer value]");
        return;
    }

    const target = ns.args[0];
    const delay = parseInt(ns.args[1]);

    await ns.sleep(delay);
    await ns.hack(target);
}