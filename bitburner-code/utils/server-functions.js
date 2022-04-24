/**
 * File containing server-related utility functions.
 */

import SINGULARITY from "CONFIG.js"

/**
 * Generates a list of all valid server hostnames.
 * 
 * @param {ns} ns Netscript object
 * @returns All server hostnames, as a string[]
 */
export function getAllServers(ns) {
    var toVisit = new Set();
    var visited = new Set();
    toVisit.add("home");

    //Accumulate hostnames via BFS starting at home node
    while (toVisit.size > 0) {
        var nextToVisit = new Set();
        toVisit.forEach((hostname) => {
            visited.add(hostname);
            ns.scan(hostname).forEach((visible_host) => {
                if (!toVisit.has(visible_host) && !visited.has(visible_host)) {
                    nextToVisit.add(visible_host);
                }
            });
        });
        toVisit = nextToVisit;
    }

    //Cast set to array for return
    var servers = [];
    visited.forEach((hostname) => {
        servers.push(hostname);
    });

    return servers;
}

/**
 * Gains root access to the target server if possible.
 * 
 * @param {ns} ns Netscript object
 * @param {string} hostname Hostname of the target server
 * @returns True if the server was hacked, false otherwise
 */
export async function rootServer(ns, hostname) {
    if (!ns.serverExists(hostname) || ns.getHackingLevel() < ns.getServerRequiredHackingLevel(hostname)) {
        return false;
    }
    if (ns.hasRootAccess(hostname)) {
        return true;
    }

    //Apply all exploits owned
    var openPorts = 0;
    if (ns.fileExists("BruteSSH.exe", "home")) {
        ns.brutessh(hostname);
        openPorts++;
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
        ns.ftpcrack(hostname);
        openPorts++;
    }
    if (ns.fileExists("relaySMTP.exe", "home")) {
        ns.relaysmtp(hostname);
        openPorts++;
    }
    if (ns.fileExists("HTTPWorm.exe", "home")) {
        ns.httpworm(hostname);
        openPorts++;
    }
    if (ns.fileExists("SQLInject.exe", "home")) {
        ns.sqlinject(hostname);
        openPorts++;
    }

    if (openPorts >= ns.getServerNumPortsRequired(hostname)) {
        ns.nuke(hostname);
        if (SINGULARITY) {
            await ns.singularity.installBackdoor(hostname);
        }
        return true;
    }
    
    return false;
}