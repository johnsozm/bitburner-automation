/**
 * Simple hacking function for quick accumulation of cash.
 * 
 * @param {ns} ns Netscript object
 */
export async function main(ns) {
	if (ns.args.length != 1) {
		print("Usage: quickhack.js [server]");
		return;
	}

	while (true) {
		await ns.hack(ns.args[0]);
	}
}