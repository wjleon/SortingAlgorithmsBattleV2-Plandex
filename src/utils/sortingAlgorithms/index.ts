import { SortingAlgorithm } from "./types";
import { bubbleSort } from "./bubbleSort";
import { selectionSort } from "./selectionSort";
import { insertionSort } from "./insertionSort";
import { mergeSort } from "./mergeSort";
import { quickSort } from "./quickSort";
import { heapSort } from "./heapSort";

// Export all sorting algorithms
export * from "./types";
export * from "./bubbleSort";
export * from "./selectionSort";
export * from "./insertionSort";
export * from "./mergeSort";
export * from "./quickSort";
export * from "./heapSort";

// Create a map of algorithm names to their generator functions
export const SORTING_ALGORITHMS: Record<string, SortingAlgorithm> = {
  "Bubble Sort": {
    name: "Bubble Sort",
    generator: bubbleSort
  },
  "Selection Sort": {
    name: "Selection Sort",
    generator: selectionSort
  },
  "Insertion Sort": {
    name: "Insertion Sort",
    generator: insertionSort
  },
  "Merge Sort": {
    name: "Merge Sort",
    generator: mergeSort
  },
  "Quick Sort": {
    name: "Quick Sort",
    generator: quickSort
  },
  "Heap Sort": {
    name: "Heap Sort",
    generator: heapSort
  }
};

// Get a sorting algorithm by name
export const getSortingAlgorithm = (name: string): SortingAlgorithm => {
  return SORTING_ALGORITHMS[name] || SORTING_ALGORITHMS["Bubble Sort"];
};

// Get all available sorting algorithm names
export const getSortingAlgorithmNames = (): string[] => {
  return Object.keys(SORTING_ALGORITHMS);
};
