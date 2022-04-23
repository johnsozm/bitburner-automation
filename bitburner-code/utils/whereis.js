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
 * @param {string} prev_node Hostname of the previous node traversed
 * @param {string} current_node Hostname of the node being traversed
 * @param {string} path Accumulated string representing traversed path
 * @param {string} target Name of the target server
 * @returns The path to the target server, or a blank string if it was not found
 */
function bfs(ns, prev_node, current_node, path, target) {
	if (current_node == target) {
		return path;
	}
	else {
		var visible = ns.scan(current_node);
		for (let i = 0; i < visible.length; i++) {
			if (visible[i] == prev_node) {
				continue;
			}
			var result = bfs(ns, current_node, visible[i], path + "->" + visible[i], target);
			if (result != "") {
				return result;
			}
		}
		return "";
	}
}