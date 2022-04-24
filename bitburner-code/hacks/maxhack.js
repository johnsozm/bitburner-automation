/**
 * Function which grows and weakens server as much as possible between hacks.
 * 
 * @param {ns} ns Netscript object
 */
export async function main(ns) {
	if (ns.args.length != 1) {
		ns.tprint("Usage: maxhack.js [hostname]");
	}

	var min_security = ns.getServerMinSecurityLevel(ns.args[0]);
	var max_money = ns.getServerMaxMoney(ns.args[0]);

	while(true) {
		while (ns.getServerMoneyAvailable(ns.args[0]) < max_money) {
			await ns.grow(ns.args[0]);
			while (ns.getServerSecurityLevel(ns.args[0]) > min_security) {
				await ns.weaken(ns.args[0]);
			}
		}
		
		await ns.hack(ns.args[0]);
	}
}