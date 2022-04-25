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

    const hackScript = ns.args[0];
    const threads = parseInt(ns.args[1]);
    var anyNodesLeft = true;
    var servers = new Set();
    getAllServers(ns).forEach((hostname) => {
        servers.add(hostname);
    });

    while (servers.size > 0) {
        servers.forEach((server) => {
            if (rootServer(ns, server)) {
                if (ns.getServerMaxMoney(server) > 0 ) {
                    if (ns.run(hackScript, threads, server) == 0) {
                        ns.tprint("Ran out of RAM while trying to hack " + server + " on " + ns.getHostname());
                    }
                }
                servers.delete(server);
            }
        });

        await ns.sleep(10000);
    }
}