import {strict as assert} from "assert";
import { array_jump_shortest_path, count_sums } from "../bitburner-code/contract-scripts/script-solvers.js";

describe("Test Array Jump solver script", () => {
    it("Should return 0 for untraversable arrays", () => {
        assert.equal(array_jump_shortest_path([0, 1, 2, 3, 4, 5], 0, 0), 0);
        assert.equal(array_jump_shortest_path([1, 2, 0, 0, 0, 4], 0, 0), 0);
    });
    it("Should return the minimum path length for traversable arrays", () => {
        assert.equal(array_jump_shortest_path([1, 3, 1, 0, 2], 0, 0), 2);
        assert.equal(array_jump_shortest_path([3, 0, 1, 4, 5, 0, 0, 0, 0], 0, 0), 3);
    });
});

describe("Test Total Ways to Sum II solver script", () => {
    it("Should return 0 if there is no way to reach the given sum", () => {
        assert.equal(count_sums([3, 4, 6], 0, 0, 1), 0);
    })
    it("Should correctly count the ways to sum", () => {
        assert.equal(count_sums([1, 3, 5, 7], 0, 0, 12), 12);
        assert.equal(count_sums([1, 2, 4], 0, 0, 8), 9);
    });
})