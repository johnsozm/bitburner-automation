import {strict as assert} from "assert";
import * as solver from "../bitburner-code/contract-scripts/script-solvers.js";

describe("Test Array Jump solver function", () => {
    it("Should return 0 for untraversable arrays", () => {
        assert.equal(solver.arrayJumpShortestPath([0, 1, 2, 3, 4, 5], 0, 0), 0);
        assert.equal(solver.arrayJumpShortestPath([1, 2, 0, 0, 0, 4], 0, 0), 0);
    });
    it("Should return the minimum path length for traversable arrays", () => {
        assert.equal(solver.arrayJumpShortestPath([1, 3, 1, 0, 2], 0, 0), 2);
        assert.equal(solver.arrayJumpShortestPath([3, 0, 1, 4, 5, 0, 0, 0, 0], 0, 0), 3);
    });
});

describe("Test Total Ways to Sum II solver function", () => {
    it("Should return 0 if there is no way to reach the given sum", () => {
        assert.equal(solver.countSums([3, 4, 6], 0, 0, 1), 0);
    });
    it("Should correctly count the ways to sum", () => {
        assert.equal(solver.countSums([1, 3, 5, 7], 0, 0, 12), 12);
        assert.equal(solver.countSums([1, 2, 4], 0, 0, 8), 9);
    });
});

describe("Test Generate IP Addesses solver function", () => {
    it("Should return an empty array if the string cannot be parsed as an IP", () => {
        assert.deepEqual(solver.findAllIPs("", "999999999999", 4), []);
    });
    it("Should give a list of IP's if any can be generated", () => {
        assert.deepEqual(solver.findAllIPs("", "1938718066", 4), ["193.87.180.66"]);
        assert.deepEqual(solver.findAllIPs("", "25525511135", 4), ["255.255.11.135", "255.255.111.35"]);
    });
});

describe("Test Largest Prime Factor solver function", () => {
    it("Should correctly handle illegal values", () => {
        assert.equal(solver.largestFactor(-12), 1);
        assert.equal(solver.largestFactor(1), 1);
        assert.equal(solver.largestFactor(3.2), 1);
    });
    it("Should correctly factor positive integers", () => {
        assert.equal(solver.largestFactor(256), 2);
        assert.equal(solver.largestFactor(48), 3);
        assert.equal(solver.largestFactor(65535), 257);
        assert.equal(solver.largestFactor(1248163264), 847937);
    });
});

describe("Test Subarray with Maximum Sum solver function", () => {
    it("Should correctly determine the maximum sum", () => {
        assert.equal(solver.maxSubarraySum([1, 2, 3, 4]), 10);
        assert.equal(solver.maxSubarraySum([-12, -13, -14, -100]), -12);
        assert.equal(solver.maxSubarraySum([1, 8, -5, -6, 8, -4, 8]), 12);
    });
});

describe("Test Merge Overlapping Intervals solver function", () => {
    it("Should correctly sort and merge intervals", () => {
        assert.deepEqual(solver.mergeIntervals([[1, 3], [7, 10], [2, 5]]), [[1, 5], [7, 10]]);
        assert.deepEqual(solver.mergeIntervals([[9, 12], [1, 2]]), [[1, 2], [9, 12]]);
        assert.deepEqual(solver.mergeIntervals([[9, 15], [1, 4], [13, 22], [29, 30], [3, 10], [20, 29]]), [[1, 30]])
    });
});

describe("Test Sanitize Parentheses in Expression solver function", () => {
    it("Should return an array containing a blank string if no valid expressions are possible", () => {
        assert.deepEqual(solver.sanitizeParens(")("), [""]);
    });
    it("Should return all possible sanitized expressions if any exist", () => {
        assert.deepEqual(solver.sanitizeParens("()())()"), ["(())()", "()()()"]);
    });
    it("Should keep non-paren characters in place", () => {
        assert.deepEqual(solver.sanitizeParens("(a)())()"), ["(a())()", "(a)()()"]);
    });
});

describe("Test Spiralize Matrix solver function", () => {
    it("Should correctly spiralize matrices", () => {
        assert.deepEqual(solver.spiralizeMatrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), [1, 2, 3, 6, 9, 8, 7, 4, 5]);
    });
    it("Should correctly handle non-square matrices", () => {
        assert.deepEqual(solver.spiralizeMatrix([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]), [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]);
    });
});

describe("Test Algorithmic Stock Trader I solver function", () => {
    it("Should return 0 if no profit can be made", () => {
        assert.equal(solver.stockTrader1([9, 8, 7, 6, 5]), 0);
    });
    it("Should return the maximum profit possible if any can be made", () => {
        assert.equal(solver.stockTrader1([122, 39, 76, 41, 99]), 60);
        assert.equal(solver.stockTrader1([120, 58, 52, 92, 97, 106, 140]), 88);
    });
});

describe("Test Algorithmic Stock Trader II solver function", () => {
    it("Should return 0 if no profit can be made", () => {
        assert.equal(solver.stockTrader2([9, 8, 7, 6, 5]), 0);
    });
    it("Should return the maximum profit possible if any can be made", () => {
        assert.equal(solver.stockTrader2([122, 39, 76, 41, 99]), 95);
        assert.equal(solver.stockTrader2([120, 58, 52, 92, 97, 106, 140]), 88);
        assert.equal(solver.stockTrader2([120, 58, 52, 98, 97, 106, 140]), 89);
    });
});

describe("Test Algorithmic Stock Trader III solver function", () => {
    it("Should return 0 if no profit can be made", () => {
        assert.equal(solver.stockTrader3([9, 8, 7, 6, 5]), 0);
    });
    it("Should return the maximum profit possible if any can be made", () => {
        assert.equal(solver.stockTrader3([122, 39, 76, 41, 99]), 95);
        assert.equal(solver.stockTrader3([120, 58, 52, 98, 97, 106, 140]), 89);
    });
    it("Should correctly detect when single-step gives more profit", () => {
        assert.equal(solver.stockTrader3([120, 58, 52, 92, 97, 106, 140]), 88);
    });
});

describe("Test Algorithmic Stock Trader IV solver function", () => {
    it("Should return 0 if no profit can be made", () => {
        assert.equal(solver.stockTrader4([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], 3), 0);
    });
    it("Should return the maximum profit possible if any can be made", () => {
        assert.equal(solver.stockTrader4([117, 132, 59, 62, 132, 131, 112, 110, 62, 93], 3), (132-117) + (132-59) + (93-62));
    })
});

describe("Test Total Ways to Sum solver function", () => {
    it("Should correctly compute the partition function", () => {
        assert.equal(solver.countSumPartitions(12), 76);
        assert.equal(solver.countSumPartitions(1), 0);
        assert.equal(solver.countSumPartitions(23), 1254);
        assert.equal(solver.countSumPartitions(150), 40853235312);
    });
});

describe("Test Unique Paths in a Grid solver function", () => {
    it("Should correctly compute the number of distinct paths", () => {
        assert.equal(solver.uniquePaths1(4, 6), 56);
        assert.equal(solver.uniquePaths1(16, 12), 7726160)
    });
});

describe("Test Unique Paths in a Grid II solver function", () => {
    it("Should return 0 for an impassable grid", () => {
        assert.equal(solver.uniquePaths2([[0, 1], [1, 0]], 0, 0), 0);
    });
    it("Should count all the possible paths for a passable grid", () => {
        assert.equal(solver.uniquePaths2([[0, 0, 0, 1], [0, 1, 0, 1], [0, 0, 0, 0], [1, 1, 0, 0]], 0, 0), 4);
    });
});

describe("Test Find All Valid Math Expressions solver function", () => {
    it("Should find all expressions that evaluate to the target", () => {
        assert.deepEqual(solver.validMathExpressions("123", 6), ["1+2+3", "1*2*3"]);
        assert.deepEqual(solver.validMathExpressions("105", 5), ["1*0+5", "10-5"]);
    });
});

describe("Test Minimum Path Sum in a Triangle solver function", () => {
    it("Should find the smallest path sum possible in a triangle", () => {
        assert.equal(solver.minTrianglePath([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]), 11);
        assert.equal(solver.minTrianglePath([[6], [4, 3], [3, 3, 1], [9, 8, 7, 7], [3, 5, 2, 7, 4], [9, 9, 7, 1, 9, 4], [5, 9, 9, 4, 2, 1, 5], [5, 9, 4 ,6, 3, 8, 2, 7]]), 25);
    });
});

describe("Test Shortest Path in a Grid solver", () => {
    it("Should return an empty string if there is no path", () => {
        assert.equal(solver.shortestPath([[0, 1], [1, 0]]), '');
    });
    it("Should return one of the shortest paths", () => {
        assert.equal(solver.shortestPath([[0,1,0,0,0],[0,0,0,1,0]]), "DRRURRD");
    });
});

describe("Test HammingCodes: Integer to encoded Binary solver", () => {
    it("Should generate the correct Hamming code", () => {
        assert.equal(solver.hammingEncode(8), "11110000");
        assert.equal(solver.hammingEncode(21), "1001101011");
    });
});

describe("Test HammingCodes: Encoded Binary to Integer solver", () => {
    it("Should correctly decode Hamming codes", () => {
        assert.equal(solver.hammingDecode("11110000"), "8");
        assert.equal(solver.hammingDecode("1001101011"), "21");
    });
    it("Should detect and correct single-bit errors", () => {
        assert.equal(solver.hammingDecode("11110100"), "8");
        assert.equal(solver.hammingDecode("1001100011"), "21");
    });
});
