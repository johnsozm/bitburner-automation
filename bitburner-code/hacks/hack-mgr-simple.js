import { getAllServers, rootServer } from "/utils/server-functions.js";

/**
 * Simple hack manager which uses a fixed number of threads to hack a single server.
 * 
 * @param {ns} ns Netscript object
 */
export async function main(ns) {
    if (ns.args.length != 2) {
        ns.tprint("Usage: hack-mgr-simple.js [hack script] [threads]");
        return;
    }

    const servers = getAllServers(ns);
    const hackScript = ns.args[0];
    const threads = parseInt(ns.args[1]);
    var anyNodesLeft = true;

    while (anyNodesLeft) {
        anyNodesLeft = false;
        const hackingLevel = ns.getHackingLevel();

        for (let i = 0; i < servers.length; i++) {
            if (servers[i] == null) {
                continue;
            }

            anyNodesLeft = true;
            if (rootServer(ns, servers[i])) {
                if (ns.getServerMaxMoney(servers[i]) > 0 && hackingLevel >= ns.getServerRequiredHackingLevel(servers[i])) {
                    if (ns.run(hackScript, threads, servers[i]) == 0) {
                        ns.tprint("Ran out of RAM while trying to hack " + servers[i] + " on " + ns.getHostname());
                    }
                }
                servers[i] = null;
            }
        }

        await ns.sleep(10000);
    }
}