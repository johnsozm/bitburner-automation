import {strict as assert} from "assert";
import * as solver from "../bitburner-code/contract-scripts/script-solvers.js";

describe("Test Array Jump solver script", () => {
    it("Should return 0 for untraversable arrays", () => {
        assert.equal(solver.array_jump_shortest_path([0, 1, 2, 3, 4, 5], 0, 0), 0);
        assert.equal(solver.array_jump_shortest_path([1, 2, 0, 0, 0, 4], 0, 0), 0);
    });
    it("Should return the minimum path length for traversable arrays", () => {
        assert.equal(solver.array_jump_shortest_path([1, 3, 1, 0, 2], 0, 0), 2);
        assert.equal(solver.array_jump_shortest_path([3, 0, 1, 4, 5, 0, 0, 0, 0], 0, 0), 3);
    });
});

describe("Test Total Ways to Sum II solver script", () => {
    it("Should return 0 if there is no way to reach the given sum", () => {
        assert.equal(solver.count_sums([3, 4, 6], 0, 0, 1), 0);
    })
    it("Should correctly count the ways to sum", () => {
        assert.equal(solver.count_sums([1, 3, 5, 7], 0, 0, 12), 12);
        assert.equal(solver.count_sums([1, 2, 4], 0, 0, 8), 9);
    });
});

describe("Test Generate IP Addesses solver script", () => {
    it("Should return an empty array if the string cannot be parsed as an IP", () => {
        assert.deepEqual(solver.find_all_ips("", "999999999999", 4), []);
    });
    it("Should give a list of IP's if any can be generated", () => {
        assert.deepEqual(solver.find_all_ips("", "1938718066", 4), ["193.87.180.66"]);
        assert.deepEqual(solver.find_all_ips("", "25525511135", 4), ["255.255.11.135", "255.255.111.35"]);
    });
});

describe("Test Largest Prime Factor solver script", () => {
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