/**
 * Recursive solver function for Array Jump or Array Jump II contracts.
 * Should be initiated as arrayJumpShortestPath(array, 0, 0).
 * 
 * @param {number[]} array The array to be traversed
 * @param {number} current The current location within the array
 * @param {number} steps The number of steps taken so far
 * @returns The least number of steps required to reach the end of the array, or 0 if it is impossible
 */
export function arrayJumpShortestPath(array, current, steps) {
	if (current == array.length - 1) {
		return steps;
	}
	else {
		let minTest = Infinity;
		for (let n = 1; n <= array[current] && current + n < array.length; n++) {
			let test = arrayJumpShortestPath(array, current + n, steps + 1);
			if (test != 0 && test < minTest) {
				minTest = test;
			}
		}
		
		if (minTest < Infinity) {
			return minTest;
		}
		else {
			return 0;
		}
	}
}

/**
 * Recursive solver function for Total Ways to Sum II contracts.
 * Determines the number of ways to sum the given numbers to the target value.
 * Should be initiated as countSums(digits, 0, 0, target).
 * 
 * @param {string} digits The digits which may be used to make the sum
 * @param {number} index The current index
 * @param {number} sum The current sum
 * @param {number} target The target sum
 * @returns The total number of ways to sum the given digits to the target
 */
export function countSums(digits, index, sum, target) {
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
	count += countSums(digits, index, sum + digits[index], target);
	count += countSums(digits, index + 1, sum, target);
	return count;
}

/**
 * Recursive solver function for Generate IP Addresses contracts.
 * Should be called as findAllIPs("", digits, 4).
 * 
 * @param {string} ip The IP accumulator string
 * @param {string} digits The remaining digits to add to the IP
 * @param {number} remaining The number of IP digit groups remaining
 * @returns All IP addresses that can be generated with the given digits
 */
export function findAllIPs(ip, digits, remaining) {
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
		results = results.concat(findAllIPs(ip + digits.substring(0, offset) + ".", digits.substring(offset), remaining - 1))
	}
	return results;
}

/**
 * Solver function for Largest Prime Factor contracts.
 * 
 * @param {number} num The number to be factored
 * @returns The largest prime factor of the given number, or 1 if the number has no prime factors.
 */
export function largestFactor(num) {
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
export function maxSubarraySum(array) {
	var maxSum = -Infinity;

	for (let min = 0; min < array.length; min++) {
		var sum = 0;
		for (let max = min; max < array.length; max++) {
			sum += array[max];
			if (sum > maxSum) {
				maxSum = sum;
			}
		}
	}

	return maxSum;
}

/**
 * Solver function for Merge Overlapping Intervals contracts.
 * 
 * @param {number[][]} intervals The intervals to merge
 * @returns The non-overlapping set of intervals which covers all passed intervals.
 */
export function mergeIntervals(intervals) {
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
export function sanitizeParens(string) {
	//Helper function to check if a string has matching parens
	function validParens(string) {
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

	var testSet = new Set();
	testSet.add(string);

	while (testSet.size > 0) {
		var nextSet = new Set();
		testSet.forEach((val) => {
			for (let i = 0; i < val.length; i++) {
				if (val[i] == '(' || val[i] == ')') {
					nextSet.add(val.substring(0, i) + val.substring(i+1));
				}
			}
		});

		var valid = [];
		nextSet.forEach((val) => {
			if (validParens(val)) {
				valid.push(val);
			}
		});

		if (valid.length != 0) {
			return valid;
		}
		testSet = nextSet;
	}

	return [""];
}

/**
 * Solver function for Spiralize Matrix contracts.
 * 
 * @param {number[][]} matrix The matrix to spiralize
 * @returns An array containing the spiralized matrix
 */
export function spiralizeMatrix(matrix) {
	var minX = 0;
	var minY = 0;
	var maxX = matrix[0].length - 1;
	var maxY = matrix.length - 1;
	var x = 0;
	var y = 0;
    var spiralized = [];

	while(minX <= maxX && minY <= maxY) {
        if (minX > maxX) {
            break;
        }
        while (x <= maxX) {  
            spiralized.push(matrix[y][x]);
            x++;
        }
        minY++;
        y++;
        x--;

        if (minY > maxY) {
            break;
        }
        while (y <= maxY) {
            spiralized.push(matrix[y][x]);
            y++;
        }
        maxX--;
        y--;
        x--;

        if (minX > maxX) {
            break;
        }
        while (x >= minX) {
            spiralized.push(matrix[y][x]);
            x--;
        }
        maxY--;
        x++;
        y--;

        if (minY > maxY) {
            break;
        }
        while (y >= minY) {
            spiralized.push(matrix[y][x]);
            y--;
        }
        minX++;
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
export function stockTrader1(prices) {
	var maxProfit = 0;

	for (let i = 0; i < prices.length - 1; i++) {
		for (let j = i + 1; j < prices.length; j++) {
			var profit = prices[j] - prices[i];
			if (profit > maxProfit) {
				maxProfit = profit;
			}
		}
	}

	return maxProfit;
}

/**
 * Solver function for Algorithmic Stock Trader II contracts.
 * 
 * @param {number[]} prices The prices to analyze
 * @returns The maximum profit that can be made using any number of trades
 */
export function stockTrader2(prices) {
	var maxProfit = [];
	for (let i = 0; i < prices.length; i++) {
		maxProfit.push(0);
	}
	maxProfit.push(0); //Extra entry for going past sale at last step

	for (let i = prices.length - 2; i >= 0; i--) {
		maxProfit[i] = maxProfit[i+1];
		for (let j = i + 1; j < prices.length; j++) {
			var test = prices[j] - prices[i] + maxProfit[j+1];
			if (test > maxProfit[i]) {
				maxProfit[i] = test;
			}
		}
	}

	return maxProfit[0];
}

/**
 * Solver function for Algorithmic Stock Trader III contracts.
 * 
 * @param {number[]} prices The prices to analyze
 * @returns The maximum profit that can be made using at most 2 trades.
 */
export function stockTrader3(prices) {
	return stockTrader4(prices, 2);
}

/**
 * Solver function for Algorithmic Stock Trader IV contracts.
 * 
 * @param {number[]} prices The prices to analyze
 * @param {number} maxTrades The maximum number of trades that may be executed
 * @returns The maximum profit that can be made using at most the specified number of trades.
 */
export function stockTrader4(prices, maxTrades) {
	//Dynamic programming approach - calculate max for n trades as max of 1 trades from here + max of n-1 trades from other end
	var maxProfit = Array.from(Array(maxTrades + 1), _ => Array(prices.length + 1).fill(0));
	
	for (let trades = 1; trades <= maxTrades; trades++) {
		for (let i = prices.length - 2; i >= 0; i--) {
			for (let j = i + 1; j < prices.length; j++) {
				maxProfit[trades][i] = Math.max(maxProfit[trades][i], maxProfit[trades-1 ][j+1] + prices[j] - prices[i]);
			}
			maxProfit[trades][i] = Math.max(maxProfit[trades][i], maxProfit[trades][i+1]);
		}
	}

	return maxProfit[maxTrades][0];
}

/**
 * Solver function for Total Ways to Sum contracts.
 * 
 * @param {number} total The number to partition
 * @returns The number of distinct partitions, excluding n = n
 */
 export function countSumPartitions(total) {
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
export function uniquePaths1(rows, columns) {
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
 * Should be called as uniquePaths2(grid, 0, 0).
 * 
 * @param {number[][]} grid The grid to be traversed (0 = passable, 1 = impassable)
 * @param {number} x The current x coordinate
 * @param {number} y The current y coordinate
 * @returns The number of unique paths from (x, y) to the bottom right
 */
export function uniquePaths2(grid, x, y) {
	if (y == grid.length - 1 && x == grid[0].length - 1) {
		return 1;
	}

	var paths = 0;
	if (y < grid.length - 1 && grid[y+1][x] == 0) {
		paths += uniquePaths2(grid, x, y+1);
	}
	if (x < grid[0].length - 1 && grid[y][x+1] == 0) {
		paths += uniquePaths2(grid, x+1, y);
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
export function validMathExpressions(digits, target) {
	//Helper function to generate all possible expressions
	function generateAllExpressions(string) {
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
			var extensions = generateAllExpressions(string.substring(i));
			extensions.forEach((ext) => {
				expressions.add(string.substring(0, i) + "+" + ext);
				expressions.add(string.substring(0, i) + "-" + ext);
				expressions.add(string.substring(0, i) + "*" + ext);
			});
		}
	
		return expressions;
	}

	var expressions = generateAllExpressions(digits);
	var validExpressions = [];

	expressions.forEach((expr) => {
		if (eval(expr) == target) {
			validExpressions.push(expr);
		}
	});

	return validExpressions;
}

/**
 * Solver function for Minimum Path Sum in a Triangle.
 * 
 * @param {number[][]} triangle The triangle to be analyzed
 * @returns The minimum path sum for the triangle
 */
export function minTrianglePath(triangle) {
	for (let row = triangle.length - 2; row >= 0; row--) {
		for (let column = 0; column < triangle[row].length; column++) {
			if (triangle[row + 1][column] < triangle[row + 1][column + 1]) {
				triangle[row][column] += triangle[row + 1][column];
			}
			else {
				triangle[row][column] += triangle[row + 1][column + 1];
			}
		}
	}

	return triangle[0][0];
}

/**
 * Solver function for Shortest Path in a Grid.
 * 
 * @param {number[][]} grid The grid to be traversed.
 * @returns One of the shortest paths to the bottom right, or a blank string if none exists.
 */
export function shortestPath(grid) {
	var distance = Array.from(Array(grid.length), () => Array(grid[0].length).fill(Infinity));
	distance[0][0] = 0;
	var path = Array.from(Array(grid.length), () => Array(grid[0].length).fill(""));;
	var unvisited = [];
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[0].length; j++) {
			if (grid[i][j] == 0) {
				unvisited.push([i, j]);
			}
		}
	}

	while (unvisited.length > 0) {
		var minDistance = Infinity;
		var minIndex = -1;
		for (let i = 0; i < unvisited.length; i++) {
			if (unvisited[i] == null) {
				continue;
			}
			if (distance[unvisited[i][0]][unvisited[i][1]] < minDistance) {
				minDistance = distance[unvisited[i][0]][unvisited[i][1]];
				minIndex = i;
			}
		}
	
		if (minDistance == Infinity || minIndex == -1) {
			break;
		}

		const i = unvisited[minIndex][0];
		const j = unvisited[minIndex][1];
		unvisited[minIndex] = null;

		if (i == grid.length - 1 && j == grid[0].length - 1) {
			break;
		}

		for (let k = 0; k < unvisited.length; k++) {
			if (unvisited[k] == null) {
				continue;
			}
			const thisI = unvisited[k][0];
			const thisJ = unvisited[k][1];

			if (thisI == i - 1 && thisJ == j && distance[thisI][thisJ] > minDistance + 1) {
				distance[thisI][thisJ] = minDistance + 1;
				path[thisI][thisJ] = path[i][j] + "U";
			}
			if (thisI == i + 1 && thisJ == j && distance[thisI][thisJ] > minDistance + 1) {
				distance[thisI][thisJ] = minDistance + 1;
				path[thisI][thisJ] = path[i][j] + "D";
			}
			if (thisI == i && thisJ == j - 1 && distance[thisI][thisJ] > minDistance + 1) {
				distance[thisI][thisJ] = minDistance + 1;
				path[thisI][thisJ] = path[i][j] + "L";
			}
			if (thisI == i && thisJ == j + 1 && distance[thisI][thisJ] > minDistance + 1) {
				distance[thisI][thisJ] = minDistance + 1;
				path[thisI][thisJ] = path[i][j] + "R";
			}
		}
	}

	return path[grid.length - 1][grid[0].length - 1];
}

/**
 * Solver for the HammingCodes: Integer to encoded Binary contract.
 * 
 * @param {number} n The number to be encoded.
 * @returns A string containing the extended, even-parity encoding of n.
 */
export function hammingEncode(n) {
	const nBits = Array.from(n.toString(2)).map((x) => parseInt(x));

	var bitString = [0]; //Initialize with overall parity bit
	var nextPower = 1;
	var bitsIndex = 0;
	var parityBits = [];
	var parity = [];
	
	//Generate bit string with parity bits set to 0
	while (bitsIndex < nBits.length) {
		if (bitString.length == nextPower) {
			bitString.push(0);
			parity.push(0);
			parityBits.push(nextPower);
			nextPower <<= 1;
		}
		else {
			bitString.push(nBits[bitsIndex]);
			bitsIndex++;
		}
	}

	//Calculate parities
	for (let i = 0; i < bitString.length; i++) {
		for (let j = 0; j < parityBits.length; j++) {
			if ((i & parityBits[j]) != 0) {
				parity[j] ^= bitString[i];
			}
		}
	}

	//Fix any odd parity
	for (let i = 0; i < parity.length; i++) {
		if (parity[i] == 1) {
			bitString[parityBits[i]] = 1;
		}
	}

	//Calculate overall parity and fix if needed
	var overallParity = 0;
	bitString.forEach((x) => {overallParity ^= x});

	if (overallParity == 1) {
		bitString[0] = 1;
	}

	//Spit out bit string
	var binaryString = "";
	bitString.forEach((x) => {binaryString += x});

	return binaryString;
}

/**
 * Solver for HammingCodes: Encoded Binary to Integer contracts.
 * 
 * @param {string} bitString The bitstring to decode
 * @returns The value encoded in the string, as a string
 */
export function hammingDecode(bitString) {
	var bits = Array.from(bitString).map((x) => parseInt(x));

	//Compute parity bits
	var k = 1;
	var parityBits = [];
	var parity = [];
	while (k < bitString.length) {
		parityBits.push(k);
		parity.push(0);
		k <<= 1;
	}

	//Compute parities
	for (let i = 0; i < bits.length; i++) {
		for (let j = 0; j < parityBits.length; j++) {
			if ((i & parityBits[j]) != 0) {
				parity[j] ^= bits[i];
			}
		}
	}

	//Correct incorrect bit, if any
	var correctionIndex = 0;
	for (let i = 0; i < parityBits.length; i++) {
		if (parity[i] != 0) {
			correctionIndex += parityBits[i];
		}
	}
	if (correctionIndex != 0) {
		bits[correctionIndex] ^= 1;
	}

	var dataBits = "";
	for (let i = 1; i < bits.length; i++) {
		if (!parityBits.includes(i)) {
			dataBits += bits[i];
		}
	}

	return "" + parseInt(dataBits, 2);
}