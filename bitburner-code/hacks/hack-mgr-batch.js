import { getAllServers, rootServer } from "/utils/server-functions.js";

/**Delay to aim for between hack/weaken/grow steps.*/
const INTER_STEP_DELAY = 500;
/**Delay to wait between running successive batches.*/
const INTER_BATCH_DELAY = 1000;
/**Delay to wait between main loops.*/
const LOOP_DELAY = 10000;
/**Delay to wait between servers to avoid  locking up BitBurner*/
const SERVER_DELAY = 100;

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
    const allServers = getAllServers(ns);
    const purchasedServers = ns.getPurchasedServers();
    var servers = [];
    
    allServers.forEach((hostname) => {
        if (hostname == "home" || purchasedServers.includes(hostname)) {
            return;
        }
        else {
            servers.push({
                name: hostname,
                hackLevel: ns.getServerRequiredHackingLevel(hostname),
                hackPorts: ns.getServerNumPortsRequired(hostname),
                minSecurity: ns.getServerMinSecurityLevel(hostname),
                maxMoney: ns.getServerMaxMoney(hostname),
                rooted: false,
                threads: null,
                delays: null,
                batchCost: 0,
                runningPids: []
            });
        }
    });

    while (true) {
        //Try to root any un-rooted servers
        for (let i = 0; i < servers.length; i++) {
            if (!servers[i].rooted) {
                servers[i].rooted = rootServer(ns, servers[i].name);
            }
        }

        //Get updated batch parameters & running PID's for all rooted servers
        for (let i = 0; i < servers.length; i++) {
            if (!servers[i].rooted) {
                continue;
            }
            servers[i].threads = calculateBatchThreads(ns, servers[i].name, servers[i].minSecurity, servers[i].maxMoney);
            servers[i].delays = calculateBatchDelays(ns, servers[i].name);
            servers[i].runningPids = updateRunningPIDs(ns, servers[i].runningPids);
            servers[i].batchCost = (servers[i].threads.hack * costs.hack) + (servers[i].threads.grow * costs.grow)
                                    + ((servers[i].threads.weaken1 + servers[i].threads.weaken2) * costs.weaken);
        }

        //Get available and total space on all purchased servers
        var totalSpace = 0;
        var freeSpace = ns.getPurchasedServers().map(function(hostname) {
            totalSpace += ns.getServerMaxRam(hostname);
            return {
                name: hostname,
                free: ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname)
            }
        });

        //Update batch count & check total usage against total memory available
        var totalBatchCost = 0;
        servers.forEach((server) => {
            if (server.rooted && server.maxMoney > 0) {
                totalBatchCost += server.batchCost;
            }
        });
        var numBatches = Math.floor(totalSpace / totalBatchCost);

        if (numBatches == 0) {
            ns.tprint("Not enough RAM to run a batch.");
            ns.tprint(totalSpace + " GiB total available RAM, need " + totalBatchCost + " GiB.");
            return;
        }

        //Execute all batches
        for (let i = 0; i < servers.length; i++) {
            if (!servers[i].rooted || servers[i].runningPids.length > 0 || servers[i].maxMoney == 0) {
                continue;
            }

            var allPids = [];
            for (let j = 0; j < numBatches; j++) {
                var thisPids = executeBatch(ns, servers[i].name, servers[i].threads, servers[i].delays, j * INTER_BATCH_DELAY, freeSpace, costs);
                var anyStarted = false;

                thisPids.forEach((pid) => {
                    allPids.push(pid);
                    if (pid != 0) {
                        anyStarted = true;
                    }
                });
                
                if (thisPids.length == 0 || !anyStarted) {
                    await(ns.sleep(LOOP_DELAY));
                }
            }
            servers[i].runningPids = allPids;

            await ns.sleep(SERVER_DELAY);
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
    const hackThreads = Math.ceil(0.5 / ns.formulas.hacking.hackPercent(ns.getServer(hostname), ns.getPlayer()));
    const growThreads = Math.ceil(ns.growthAnalyze(hostname, 2.0, 1));
    const hackSecurity = ns.hackAnalyzeSecurity(hackThreads, hostname);
    const growSecurity = ns.growthAnalyzeSecurity(growThreads, hostname, 1);
    const weaken1Threads = Math.ceil(hackSecurity / 0.05) + 1;
    const weaken2Threads = Math.ceil(growSecurity / 0.05) + 1;

    const shouldHack = (ns.getServerMoneyAvailable(hostname) >= 0.75 * maxMoney)
                        && (ns.getServerSecurityLevel(hostname) <= 1.5 * minSecurity); 

    return {
        hack: shouldHack ? hackThreads : 0,
        weaken1: weaken1Threads == Infinity ? 1000 : weaken1Threads,
        grow: growThreads,
        weaken2: weaken2Threads
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
        weaken1: 0,
        grow: weakenTime - growTime + INTER_STEP_DELAY,
        weaken2: 2 * INTER_STEP_DELAY
    };
}

/**
 * Executes a batch with the specified parameters.
 * 
 * @param {ns} ns Netscript object
 * @param {string} target The target server
 * @param {{number, number, number, number}} threads The batch thread parameters
 * @param {{number, number, number, number}} delays The batch delay parameters
 * @param {number} batchDelay The overall batch delay
 * @param {{string, number}[]} freeSpace The current free space available, which will be updated
 * @param {{number, number, number}} costs The costs of hack, weaken, and grow threads
 * @returns The executed PID's
 */
function executeBatch(ns, target, threads, delays, batchDelay, freeSpace, costs) {
    const minCost = Math.max(costs.hack, costs.weaken, costs.grow);
    var remaining = Object.assign({}, threads);
    var pids = [];

    if (threads.hack + threads.weaken1 + threads.grow + threads.weaken2 == 0) {
        ns.tprint("ERROR: Called executeBatch with 0 threads");
        return [];
    }

    for (let i = 0; i < freeSpace.length; i++) {
        if (freeSpace[i].free < minCost || !ns.serverExists(freeSpace[i].name)) {
            continue;
        }

        if (remaining.hack > 0) {
            const hackThreads = Math.min(Math.floor(freeSpace[i].free / costs.hack), threads.hack);
            const pid = ns.exec("/hacks/hack-delayed.js", freeSpace[i].name, hackThreads, target, delays.hack + batchDelay, Math.random());
            if (pid == 0) {
                ns.tprint("ERROR: Could not execute hack of " + target + " from " + freeSpace[i].name);
            }
            else {
                pids.push(pid);
                freeSpace[i].free -= hackThreads * costs.hack;
                remaining.hack -= hackThreads;
            }
        }
        else if (remaining.weaken1 > 0) {
            const weakenThreads = Math.min(Math.floor(freeSpace[i].free / costs.weaken), threads.weaken1);
            const pid = ns.exec("/hacks/weaken-delayed.js", freeSpace[i].name, weakenThreads, target, delays.weaken1 + batchDelay, Math.random());
            if (pid == 0) {
                ns.tprint("ERROR: Could not execute weaken of " + target + " from " + freeSpace[i].name);
            }
            else {
                pids.push(pid);
                freeSpace[i].free -= weakenThreads * costs.weaken;
                remaining.weaken1 -= weakenThreads;
            }
        }
        else if (remaining.grow > 0) {
            const growThreads = Math.min(Math.floor(freeSpace[i].free / costs.grow), threads.grow);
            const pid = ns.exec("/hacks/grow-delayed.js", freeSpace[i].name, growThreads, target, delays.grow + batchDelay, Math.random());
            if (pid == 0) {
                ns.tprint("ERROR: Could not execute grow of " + target + " from " + freeSpace[i].name);
            }
            else {
                pids.push(pid);
                freeSpace[i].free -= growThreads * costs.grow;
                remaining.grow -= growThreads;
            }
        }
        else if (remaining.weaken2 > 0) {
            const weakenThreads = Math.min(Math.floor(freeSpace[i].free / costs.weaken), threads.weaken2);
            const pid = ns.exec("/hacks/weaken-delayed.js", freeSpace[i].name, weakenThreads, target, delays.weaken2 + batchDelay, Math.random());
            if (pid == 0) {
                ns.tprint("ERROR: Could not execute weaken of " + target + " from " + freeSpace[i].name);
            }
            else {
                pids.push(pid);
                freeSpace[i].free -= weakenThreads * costs.weaken;
                remaining.weaken2 -= weakenThreads;
            }
        }
        else {
            break;
        }

        if (freeSpace[i].free > minCost) {
            i--;
        }
    }

    return pids;
}