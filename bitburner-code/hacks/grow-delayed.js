/**
 * Script which executes a grow after a specified delay.
 * Should only be called by batcher.
 * 
 * @param {ns} ns Netscript object
 */
 export async function main(ns) {
    if (ns.args.length != 2) {
        ns.tprint("Usage: grow-delayed.js [target] [delay (ms)]");
        return;
    }

    const target = ns.args[0];
    const delay = parseInt(ns.args[1]);

    await ns.sleep(delay);
    await ns.grow(target);
}