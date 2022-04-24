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
 * @param {number} num The number to be factored
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
 * @param {number[]} array The array to be analyzed
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
 * @param {number[][]} intervals The intervals to merge
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
 * @param {string} string The original expression as a string
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

/**
 * Solver function for Spiralize Matrix contracts.
 * 
 * @param {number[][]} matrix The matrix to spiralize
 * @returns An array containing the spiralized matrix
 */
export function spiralize_matrix(matrix) {
	var min_x = 0;
	var min_y = 0;
	var max_x = matrix[0].length - 1;
	var max_y = matrix.length - 1;
	var x = 0;
	var y = 0;
    var spiralized = [];

	while(min_x <= max_x && min_y <= max_y) {
        if (min_x > max_x) {
            break;
        }
        while (x <= max_x) {  
            spiralized.push(matrix[y][x]);
            x++;
        }
        min_y++;
        y++;
        x--;

        if (min_y > max_y) {
            break;
        }
        while (y <= max_y) {
            spiralized.push(matrix[y][x]);
            y++;
        }
        max_x--;
        y--;
        x--;

        if (min_x > max_x) {
            break;
        }
        while (x >= min_x) {
            spiralized.push(matrix[y][x]);
            x--;
        }
        max_y--;
        x++;
        y--;

        if (min_y > max_y) {
            break;
        }
        while (y >= min_y) {
            spiralized.push(matrix[y][x]);
            y--;
        }
        min_x++;
        x++;
        y++;
    }

	return spiralized;
}

/**
 * Solver function for Algorithmic Stock Trader I contracts.
 * 
 * @param {number[]} prices The prices to analyze
 * @returns The maximum profit that can be made with a single trade.
 */
export function stock_trader_1(prices) {
	var max_profit = 0;

	for (let i = 0; i < prices.length - 1; i++) {
		for (let j = i + 1; j < prices.length; j++) {
			var profit = prices[j] - prices[i];
			if (profit > max_profit) {
				max_profit = profit;
			}
		}
	}

	return max_profit;
}

/**
 * Solver function for Algorithmic Stock Trader II contracts.
 * 
 * @param {number[]} prices The prices to analyze
 * @returns The maximum profit that can be made using any number of trades
 */
export function stock_trader_2(prices) {
	var max_profit = [];
	for (let i = 0; i < prices.length; i++) {
		max_profit.push(0);
	}
	max_profit.push(0); //Extra entry for going past sale at last step

	for (let i = prices.length - 2; i >= 0; i--) {
		max_profit[i] = max_profit[i+1];
		for (let j = i + 1; j < prices.length; j++) {
			var test = prices[j] - prices[i] + max_profit[j+1];
			if (test > max_profit[i]) {
				max_profit[i] = test;
			}
		}
	}

	return max_profit[0];
}

/**
 * Solver function for Algorithmic Stock Trader III contracts.
 * 
 * @param {number[]} prices The prices to analyze
 * @returns The maximum profit that can be made using at most 2 trades.
 */
export function stock_trader_3(prices) {
	var gains = [];
	for (let i = 0; i < prices.length - 1; i++) {
		var thisGains = [];
		for (let j = 0; j <= prices.length; j++) {
			if (j <= i) {
				thisGains.push(0);
			}
			else {
				thisGains.push(prices[j] - prices[i]);
			}
		}
		gains.push(thisGains);
	}

	var maxProfit = -Infinity;

	for (let i = 0; i < prices.length - 3; i++) {
		for (let j = i + 1; j < prices.length - 2; j++) {
			for (let k = j + 1; k < prices.length - 1; k++) {
				for (let l = k + 1; l < prices.length; l++) {
					const profit = gains[i][j] + gains[k][l];
					if (profit > maxProfit) {
						maxProfit = profit;
					}
				}
			}
		}
	}

	const singleStep = stock_trader_1(prices);
	if (singleStep > maxProfit) {
		maxProfit = singleStep;
	}

	return maxProfit;
}

/**
 * Solver function for Total Ways to Sum contracts.
 * 
 * @param {number} total The number to partition
 * @returns The number of distinct partitions, excluding n = n
 */
 export function count_sum_partitions(total) {
	var counts = [];

	//Initialize counts - count[i][j] is ways of writing i using largest term j
	for (let i = 0; i <= total; i++) {
		var next = [];
		for (let j = 0; j <= i; j++) {
			if (j == 1 || i == 0) {
				next.push(1);
			}
			else {
				next.push(0);
			}
		}

		counts.push(next);
	}

	//Recursively calculate
	for (let i = 2; i <= total; i++) {
		for (let j = 2; j <= i; j++) {
			var difference = i - j;
			var index = j;
			if (j > difference) {
				index = difference;
			}

			counts[i][j] = counts[i][j-1] + counts[difference][index];
		}
	}

	return counts[total][total] - 1;
}

/**
 * Solver function for Unique Paths in a Grid.
 * 
 * @param {number} rows The number of rows in the grid
 * @param {number} columns The number of columns in the grid
 * @returns The number of distinct paths from the top-left to the bottom-right cell
 */
export function unique_paths_1(rows, columns) {
	//Compute ((rows-1) + (columns-1)) choose (rows-1)
	var paths = 1;
	for (let i = rows + columns - 2; i > rows - 1; i--) {
		paths *= i;
	}
	for (let i = 2; i <= columns - 1; i++) {
		paths /= i;
	}

	return paths;
}

/**
 * Recursive solver function for Unique Paths in a Grid II.
 * Should be called as unique_paths_2(grid, 0, 0).
 * 
 * @param {number[][]} grid The grid to be traversed (0 = passable, 1 = impassable)
 * @param {number} x The current x coordinate
 * @param {number} y The current y coordinate
 * @returns The number of unique paths from (x, y) to the bottom right
 */
export function unique_paths_2(grid, x, y) {
	if (y == grid.length - 1 && x == grid[0].length - 1) {
		return 1;
	}

	var paths = 0;
	if (y < grid.length - 1 && grid[y+1][x] == 0) {
		paths += unique_paths_2(grid, x, y+1);
	}
	if (x < grid[0].length - 1 && grid[y][x+1] == 0) {
		paths += unique_paths_2(grid, x+1, y);
	}
	return paths;
}

/**
 * Solver function for Find All Valid Math Expressions
 * 
 * @param {string} digits 
 * @param {number} target 
 * @returns An array of all expressions using the given numbersthat evaluate to target.
 */
export function valid_math_expressions(digits, target) {
	//Helper function to generate all possible expressions
	function generate_all_expressions(string) {
		if (string.length == 1) {
			var ret = new Set();
			ret.add(string);
			return ret;
		}
	
		var expressions = new Set();
	
		if (string[0] != '0') {
			expressions.add(string);
		}
	
		for (let i = 1; i < string.length; i++) {
			if (string[0] == '0' && i > 1) {
				break;
			}
			var extensions = generate_all_expressions(string.substring(i));
			extensions.forEach((ext) => {
				expressions.add(string.substring(0, i) + "+" + ext);
				expressions.add(string.substring(0, i) + "-" + ext);
				expressions.add(string.substring(0, i) + "*" + ext);
			});
		}
	
		return expressions;
	}

	var expressions = generate_all_expressions(digits);
	var valid_expressions = [];

	expressions.forEach((expr) => {
		if (eval(expr) == target) {
			valid_expressions.push(expr);
		}
	});

	return valid_expressions;
}