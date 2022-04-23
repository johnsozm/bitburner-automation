/**
 * Prints out current player karma.
 * 
 * @param ns Netscript object
 */
export async function main(ns) {
	ns.tprint("Current karma: " + ns.heart.break());
}