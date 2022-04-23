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

/**
 * Recursive solver function for Total Ways to Sum II contracts.
 * Determines the number of ways to sum the given numbers to the target value.
 * Should be initiated as count_sums(digits, 0, 0, target).
 * 
 * @param digits The digits which may be used to make the sum
 * @param index The current index
 * @param sum The current sum
 * @param target The target sum
 * @returns The total number of ways to sum the given digits to the target
 */
export function count_sums(digits, index, sum, target) {
	if (sum > target) {
		return 0;
	}
	if (sum == target) {
		return 1;
	}
	if (index == digits.length - 1) {
		if ((target - sum) % digits[digits.length-1] == 0) {
			return 1;
		}
		else {
			return 0;
		}
	}

	var count = 0;
	count += count_sums(digits, index, sum + digits[index], target);
	count += count_sums(digits, index + 1, sum, target);
	return count;
}

/**
 * Recursive solver function for Generate IP Addresses contracts.
 * Should be called as find_all_ips("", digits, 4).
 * 
 * @param {*} ip The IP accumulator string
 * @param {*} digits The remaining digits to add to the IP
 * @param {*} remaining The number of IP digit groups remaining
 * @returns All IP addresses that can be generated with the given digits
 */
export function find_all_ips(ip, digits, remaining) {
	//Short-circuit if there's too much remaining string to be a valid IP
	if (digits.length > remaining * 3) {
		return [];
	}

	//Base case
	if (remaining == 1) {
		var value = parseInt(digits);
		if (value > 255 || (value != 0 && digits[0] == '0')) {
			return [];
		}
		else {
			return [ip + digits];
		}
	}

	//Recursive case
	let results = [];
	for (let offset = 1; offset <= 3; offset++) {
		var value = parseInt(digits.substring(0, offset));
		if (value > 255 || (value != 0 && digits[0] == '0')) {
			break;
		}
		results = results.concat(find_all_ips(ip + digits.substring(0, offset) + ".", digits.substring(offset), remaining - 1))
	}
	return results;
}