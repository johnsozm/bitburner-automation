import { getAllServers, rootServer } from "/utils/server-functions.js";

/**Delay to aim for between hack/weaken/grow steps.*/
const INTER_STEP_DELAY = 500;
/**Delay to wait between running successive batches.*/
const INTER_BATCH_DELAY = 1000;
/**Delay to wait between main loops.*/
const LOOP_DELAY = 10000;

/**
 * Hack manager which generates timed batches of hack/grow/weaken calls.
 * 
 * @param {ns} ns Netscript object
 */
export async function main(ns) {
    //Basic run information
    const costs = {
        hack: ns.getScriptRam("/hacks/hack-delayed.js", "home"),
        grow: ns.getScriptRam("/hacks/grow-delayed.js", "home"),
        weaken: ns.getScriptRam("/hacks/weaken-delayed.js", "home")
    };
    var servers = getAllServers(ns).map(function(hostname) {
        return {
            name: hostname,
            hackLevel: ns.getServerRequiredHackingLevel(hostname),
            hackPorts: ns.getServerNumPortsRequired(hostname),
            minSecurity: ns.getServerMinSecurityLevel(hostname),
            maxMoney: ns.getServerMaxMoney(hostname),
            rooted: false,
            threads: null,
            delays: null,
            batchCost: 0,
            running: []
        };
    });

    while (true) {
        //Try to root any un-rooted servers
        for (let i = 0; i < servers.length; i++) {
            if (!servers[i].rooted) {
                servers[i].rooted = rootServer(ns, servers[i].name);
            }
        }

        //Get updated batch parameters & running PID's for all rooted servers
        var totalBatchCost = 0;
        for (let i = 0; i < servers.length; i++) {
            if (!servers[i].rooted) {
                continue;
            }
            servers[i].threads = calculateBatchThreads(ns, servers[i].name);
            servers[i].delays = calculateBatchDelays(ns, servers[i].name, servers[i].minSecurity, servers[i].maxMoney);
            servers[i].runningPids = updateRunningPIDs(ns, servers[i].runningPids);
            servers[i].batchCost = (servers[i].threads.hack * costs.hack) + (servers[i].threads.grow * costs.grow)
                                    + ((servers[i].threads.weaken_1 + servers[i].threads.weaken_2) * costs.weaken);
            totalBatchCost += servers[i].batchCost;
        }

        //Get available and total space on all purchased servers
        var totalSpace = 0;
        var freeSpace = ns.getPurchasedServers.map(function(hostname) {
            totalSpace += getServerMaxRam(hostname);
            return {
                name: hostname,
                free: ns.getServerMaxRam(hostname) - getServerUsedRam(hostname)
            }
        });

        //Update batch count & check total usage against total memory available
        var totalBatchCost = 0;
        servers.forEach((server) => {
            if (server.rooted) {
                totalBatchCost += server.batchCost;
            }
        });
        var numBatches = Math.floor(totalSpace / totalBatchCost);

        if (numBatches == 0) {
            ns.tprint("Not enough RAM to run a batch.");
            ns.tprint(totalSpace + " GiB total available RAM, need " + totalBatchCost + "GiB.");
            return;
        }

        //Execute all batches
        for (let i = 0; i < servers.length; i++) {
            if (!servers[i].rooted || servers[i].runningPids.length > 0) {
                continue;
            }

            var allPids = [];
            for (let j = 0; j < numBatches; j++) {
                thisPids = executeBatch(ns, servers[i].threads, servers[i].delays, j * INTER_BATCH_DELAY);

                if (thisPids.length == 0) {
                    ns.tprint("ERROR: No batches initiated. Exiting.");
                    return;
                }

                thisPids.forEach((pid) => {
                    allPids.push(pid);
                });
            }
            servers[i].runningPids = thisPids;
        }

        await ns.sleep(LOOP_DELAY);
    }
}

/**
 * Takes a list of PID's and removes those which are no longer running.
 * 
 * @param {ns} ns Netscript object
 * @param {number[]} pids The list of running PID's to be updated
 */
function updateRunningPIDs(ns, pids) {
    var runningPids = [];

    pids.forEach((pid) => {
        if (ns.isRunning(pid)) {
            runningPids.push(pid);
        }
    });

    return runningPids;
}

/**
 * Calculates the number of threads needed for the next batch on the target server.
 * 
 * @param {ns} ns Netscript object
 * @param {string} hostname Server hostname
 * @param {number} minSecurity The minimum security level on the server
 * @param {number} maxMoney The maximum money on the server
 * @returns The thread parameters that should be used for the next batch on this host
 */
function calculateBatchThreads(ns, hostname, minSecurity, maxMoney) {
    //TODO: Deal with possibility of cores != 1 when running from home
    var hackThreads = Math.floor(ns.hackAnalyzeThreads(hostname, 0.5 * maxMoney));
    const growThreads = Math.ceil(ns.growthAnalyze(hostname, 2.0, 1));
    const hackSecurity = ns.hackAnalyzeSecurity(hackThreads, hostname);
    const growSecurity = ns.growthAnalyzeSecurity(growThreads, hostname);
    const weaken1Threads = Math.ceil(hackSecurity / 0.05) + 1;
    const weaken2Threads = Math.ceil(growSecurity / 0.05) + 1;

    const shouldHack = (ns.getServerMoneyAvailable(hostname) >= 0.75 * maxMoney)
                        && (ns.getServerSecurityLevel(hostname) <= 1.5 * minSecurity); 

    return {
        hack: shouldHack ? hackThreads : 0,
        weaken_1: weaken1Threads,
        grow: growThreads,
        weaken_2: weaken2Threads
    };
}

/**
 * Calculates the delay parameters needed for the next batch on the target server.
 * 
 * @param {ns} ns Netscript object
 * @param {string} hostname Server hostname
 * @returns The delay parameters that should be used for the next batch on this host
 */
function calculateBatchDelays(ns, hostname) {
    const hackTime = ns.getHackTime(hostname);
    const growTime = ns.getGrowTime(hostname);
    const weakenTime = ns.getWeakenTime(hostname);

    return {
        hack: weakenTime - hackTime - INTER_STEP_DELAY,
        weaken_1: 0,
        grow: weakenTime - growTime + INTER_STEP_DELAY,
        weaken_2: 2 * INTER_STEP_DELAY
    };
}

/**
 * Executes a batch with the specified parameters.
 * 
 * @param {ns} ns Netscript object
 * @param {number, number, number, number} threads The batch thread parameters
 * @param {number, number, number, number} delays The batch delay parameters
 * @param {number} batchDelay The overall batch delay
 * @returns The executed PID's
 */
function executeBatch(ns, threads, delays, batchDelay) {
    //TODO: Implement
    return [];
}