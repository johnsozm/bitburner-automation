/**
 * Prints shortest path from home to the target server (if found).
 * 
 * @param {ns} ns Netscript object
 */
export async function main(ns) {
	if (ns.args.length != 1) {
		ns.tprint("Usage: whereis.js [server name]");
	}
	else {
		ns.tprint(bfs(ns, "", "home", "home", ns.args[0]));
	}
}

/**
 * Breadth-first search function which tracks path to target.
 * 
 * @param {ns} ns Netscript object
 * @param {string} prevNode Hostname of the previous node traversed
 * @param {string} currentNode Hostname of the node being traversed
 * @param {string} path Accumulated string representing traversed path
 * @param {string} target Name of the target server
 * @returns The path to the target server, or a blank string if it was not found
 */
function bfs(ns, prevNode, currentNode, path, target) {
	if (currentNode == target) {
		return path;
	}
	else {
		var visible = ns.scan(currentNode);
		for (let i = 0; i < visible.length; i++) {
			if (visible[i] == prevNode) {
				continue;
			}
			var result = bfs(ns, currentNode, visible[i], path + "->" + visible[i], target);
			if (result != "") {
				return result;
			}
		}
		return "";
	}
}