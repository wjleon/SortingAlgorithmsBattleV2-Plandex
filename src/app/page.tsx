
"use client";

import { useEffect, useCallback, useState } from "react";

import Layout from "@/components/Layout";
import ConfigurationPanel from "@/components/ConfigurationPanel";
import VisualizationPanel from "@/components/VisualizationPanel";
import BarVisualization from "@/components/BarVisualization";
import useAppState from "@/hooks/useAppState";
import useSortingAnimation from "@/hooks/useSortingAnimation";
import { isAudioSupported, resumeAudioContext } from "@/utils/audioFeedback";

// Audio support warning component
const AudioSupportWarning = () => {
  const [showWarning, setShowWarning] = useState(false);
  
  useEffect(() => {
    // Check if audio is supported
    const supported = isAudioSupported();
    setShowWarning(!supported);
  }, []); // Empty dependency array as this only needs to run once
  
  if (!showWarning) return null;
  
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
      <p className="font-medium">Audio Not Supported</p>
      <p className="text-sm">
        Your browser does not support the Web Audio API. Audio feedback will be disabled.
      </p>
    </div>
  );

};

// Resource error logger component
const ResourceErrorLogger = () => {
  useEffect(() => {
    const handleError = (event: ErrorEvent | Event) => {
      if (event instanceof ErrorEvent) {
        console.error('JavaScript error:', event.message, event.error);
      } else {
        const target = event.target as HTMLElement;
        if (target) {
          if (target instanceof HTMLImageElement || target instanceof HTMLScriptElement) {
            console.error('Resource failed to load:', target.src);
          } else if (target instanceof HTMLLinkElement) {
            console.error('Resource failed to load:', target.href);
          }
        }
      }
    };

    // Listen for error events
    window.addEventListener('error', handleError, true);

    return () => {
      window.removeEventListener('error', handleError, true);
    };
  }, []);

  return null;
};


export default function Home() {
  // Get app state and actions
  const { state, actions } = useAppState();
  
  // Left panel sorting animation
  const leftAnimation = useSortingAnimation(
    state.initialArray,
    state.algorithm1.name,
    {
      animationSpeed: state.animationSpeed,
      isRunning: state.isRunning,
      isPaused: state.isPaused,
      isSoundEnabled: state.isSoundEnabled,
      algorithm1: state.algorithm1.name,
      algorithm2: state.algorithm2.name,
      elementCount: state.elementCount,
      distribution: state.distribution,
    },
    () => actions.completeAlgorithm1Sorting()
  );
  
  // Right panel sorting animation
  const rightAnimation = useSortingAnimation(
    state.initialArray,
    state.algorithm2.name,
    {
      animationSpeed: state.animationSpeed,
      isRunning: state.isRunning,
      isPaused: state.isPaused,
      isSoundEnabled: state.isSoundEnabled,
      algorithm1: state.algorithm1.name,
      algorithm2: state.algorithm2.name,
      elementCount: state.elementCount,
      distribution: state.distribution,
    },
    () => actions.completeAlgorithm2Sorting()
  );
  
  // Update algorithm states in the global state
  useEffect(() => {
    // Skip updates if animations aren't running
    if (!state.isRunning && !leftAnimation.state.comparingIndices.length && !rightAnimation.state.comparingIndices.length) {
      return;
    }
    
    // Use requestAnimationFrame to limit updates and prevent infinite loops
    const animationFrameId = requestAnimationFrame(() => {
      if (leftAnimation.state && rightAnimation.state) {
        actions.updateAlgorithm1({
          array: leftAnimation.state.array,
          comparingIndices: leftAnimation.state.comparingIndices,
          swappedIndices: leftAnimation.state.swappedIndices,
          sortedIndices: leftAnimation.state.sortedIndices,
          comparisons: leftAnimation.state.comparisons,
          swaps: leftAnimation.state.swaps,
          timeElapsed: leftAnimation.state.timeElapsed,
        });
        
        actions.updateAlgorithm2({
          array: rightAnimation.state.array,
          comparingIndices: rightAnimation.state.comparingIndices,
          swappedIndices: rightAnimation.state.swappedIndices,
          sortedIndices: rightAnimation.state.sortedIndices,
          comparisons: rightAnimation.state.comparisons,
          swaps: rightAnimation.state.swaps,
          timeElapsed: rightAnimation.state.timeElapsed,
        });
      }
    });
    
    // Clean up the animation frame
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    leftAnimation.state,
    rightAnimation.state,
    actions,
    state.isRunning
  ]);
  
  // Handle global control actions

  const handleStart = useCallback(() => {
    // Initialize audio if sound is enabled
    // This is a user interaction, so it's safe to initialize audio
    if (state.isSoundEnabled) {
      leftAnimation.initializeAudio();
      rightAnimation.initializeAudio();
    }
    
    actions.start();
    
    // Start animations
    leftAnimation.controller[1].start();
    rightAnimation.controller[1].start();
  }, [
    actions,
    leftAnimation.controller,
    rightAnimation.controller,
    state.isSoundEnabled,
    leftAnimation.initializeAudio,
    rightAnimation.initializeAudio
  ]);

  
  const handlePause = useCallback(() => {
    actions.pause();
  }, [actions]);
  
  // Handle reset
  const handleReset = useCallback(() => {
    actions.reset();
    
    // Reset animations
    leftAnimation.controller[1].reset();
    rightAnimation.controller[1].reset();
  }, [actions, leftAnimation.controller, rightAnimation.controller]);
  
  // Handle audio toggle
  const handleAudioToggle = useCallback(() => {
    // Initialize audio context if enabling sound
    // This is a user interaction, so it's safe to initialize audio
    if (!state.isSoundEnabled) {
      leftAnimation.initializeAudio();
      rightAnimation.initializeAudio();
    }
    
    actions.toggleSoundEnabled();
  }, [actions, state.isSoundEnabled, leftAnimation, rightAnimation]);
  
  // Check if both algorithms are complete
  useEffect(() => {
    if (state.algorithm1.isComplete && state.algorithm2.isComplete) {
      // Auto-reset after a delay
      const timer = setTimeout(() => {
        actions.reset();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [state.algorithm1.isComplete, state.algorithm2.isComplete, actions]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ResourceErrorLogger />
      
      <h1 className="text-3xl font-bold text-center mb-8">
        Sorting Algorithm Visualizer
      </h1>
      
      <AudioSupportWarning />
      
      <Layout
        configPanel={
          <ConfigurationPanel 
            config={{
              algorithm1: state.algorithm1.name,
              algorithm2: state.algorithm2.name,
              elementCount: state.elementCount,
              distribution: state.distribution,
              isSoundEnabled: state.isSoundEnabled,
              animationSpeed: state.animationSpeed,
              isRunning: state.isRunning,
              isPaused: state.isPaused,
            }}
            actions={{
              setAlgorithm1: actions.setAlgorithm1Name,
              setAlgorithm2: actions.setAlgorithm2Name,
              setElementCount: actions.updateElementCount,
              setDistribution: actions.updateDistribution,
              toggleSound: handleAudioToggle,
              setAnimationSpeed: actions.updateAnimationSpeed,
              startSorting: handleStart,
              pauseSorting: handlePause,
              resetSorting: handleReset,
            }}
          />
        }
        leftPanel={
          <VisualizationPanel
            algorithmName={state.algorithm1.name}
            elementCount={state.elementCount}
            comparisons={state.algorithm1.comparisons}
            timeElapsed={state.algorithm1.timeElapsed}
            isComplete={state.algorithm1.isComplete}
            isLoading={leftAnimation.isLoading}
            error={leftAnimation.error}
          >
            <BarVisualization
              values={state.algorithm1.array}
              comparingIndices={state.algorithm1.comparingIndices}
              swappedIndices={state.algorithm1.swappedIndices}
              sortedIndices={state.algorithm1.sortedIndices}
              isLoading={leftAnimation.isLoading}
            />
          </VisualizationPanel>
        }
        rightPanel={
          <VisualizationPanel
            algorithmName={state.algorithm2.name}
            elementCount={state.elementCount}
            comparisons={state.algorithm2.comparisons}
            timeElapsed={state.algorithm2.timeElapsed}
            isComplete={state.algorithm2.isComplete}
            isLoading={rightAnimation.isLoading}
            error={rightAnimation.error}
          >
            <BarVisualization
              values={state.algorithm2.array}
              comparingIndices={state.algorithm2.comparingIndices}
              swappedIndices={state.algorithm2.swappedIndices}
              sortedIndices={state.algorithm2.sortedIndices}
              isLoading={rightAnimation.isLoading}
            />
          </VisualizationPanel>
        }
      />
    </div>
  );
}
