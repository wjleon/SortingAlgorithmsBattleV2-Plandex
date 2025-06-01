import { Distribution } from '@/hooks/useConfiguration';
import { SortingStep } from '@/utils/sortingAlgorithms/types';

// Algorithm state
export interface AlgorithmState {
  name: string;
  array: number[];
  comparingIndices: number[];
  swappedIndices: number[];
  sortedIndices: number[];
  comparisons: number;
  swaps: number;
  timeElapsed: number;
  isComplete: boolean;
}

// Application state
export interface AppState {
  algorithm1: AlgorithmState;
  algorithm2: AlgorithmState;
  elementCount: number;
  distribution: Distribution;
  isSoundEnabled: boolean;
  animationSpeed: number;
  isRunning: boolean;
  isPaused: boolean;
  initialArray: number[];
}

// Action types
export enum ActionType {
  SET_ALGORITHM_1 = 'SET_ALGORITHM_1',
  SET_ALGORITHM_2 = 'SET_ALGORITHM_2',
  SET_ELEMENT_COUNT = 'SET_ELEMENT_COUNT',
  SET_DISTRIBUTION = 'SET_DISTRIBUTION',
  TOGGLE_SOUND = 'TOGGLE_SOUND',
  SET_ANIMATION_SPEED = 'SET_ANIMATION_SPEED',
  START_SORTING = 'START_SORTING',
  PAUSE_SORTING = 'PAUSE_SORTING',
  RESET_SORTING = 'RESET_SORTING',
  UPDATE_ALGORITHM_1_STATE = 'UPDATE_ALGORITHM_1_STATE',
  UPDATE_ALGORITHM_2_STATE = 'UPDATE_ALGORITHM_2_STATE',
  COMPLETE_ALGORITHM_1 = 'COMPLETE_ALGORITHM_1',
  COMPLETE_ALGORITHM_2 = 'COMPLETE_ALGORITHM_2',
  GENERATE_NEW_ARRAY = 'GENERATE_NEW_ARRAY',
}

// Action interfaces
interface SetAlgorithm1Action {
  type: ActionType.SET_ALGORITHM_1;
  payload: string;
}

interface SetAlgorithm2Action {
  type: ActionType.SET_ALGORITHM_2;
  payload: string;
}

interface SetElementCountAction {
  type: ActionType.SET_ELEMENT_COUNT;
  payload: number;
}

interface SetDistributionAction {
  type: ActionType.SET_DISTRIBUTION;
  payload: Distribution;
}

interface ToggleSoundAction {
  type: ActionType.TOGGLE_SOUND;
}

interface SetAnimationSpeedAction {
  type: ActionType.SET_ANIMATION_SPEED;
  payload: number;
}

interface StartSortingAction {
  type: ActionType.START_SORTING;
}

interface PauseSortingAction {
  type: ActionType.PAUSE_SORTING;
}

interface ResetSortingAction {
  type: ActionType.RESET_SORTING;
}

interface UpdateAlgorithm1StateAction {
  type: ActionType.UPDATE_ALGORITHM_1_STATE;
  payload: Partial<AlgorithmState>;
}

interface UpdateAlgorithm2StateAction {
  type: ActionType.UPDATE_ALGORITHM_2_STATE;
  payload: Partial<AlgorithmState>;
}

interface CompleteAlgorithm1Action {
  type: ActionType.COMPLETE_ALGORITHM_1;
}

interface CompleteAlgorithm2Action {
  type: ActionType.COMPLETE_ALGORITHM_2;
}

interface GenerateNewArrayAction {
  type: ActionType.GENERATE_NEW_ARRAY;
  payload: number[];
}

// Union of all actions
export type AppAction =
  | SetAlgorithm1Action
  | SetAlgorithm2Action
  | SetElementCountAction
  | SetDistributionAction
  | ToggleSoundAction
  | SetAnimationSpeedAction
  | StartSortingAction
  | PauseSortingAction
  | ResetSortingAction
  | UpdateAlgorithm1StateAction
  | UpdateAlgorithm2StateAction
  | CompleteAlgorithm1Action
  | CompleteAlgorithm2Action
  | GenerateNewArrayAction;

// Action creators
export const setAlgorithm1 = (algorithm: string): AppAction => ({
  type: ActionType.SET_ALGORITHM_1,
  payload: algorithm,
});

export const setAlgorithm2 = (algorithm: string): AppAction => ({
  type: ActionType.SET_ALGORITHM_2,
  payload: algorithm,
});

export const setElementCount = (count: number): AppAction => ({
  type: ActionType.SET_ELEMENT_COUNT,
  payload: count,
});

export const setDistribution = (distribution: Distribution): AppAction => ({
  type: ActionType.SET_DISTRIBUTION,
  payload: distribution,
});

export const toggleSound = (): AppAction => ({
  type: ActionType.TOGGLE_SOUND,
});

export const setAnimationSpeed = (speed: number): AppAction => ({
  type: ActionType.SET_ANIMATION_SPEED,
  payload: speed,
});

export const startSorting = (): AppAction => ({
  type: ActionType.START_SORTING,
});

export const pauseSorting = (): AppAction => ({
  type: ActionType.PAUSE_SORTING,
});

export const resetSorting = (): AppAction => ({
  type: ActionType.RESET_SORTING,
});

export const updateAlgorithm1State = (state: Partial<AlgorithmState>): AppAction => ({
  type: ActionType.UPDATE_ALGORITHM_1_STATE,
  payload: state,
});

export const updateAlgorithm2State = (state: Partial<AlgorithmState>): AppAction => ({
  type: ActionType.UPDATE_ALGORITHM_2_STATE,
  payload: state,
});

export const completeAlgorithm1 = (): AppAction => ({
  type: ActionType.COMPLETE_ALGORITHM_1,
});

export const completeAlgorithm2 = (): AppAction => ({
  type: ActionType.COMPLETE_ALGORITHM_2,
});

export const generateNewArray = (array: number[]): AppAction => ({
  type: ActionType.GENERATE_NEW_ARRAY,
  payload: array,
});
