/**
 * Recursive solver function for Array Jump or Array Jump II contracts.
 * Should be initiated as array_jump_shortest_path(array, 0, 0).
 * 
 * @param {number[]} array The array to be traversed
 * @param {number} current The current location within the array
 * @param {number} steps The number of steps taken so far
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
 * @param {string} digits The digits which may be used to make the sum
 * @param {number} index The current index
 * @param {number} sum The current sum
 * @param {number} target The target sum
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
 * @param {string} ip The IP accumulator string
 * @param {string} digits The remaining digits to add to the IP
 * @param {number} remaining The number of IP digit groups remaining
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

/**
 * Solver function for Largest Prime Factor contracts.
 * 
 * @param {number} num 
 * @returns The largest prime factor of the given number, or 1 if the number has no prime factors.
 */
export function largest_factor(num) {
	if (num < 2 || Math.floor(num) != num) {
		return 1;
	}
	var n = num;
	while (n % 2 == 0) {
		n /= 2;
	}
	if (n == 1) {
		return 2;
	}
	while (n % 3 == 0) {
		n /= 3;
	}
	if (n == 1) {
		return 3;
	}

	var p = 5;
	var increment = 2;
	while (p * p <= n) {
		while (n % p == 0) {
			n /= p;
		}
		if (n == 1) {
			return p;
		}

		p += increment;
		increment = 6 - increment; //Alternate between incrementing by 2 and 4
	}

	return n;
}

/**
 * Solver function for Subarray with Maximum Sum contracts.
 * 
 * @param {number[]} array 
 * @returns The largest sum of any contiguous subarray
 */
export function max_subarray_sum(array) {
	var max_sum = -Infinity;

	for (let min = 0; min < array.length; min++) {
		var sum = 0;
		for (let max = min; max < array.length; max++) {
			sum += array[max];
			if (sum > max_sum) {
				max_sum = sum;
			}
		}
	}

	return max_sum;
}

/**
 * Solver function for Merge Overlapping Intervals contracts.
 * 
 * @param {number[][]} intervals 
 * @returns The non-overlapping set of intervals which covers all passed intervals.
 */
export function merge_intervals(intervals) {
	intervals.sort(([a, _b], [c, _d]) => a-c);
	
	var merged = [];
	var min = intervals[0][0];
	var max = intervals[0][1];
	for (let i = 1; i < intervals.length; i++) {
		//Check if intervals overlap
		if (intervals[i][0] > max) {
			merged.push([min, max]);
			min = intervals[i][0];
			max = intervals[i][1];
		}
		else {
			if (max < intervals[i][1]) {
				max = intervals[i][1];
			}
		}
	}	
	merged.push([min, max]);

	return merged;
}

/**
 * Solver function for Sanitize Parentheses in Expression contracts.
 * 
 * @param {string} string 
 * @returns A list of the longest possible substrings with matching parens
 */
export function sanitize_parens(string) {
	//Helper function to check if a string has matching parens
	function valid_parens(string) {
		var counter = 0;
		for (let i = 0; i < string.length; i++) {
			if (string[i] == '(') {
				counter += 1;
			}
			if (string[i] == ')') {
				counter -= 1;
			}
			if (counter < 0) {
				return false;
			}
		}
		return counter == 0;
	}

	var test_set = new Set();
	test_set.add(string);

	while (test_set.size > 0) {
		var next_set = new Set();
		test_set.forEach((val) => {
			for (let i = 0; i < val.length; i++) {
				if (val[i] == '(' || val[i] == ')') {
					next_set.add(val.substring(0, i) + val.substring(i+1));
				}
			}
		});

		var valid = [];
		next_set.forEach((val) => {
			if (valid_parens(val)) {
				valid.push(val);
			}
		});

		if (valid.length != 0) {
			return valid;
		}
		test_set = next_set;
	}

	return [""];
}