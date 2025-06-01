
/**
 * Audio Feedback System using Web Audio API
 * Generates tones based on array values for sorting visualization
 */

// AudioContext singleton
let audioContext: AudioContext | null = null;

// Check if code is running in browser environment
const isBrowser = typeof window !== 'undefined';

// Flag to track if user has interacted with the page
let userHasInteracted = false;

// Get or create AudioContext - safely checks for browser environment and user interaction
const getAudioContext = (): AudioContext | null => {
  if (!isBrowser) return null;
  
  // Only create AudioContext if user has interacted with the page
  if (!audioContext && userHasInteracted) {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioContext = new AudioContextClass();
      }
    } catch (error) {
      console.error('Failed to create AudioContext:', error);
      return null;
    }
  }
  return audioContext;
};

// Check if Web Audio API is supported
export const isAudioSupported = (): boolean => {
  if (!isBrowser) return false;
  return !!(window.AudioContext || (window as any).webkitAudioContext);
};

// Create an oscillator node with the given frequency
const createOscillator = (
  context: AudioContext,
  frequency: number,
  type: OscillatorType = 'sine'
): OscillatorNode | null => {
  if (!context) return null;
  
  try {
    const oscillator = context.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    return oscillator;
  } catch (error) {
    console.error('Failed to create oscillator:', error);
    return null;
  }
};

// Create a gain node with the given gain value
const createGain = (context: AudioContext, gain: number): GainNode | null => {
  if (!context) return null;
  
  try {
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(gain, context.currentTime);
    return gainNode;
  } catch (error) {
    console.error('Failed to create gain node:', error);
    return null;
  }
};

/**
 * Play a tone based on the given value
 * @param value - The value to base the tone on (higher value = higher pitch)
 * @param maxValue - The maximum possible value (used for scaling)
 * @param duration - Duration of the tone in milliseconds
 * @param volume - Volume of the tone (0-1)
 */
export const playTone = (
  value: number,
  maxValue: number,
  duration: number = 100,
  volume: number = 0.1
): void => {
  if (!isBrowser || !isAudioSupported()) return;

  try {
    const context = getAudioContext();
    if (!context) return;
    
    // Map the value to a frequency between 220Hz (A3) and 880Hz (A5)
    // Higher values produce higher pitches
    const minFreq = 220;
    const maxFreq = 880;
    const normalizedValue = value / maxValue; // 0-1
    const frequency = minFreq + normalizedValue * (maxFreq - minFreq);
    
    // Create oscillator and gain nodes
    const oscillator = createOscillator(context, frequency, 'sine');
    if (!oscillator) return;
    
    const gainNode = createGain(context, volume);
    if (!gainNode) {
      oscillator.disconnect();
      return;
    }
    
    // Connect the nodes
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Start the oscillator
    oscillator.start();
    
    // Schedule the oscillator to stop after the duration
    oscillator.stop(context.currentTime + duration / 1000);
    
    // Ramp down the gain to avoid clicks
    gainNode.gain.exponentialRampToValueAtTime(
      0.001, // Near-zero value (can't be 0 for exponentialRamp)
      context.currentTime + duration / 1000
    );
    
    // Clean up when done
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  } catch (error) {
    console.error('Error playing audio tone:', error);
  }
};

/**
 * Play multiple tones based on an array of values
 * @param values - Array of values to play tones for
 * @param indices - Indices of values to play tones for (if not provided, plays for all values)
 * @param maxValue - The maximum possible value (used for scaling)
 * @param delay - Delay between tones in milliseconds
 */
export const playTones = (
  values: number[],
  indices: number[],
  maxValue: number,
  delay: number = 50
): void => {
  if (!isBrowser || !isAudioSupported() || indices.length === 0) return;
  
  // Play tones for each index with a delay
  indices.forEach((index, i) => {
    if (index >= 0 && index < values.length) {
      setTimeout(() => {
        playTone(values[index], maxValue);
      }, i * delay);
    }
  });
};

/**
 * Play a comparison sound for two values
 * @param values - The array of values
 * @param indices - The indices of the values being compared
 * @param maxValue - The maximum possible value
 */
export const playComparisonSound = (
  values: number[],
  indices: number[],
  maxValue: number
): void => {
  if (!isBrowser || !isAudioSupported() || indices.length < 2) return;
  
  playTones(values, indices, maxValue, 150);
};

/**
 * Play a swap sound for two values
 * @param values - The array of values
 * @param indices - The indices of the values being swapped
 * @param maxValue - The maximum possible value
 */
export const playSwapSound = (
  values: number[],
  indices: number[],
  maxValue: number
): void => {
  if (!isBrowser || !isAudioSupported() || indices.length < 2) return;
  
  // For swaps, play with a different oscillator type for distinction
  try {
    const context = getAudioContext();
    if (!context) return;
    
    indices.forEach((index, i) => {
      if (index >= 0 && index < values.length) {
        setTimeout(() => {
          const value = values[index];
          const normalizedValue = value / maxValue;
          const frequency = 220 + normalizedValue * (880 - 220);
          
          const oscillator = createOscillator(context, frequency, 'triangle');
          if (!oscillator) return;
          
          const gainNode = createGain(context, 0.15);
          if (!gainNode) {
            oscillator.disconnect();
            return;
          }
          
          oscillator.connect(gainNode);
          gainNode.connect(context.destination);
          
          oscillator.start();
          oscillator.stop(context.currentTime + 0.15);
          
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            context.currentTime + 0.15
          );
          
          oscillator.onended = () => {
            oscillator.disconnect();
            gainNode.disconnect();
          };
        }, i * 200);
      }
    });
  } catch (error) {
    console.error('Error playing swap sound:', error);
  }
};

/**
 * Play a completion sound
 */
export const playCompletionSound = (): void => {
  if (!isBrowser || !isAudioSupported()) return;
  
  try {
    const context = getAudioContext();
    if (!context) return;
    
    const now = context.currentTime;
    
    // Play a short ascending arpeggio
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    
    notes.forEach((freq, i) => {
      const oscillator = createOscillator(context, freq, 'sine');
      if (!oscillator) return;
      
      const gainNode = createGain(context, 0.2);
      if (!gainNode) {
        oscillator.disconnect();
        return;
      }
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.start(now + i * 0.15);
      oscillator.stop(now + i * 0.15 + 0.2);
      
      gainNode.gain.setValueAtTime(0.2, now + i * 0.15);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        now + i * 0.15 + 0.2
      );
      
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    });
  } catch (error) {
    console.error('Error playing completion sound:', error);
  }
};

/**
 * Resume the audio context if it's suspended
 * This should be called in response to a user interaction
 * to enable audio on browsers that require user gesture
 */
export const resumeAudioContext = async (): Promise<void> => {
  if (!isBrowser || !isAudioSupported()) return;
  
  // Set flag indicating user has interacted with the page
  userHasInteracted = true;
  
  try {
    // Get or create the AudioContext now that user has interacted
    const context = getAudioContext();
    
    // If context exists and is suspended, resume it
    if (context && context.state === 'suspended') {
      await context.resume();
    }
  } catch (error) {
    console.error('Error resuming audio context:', error);
  }
};

/**
 * Suspend the audio context to save resources
 */
export const suspendAudioContext = async (): Promise<void> => {
  if (!isBrowser || !audioContext) return;
  
  try {
    if (audioContext.state === 'running') {
      await audioContext.suspend();
    }
  } catch (error) {
    console.error('Error suspending audio context:', error);
  }
};
