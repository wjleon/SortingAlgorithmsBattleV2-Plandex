import { SortingStep } from "./types";

/**
 * Heap Sort implementation as a generator function
 * Time Complexity: O(n log n)
 * Space Complexity: O(1)
 */
export function* heapSort(inputArray: number[]): Generator<SortingStep, SortingStep, void> {
  // Create a copy of the input array to avoid modifying the original
  const array = [...inputArray];
  const n = array.length;
  
  // Track metrics
  let comparisons = 0;
  let swaps = 0;
  
  // Track sorted indices
  const sortedIndices: number[] = [];
  
  // Helper function to heapify a subtree rooted at index i
  function* heapify(
    size: number,
    i: number
  ): Generator<SortingStep, void, void> {
    let largest = i; // Initialize largest as root
    const left = 2 * i + 1; // Left child
    const right = 2 * i + 2; // Right child
    
    // Check if left child is larger than root
    if (left < size) {
      comparisons++;
      
      // Yield the current state with comparing indices
      yield {
        array: [...array],
        comparingIndices: [largest, left],
        swappedIndices: [],
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps
      };
      
      if (array[left] > array[largest]) {
        largest = left;
      }
    }
    
    // Check if right child is larger than the largest so far
    if (right < size) {
      comparisons++;
      
      // Yield the current state with comparing indices
      yield {
        array: [...array],
        comparingIndices: [largest, right],
        swappedIndices: [],
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps
      };
      
      if (array[right] > array[largest]) {
        largest = right;
      }
    }
    
    // If the largest is not the root
    if (largest !== i) {
      // Swap elements
      [array[i], array[largest]] = [array[largest], array[i]];
      swaps++;
      
      // Yield the current state with swapped indices
      yield {
        array: [...array],
        comparingIndices: [],
        swappedIndices: [i, largest],
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps
      };
      
      // Recursively heapify the affected subtree
      yield* heapify(size, largest);
    }
  }
  
  // Build a max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }
  
  // Extract elements from the heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move the current root to the end
    [array[0], array[i]] = [array[i], array[0]];
    swaps++;
    
    // Yield the current state with swapped indices
    yield {
      array: [...array],
      comparingIndices: [],
      swappedIndices: [0, i],
      sortedIndices: [...sortedIndices],
      comparisons,
      swaps
    };
    
    // The element at index i is now in its correct position
    sortedIndices.push(i);
    
    // Call heapify on the reduced heap
    yield* heapify(i, 0);
  }
  
  // The first element is also sorted
  sortedIndices.push(0);
  
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
