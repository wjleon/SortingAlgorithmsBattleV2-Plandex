/**
 * Utility functions for generating arrays with different distributions
 */

/**
 * Generate an array based on the specified distribution
 */
export const generateArray = (
  count: number,
  distribution: string
): number[] => {
  // Create an array of sequential numbers from 1 to count
  const array = Array.from({ length: count }, (_, i) => i + 1);

  switch (distribution) {
    case "random":
      // Fisher-Yates shuffle algorithm
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;

    case "ascending":
      // Already in ascending order
      return array;

    case "descending":
      // Reverse to get descending order
      return array.reverse();

    case "split-ascending":
      // Split in two halves, each in ascending order
      const halfIndex = Math.floor(count / 2);
      const firstHalf = array.slice(0, halfIndex);
      const secondHalf = array.slice(halfIndex).map(
        (val) => val - halfIndex + count / 2
      );
      return [...secondHalf, ...firstHalf];

    case "split-descending":
      // Split in two halves, each in descending order
      const midIndex = Math.floor(count / 2);
      const firstHalfDesc = array.slice(0, midIndex).reverse();
      const secondHalfDesc = array.slice(midIndex).reverse().map(
        (val) => val - midIndex + count / 2
      );
      return [...secondHalfDesc, ...firstHalfDesc];

    case "nearly-sorted":
      // Mostly sorted with a few elements out of place
      const nearlySorted = [...array];
      const swapCount = Math.max(1, Math.floor(count * 0.1)); // Swap about 10% of elements
      for (let i = 0; i < swapCount; i++) {
        const idx1 = Math.floor(Math.random() * count);
        const idx2 = Math.floor(Math.random() * count);
        [nearlySorted[idx1], nearlySorted[idx2]] = [
          nearlySorted[idx2],
          nearlySorted[idx1],
        ];
      }
      return nearlySorted;

    case "few-unique":
      // Array with few unique values (good for counting sort)
      const uniqueValues = Math.max(2, Math.min(10, Math.floor(count / 10)));
      return Array.from({ length: count }, () =>
        Math.floor(Math.random() * uniqueValues) + 1
      );

    default:
      return array;
  }
};

/**
 * Generate a random array of numbers
 */
export const generateRandomArray = (count: number): number[] => {
  return generateArray(count, "random");
};

/**
 * Generate an array sorted in ascending order
 */
export const generateAscendingArray = (count: number): number[] => {
  return generateArray(count, "ascending");
};

/**
 * Generate an array sorted in descending order
 */
export const generateDescendingArray = (count: number): number[] => {
  return generateArray(count, "descending");
};

/**
 * Generate an array split in two halves, each in ascending order
 */
export const generateSplitAscendingArray = (count: number): number[] => {
  return generateArray(count, "split-ascending");
};

/**
 * Generate an array split in two halves, each in descending order
 */
export const generateSplitDescendingArray = (count: number): number[] => {
  return generateArray(count, "split-descending");
};

/**
 * Generate a nearly sorted array
 */
export const generateNearlySortedArray = (count: number): number[] => {
  return generateArray(count, "nearly-sorted");
};

/**
 * Generate an array with few unique values
 */
export const generateFewUniqueArray = (count: number): number[] => {
  return generateArray(count, "few-unique");
};
