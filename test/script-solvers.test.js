import {strict as assert} from "assert";
import { array_jump_shortest_path } from "../bitburner-code/contract-scripts/script-solvers.js";

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