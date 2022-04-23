/**
 * Recursive solver function for Array Jump or Array Jump II contracts.
 * Should be initiated as array_jump_shortest_path(array, 0, 0).
 * 
 * @param array The array to be traversed
 * @param current The current location within the array
 * @param steps The number of steps taken so far
 * @returns The least number of steps required to reach the end of the array, or 0 if it is impossible
 */
export function array_jump_shortest_path(array, current, steps) {
	if (current == array.length - 1) {
		return steps;
	}
	else {
		let min_test = Infinity;
		for (let n = 1; n <= array[current] && current + n < array.length; n++) {
			let test = array_jump_shortest_path(array, current + n, steps + 1);
			if (test != 0 && test < min_test) {
				min_test = test;
			}
		}
		
		if (min_test < Infinity) {
			return min_test;
		}
		else {
			return 0;
		}
	}
}