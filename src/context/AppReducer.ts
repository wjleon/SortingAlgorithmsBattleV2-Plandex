import { AppState, AppAction, ActionType, AlgorithmState } from './types';
import { generateArray } from '@/utils/arrayGenerators';

// Create initial algorithm state
const createInitialAlgorithmState = (name: string): AlgorithmState => ({
  name,
  array: [],
  comparingIndices: [],
  swappedIndices: [],
  sortedIndices: [],
  comparisons: 0,
  swaps: 0,
  timeElapsed: 0,
  isComplete: false,
});

// Initial application state
export const initialState: AppState = {
  algorithm1: createInitialAlgorithmState('Bubble Sort'),
  algorithm2: createInitialAlgorithmState('Quick Sort'),
  elementCount: 30,
  distribution: 'random',
  isSoundEnabled: true,
  animationSpeed: 5,
  isRunning: false,
  isPaused: false,
  initialArray: generateArray(30, 'random'),
};

// Reducer function
export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case ActionType.SET_ALGORITHM_1:
      return {
        ...state,
        algorithm1: {
          ...createInitialAlgorithmState(action.payload),
          array: [...state.initialArray],
        },
      };

    case ActionType.SET_ALGORITHM_2:
      return {
        ...state,
        algorithm2: {
          ...createInitialAlgorithmState(action.payload),
          array: [...state.initialArray],
        },
      };

    case ActionType.SET_ELEMENT_COUNT: {
      // Validate element count (between 10 and 200)
      const elementCount = Math.max(10, Math.min(200, action.payload));
      const newArray = generateArray(elementCount, state.distribution);
      
      return {
        ...state,
        elementCount,
        initialArray: newArray,
        algorithm1: {
          ...createInitialAlgorithmState(state.algorithm1.name),
          array: [...newArray],
        },
        algorithm2: {
          ...createInitialAlgorithmState(state.algorithm2.name),
          array: [...newArray],
        },
      };
    }

    case ActionType.SET_DISTRIBUTION: {
      const newArray = generateArray(state.elementCount, action.payload);
      
      return {
        ...state,
        distribution: action.payload,
        initialArray: newArray,
        algorithm1: {
          ...createInitialAlgorithmState(state.algorithm1.name),
          array: [...newArray],
        },
        algorithm2: {
          ...createInitialAlgorithmState(state.algorithm2.name),
          array: [...newArray],
        },
      };
    }

    case ActionType.TOGGLE_SOUND:
      return {
        ...state,
        isSoundEnabled: !state.isSoundEnabled,
      };

    case ActionType.SET_ANIMATION_SPEED:
      // Validate animation speed (between 1 and 10)
      return {
        ...state,
        animationSpeed: Math.max(1, Math.min(10, action.payload)),
      };

    case ActionType.START_SORTING:
      return {
        ...state,
        isRunning: true,
        isPaused: false,
      };

    case ActionType.PAUSE_SORTING:
      return {
        ...state,
        isPaused: true,
      };

    case ActionType.RESET_SORTING: {
      // Reset to initial state but keep configuration
      return {
        ...state,
        isRunning: false,
        isPaused: false,
        algorithm1: {
          ...createInitialAlgorithmState(state.algorithm1.name),
          array: [...state.initialArray],
        },
        algorithm2: {
          ...createInitialAlgorithmState(state.algorithm2.name),
          array: [...state.initialArray],
        },
      };
    }

    case ActionType.UPDATE_ALGORITHM_1_STATE:
      return {
        ...state,
        algorithm1: {
          ...state.algorithm1,
          ...action.payload,
        },
      };

    case ActionType.UPDATE_ALGORITHM_2_STATE:
      return {
        ...state,
        algorithm2: {
          ...state.algorithm2,
          ...action.payload,
        },
      };

    case ActionType.COMPLETE_ALGORITHM_1:
      return {
        ...state,
        algorithm1: {
          ...state.algorithm1,
          isComplete: true,
          sortedIndices: Array.from({ length: state.initialArray.length }, (_, i) => i),
        },
      };

    case ActionType.COMPLETE_ALGORITHM_2:
      return {
        ...state,
        algorithm2: {
          ...state.algorithm2,
          isComplete: true,
          sortedIndices: Array.from({ length: state.initialArray.length }, (_, i) => i),
        },
      };

    case ActionType.GENERATE_NEW_ARRAY:
      return {
        ...state,
        initialArray: action.payload,
        algorithm1: {
          ...createInitialAlgorithmState(state.algorithm1.name),
          array: [...action.payload],
        },
        algorithm2: {
          ...createInitialAlgorithmState(state.algorithm2.name),
          array: [...action.payload],
        },
      };

    default:
      return state;
  }
};
