import { getAllServers } from "/utils/server-functions.js";
import * as solver from "/contract-scripts/script-solvers.js";

/**
 * Continuously locates and solves all coding contracts.
 * 
 * @param {ns} ns Netscript object
 */
export async function main(ns) {
    const servers = getAllServers(ns);
    var blacklist = [];

    while (true) {
        var contracts = [];
        servers.forEach((hostname) => {
            var serverContracts = ns.ls(hostname, ".cct");
            serverContracts.forEach((contractFile) => {
                contracts.push({
                    hostname: hostname,
                    filename: contractFile
                });
            });
        });

        contracts.forEach((contract) => {
            if (blacklist.includes(contract.filename)) {
                return;
            }

            const type = ns.codingcontract.getContractType(contract.filename, contract.hostname);
            const args = ns.codingcontract.getData(contract.filename, contract.hostname);
            var solution = null;
            switch (type) {
                case "Algorithmic Stock Trader I":
                    solution = solver.stockTrader1(args);
                    break;
                case "Algorithmic Stock Trader II":
                    solution = solver.stockTrader2(args);
                    break;
                case "Algorithmic Stock Trader III":
                    solution = solver.stockTrader3(args);
                    break;
                case "Array Jumping Game":
                    solution = solver.arrayJumpShortestPath(args, 0, 0) > 0 ? 1 : 0;
                    break;
                case "Array Jumping Game II":
                    solution = solver.arrayJumpShortestPath(args, 0, 0);
                    break;
                case "Find All Valid Math Expressions":
                    solution = solver.validMathExpressions(args[0], args[1]);
                    break;
                case "Find Largest Prime Factor":
                    solution = solver.largestFactor(args[0]);
                    break;
                case "Generate IP Addresses":
                    solution = solver.findAllIPs("", args, 4);
                    break;
                case "HammingCodes: Integer to encoded Binary":
                    solution = solver.hammingEncode(args);
                    break;
                case "HammingCodes: Encoded Binary to Integer":
                    solution = solver.hammingDecode(args);
                    break;
                case "Merge Overlapping Intervals":
                    solution = solver.mergeIntervals(args);
                    break;
                case "Minimum Path Sum in a Triangle":
                    solution = solver.minTrianglePath(args);
                    break;
                case "Sanitize Parentheses in Expression":
                    solution = solver.sanitizeParens(args);
                    break;
                case "Shortest Path in a Grid":
                    solution = solver.shortestPath(args);
                    break;
                case "Spiralize Matrix":
                    solution = solver.spiralizeMatrix(args);
                    break;
                case "Subarray with Maximum Sum":
                    solution = solver.maxSubarraySum(args);
                    break;
                case "Total Ways to Sum":
                    solution = solver.countSumPartitions(args);
                    break;
                case "Total Ways to Sum II":
                    solution = solver.countSums(args[1], 0, 0, args[0]);
                    break;
                case "Unique Paths in a Grid I":
                    solution = solver.uniquePaths1(args[0], args[1]);
                    break;
                case "Unique Paths in a Grid II":
                    solution = solver.uniquePaths2(args, 0, 0);
                    break;                
            }
    
            if (solution != null) {
                const reward = ns.codingcontract.attempt(solution, contract.filename, contract.hostname, {returnReward: true});
                if (reward != "") {
                    ns.tprint("Contract completed! Reward: " + reward);
                }
                else {
                    ns.tprint("Failed contract of type: " + type + "on server " + contract.hostname);
                    blacklist.push(contract.filename);
                }
            }
            else {
                ns.tprint("No solution implemented for contract type " + type);
            }
        });

        await ns.sleep(60000);
    }
}