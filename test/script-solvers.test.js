import {strict as assert} from "assert";
import * as solver from "../bitburner-code/contract-scripts/script-solvers.js";

describe("Test Array Jump solver function", () => {
    it("Should return 0 for untraversable arrays", () => {
        assert.equal(solver.array_jump_shortest_path([0, 1, 2, 3, 4, 5], 0, 0), 0);
        assert.equal(solver.array_jump_shortest_path([1, 2, 0, 0, 0, 4], 0, 0), 0);
    });
    it("Should return the minimum path length for traversable arrays", () => {
        assert.equal(solver.array_jump_shortest_path([1, 3, 1, 0, 2], 0, 0), 2);
        assert.equal(solver.array_jump_shortest_path([3, 0, 1, 4, 5, 0, 0, 0, 0], 0, 0), 3);
    });
});

describe("Test Total Ways to Sum II solver function", () => {
    it("Should return 0 if there is no way to reach the given sum", () => {
        assert.equal(solver.count_sums([3, 4, 6], 0, 0, 1), 0);
    })
    it("Should correctly count the ways to sum", () => {
        assert.equal(solver.count_sums([1, 3, 5, 7], 0, 0, 12), 12);
        assert.equal(solver.count_sums([1, 2, 4], 0, 0, 8), 9);
    });
});

describe("Test Generate IP Addesses solver function", () => {
    it("Should return an empty array if the string cannot be parsed as an IP", () => {
        assert.deepEqual(solver.find_all_ips("", "999999999999", 4), []);
    });
    it("Should give a list of IP's if any can be generated", () => {
        assert.deepEqual(solver.find_all_ips("", "1938718066", 4), ["193.87.180.66"]);
        assert.deepEqual(solver.find_all_ips("", "25525511135", 4), ["255.255.11.135", "255.255.111.35"]);
    });
});

describe("Test Largest Prime Factor solver function", () => {
    it("Should correctly handle illegal values", () => {
        assert.equal(solver.largest_factor(-12), 1);
        assert.equal(solver.largest_factor(1), 1);
        assert.equal(solver.largest_factor(3.2), 1);
    });
    it("Should correctly factor positive integers", () => {
        assert.equal(solver.largest_factor(256), 2);
        assert.equal(solver.largest_factor(48), 3);
        assert.equal(solver.largest_factor(65535), 257);
        assert.equal(solver.largest_factor(1248163264), 847937);
    });
});

describe("Test Subarray with Maximum Sum solver function", () => {
    it("Should correctly determine the maximum sum", () => {
        assert.equal(solver.max_subarray_sum([1, 2, 3, 4]), 10);
        assert.equal(solver.max_subarray_sum([-12, -13, -14, -100]), -12);
        assert.equal(solver.max_subarray_sum([1, 8, -5, -6, 8, -4, 8]), 12);
    });
});

describe("Test Merge Overlapping Intervals solver function", () => {
    it("Should correctly sort and merge intervals", () => {
        assert.deepEqual(solver.merge_intervals([[1, 3], [7, 10], [2, 5]]), [[1, 5], [7, 10]]);
        assert.deepEqual(solver.merge_intervals([[9, 12], [1, 2]]), [[1, 2], [9, 12]]);
        assert.deepEqual(solver.merge_intervals([[9, 15], [1, 4], [13, 22], [29, 30], [3, 10], [20, 29]]), [[1, 30]])
    });
});

describe("Test Sanitize Parentheses in Expression solver function", () => {
    it("Should return an array containing a blank string if no valid expressions are possible", () => {
        assert.deepEqual(solver.sanitize_parens(")("), [""]);
    });
    it("Should return all possible sanitized expressions if any exist", () => {
        assert.deepEqual(solver.sanitize_parens("()())()"), ["(())()", "()()()"]);
    });
    it("Should keep non-paren characters in place", () => {
        assert.deepEqual(solver.sanitize_parens("(a)())()"), ["(a())()", "(a)()()"]);
    })
});

describe("Test Spiralize Matrix solver function", () => {
    it("Should correctly spiralize matrices", () => {
        assert.deepEqual(solver.spiralize_matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), [1, 2, 3, 6, 9, 8, 7, 4, 5]);
    });
    it("Should correctly handle non-square matrices", () => {
        assert.deepEqual(solver.spiralize_matrix([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]), [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]);
    });
});

describe("Test Algorithmic Stock Trader I solver function", () => {
    it("Should return 0 if no profit can be made", () => {
        assert.equal(solver.stock_trader_1([9, 8, 7, 6, 5]), 0);
    });
    it("Should return the maximum profit possible if any can be made", () => {
        assert.equal(solver.stock_trader_1([122, 39, 76, 41, 99]), 60);
        assert.equal(solver.stock_trader_1([120, 58, 52, 92, 97, 106, 140]), 88);
    });
});