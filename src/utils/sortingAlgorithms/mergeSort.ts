import { SortingStep } from "./types";

/**
 * Merge Sort implementation as a generator function
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */
export function* mergeSort(inputArray: number[]): Generator<SortingStep, SortingStep, void> {
  // Create a copy of the input array to avoid modifying the original
  const array = [...inputArray];
  const n = array.length;
  
  // Track metrics
  let comparisons = 0;
  let swaps = 0;
  
  // Track sorted indices
  const sortedIndices: number[] = [];
  
  // Helper function to merge two sorted subarrays
  function* merge(
    start: number,
    mid: number,
    end: number
  ): Generator<SortingStep, void, void> {
    const leftSize = mid - start + 1;
    const rightSize = end - mid;
    
    // Create temporary arrays
    const leftArray = array.slice(start, mid + 1);
    const rightArray = array.slice(mid + 1, end + 1);
    
    let i = 0; // Index for leftArray
    let j = 0; // Index for rightArray
    let k = start; // Index for the merged array
    
    // Merge the two subarrays
    while (i < leftSize && j < rightSize) {
      comparisons++;
      
      // Yield the current state with comparing indices
      yield {
        array: [...array],
        comparingIndices: [start + i, mid + 1 + j],
        swappedIndices: [],
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps
      };
      
      if (leftArray[i] <= rightArray[j]) {
        array[k] = leftArray[i];
        i++;
      } else {
        array[k] = rightArray[j];
        j++;
      }
      
      swaps++;
      
      // Yield the current state with the updated array
      yield {
        array: [...array],
        comparingIndices: [],
        swappedIndices: [k],
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps
      };
      
      k++;
    }
    
    // Copy any remaining elements from the left subarray
    while (i < leftSize) {
      array[k] = leftArray[i];
      i++;
      k++;
      swaps++;
      
      // Yield the current state with the updated array
      yield {
        array: [...array],
        comparingIndices: [],
        swappedIndices: [k - 1],
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps
      };
    }
    
    // Copy any remaining elements from the right subarray
    while (j < rightSize) {
      array[k] = rightArray[j];
      j++;
      k++;
      swaps++;
      
      // Yield the current state with the updated array
      yield {
        array: [...array],
        comparingIndices: [],
        swappedIndices: [k - 1],
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps
      };
    }
    
    // Mark the merged subarray as sorted
    for (let idx = start; idx <= end; idx++) {
      if (!sortedIndices.includes(idx)) {
        sortedIndices.push(idx);
      }
    }
  }
  
  // Helper function to recursively sort the array
  function* mergeSortHelper(
    start: number,
    end: number
  ): Generator<SortingStep, void, void> {
    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      
      // Sort the left half
      yield* mergeSortHelper(start, mid);
      
      // Sort the right half
      yield* mergeSortHelper(mid + 1, end);
      
      // Merge the sorted halves
      yield* merge(start, mid, end);
    } else if (start === end) {
      // A single element is already sorted
      if (!sortedIndices.includes(start)) {
        sortedIndices.push(start);
      }
    }
  }
  
  // Start the merge sort process
  yield* mergeSortHelper(0, n - 1);
  
  // Sort the sorted indices array
  sortedIndices.sort((a, b) => a - b);
  
  // Return the final state
  return {
    array,
    comparingIndices: [],
    swappedIndices: [],
    sortedIndices,
    comparisons,
    swaps
  };
}
