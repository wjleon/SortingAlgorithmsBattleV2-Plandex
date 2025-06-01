import { useState, useEffect, useMemo } from "react";
import { Distribution } from "@/hooks/useConfiguration";

/**
 * Hook to generate and manage array data for visualization
 */
const useArrayData = (
  elementCount: number,
  distribution: Distribution
): number[] => {
  const [array, setArray] = useState<number[]>([]);

  // Generate array based on distribution
  useEffect(() => {
    const newArray = generateArray(elementCount, distribution);
    setArray(newArray);
  }, [elementCount, distribution]);

  return array;
};

/**
 * Generate an array based on the specified distribution
 */
export const generateArray = (
  count: number,
  distribution: Distribution
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

export default useArrayData;
