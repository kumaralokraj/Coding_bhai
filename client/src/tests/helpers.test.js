import {
  debounce,
  throttle,
  deepClone,
  mergeObjects,
  generateId,
  sortBy,
  groupBy,
  unique,
} from "../utils/helpers.js";

describe("Helpers Tests", () => {
  describe("debounce", () => {
    test("should debounce function calls", (done) => {
      let callCount = 0;
      const debouncedFunc = debounce(() => {
        callCount++;
      }, 100);

      debouncedFunc();
      debouncedFunc();
      debouncedFunc();

      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 150);
    });
  });

  describe("throttle", () => {
    test("should throttle function calls", (done) => {
      let callCount = 0;
      const throttledFunc = throttle(() => {
        callCount++;
      }, 100);

      throttledFunc();
      throttledFunc();
      throttledFunc();

      expect(callCount).toBe(1);

      setTimeout(() => {
        throttledFunc();
        expect(callCount).toBe(2);
        done();
      }, 150);
    });
  });

  describe("deepClone", () => {
    test("should deep clone objects", () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });
  });

  describe("mergeObjects", () => {
    test("should merge multiple objects", () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { c: 3 };
      const obj3 = { d: 4 };

      const merged = mergeObjects(obj1, obj2, obj3);
      expect(merged).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });

    test("should handle nested objects", () => {
      const obj1 = { a: { x: 1 } };
      const obj2 = { a: { y: 2 } };

      const merged = mergeObjects(obj1, obj2);
      expect(merged.a).toEqual({ x: 1, y: 2 });
    });
  });

  describe("generateId", () => {
    test("should generate unique IDs", () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
    });
  });

  describe("sortBy", () => {
    test("should sort array of objects by key", () => {
      const data = [
        { name: "Charlie", age: 30 },
        { name: "Alice", age: 25 },
        { name: "Bob", age: 35 },
      ];

      const sorted = sortBy(data, "name");
      expect(sorted[0].name).toBe("Alice");
      expect(sorted[1].name).toBe("Bob");
      expect(sorted[2].name).toBe("Charlie");
    });

    test("should sort in descending order", () => {
      const data = [{ age: 25 }, { age: 35 }, { age: 30 }];
      const sorted = sortBy(data, "age", "desc");
      expect(sorted[0].age).toBe(35);
      expect(sorted[2].age).toBe(25);
    });
  });

  describe("groupBy", () => {
    test("should group array elements by key", () => {
      const data = [
        { type: "A", value: 1 },
        { type: "B", value: 2 },
        { type: "A", value: 3 },
      ];

      const grouped = groupBy(data, "type");
      expect(grouped.A).toHaveLength(2);
      expect(grouped.B).toHaveLength(1);
    });
  });

  describe("unique", () => {
    test("should remove duplicate primitive values", () => {
      const array = [1, 2, 2, 3, 3, 3];
      const unique_array = unique(array);
      expect(unique_array).toEqual([1, 2, 3]);
    });

    test("should remove duplicate objects by key", () => {
      const array = [
        { id: 1, name: "A" },
        { id: 2, name: "B" },
        { id: 1, name: "A" },
      ];

      const unique_array = unique(array, "id");
      expect(unique_array).toHaveLength(2);
    });
  });
});
