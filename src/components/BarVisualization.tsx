
import React, { useMemo, useRef, useEffect, useState } from "react";
import { calculateOptimalChunkSize, isMobileDevice } from "@/utils/performance";
import LoadingState from "./LoadingState";

interface BarVisualizationProps {
  values: number[];
  maxValue?: number;
  comparingIndices: number[];
  swappedIndices: number[];
  sortedIndices: number[];
  isLoading?: boolean;
}

const BarVisualization: React.FC<BarVisualizationProps> = ({
  values,
  maxValue: propMaxValue,
  comparingIndices = [],
  swappedIndices = [],
  sortedIndices = [],
  isLoading = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  
  // Calculate the maximum value if not provided
  const maxValue = useMemo(() => {
    if (propMaxValue !== undefined) return propMaxValue;
    return Math.max(...values, 1); // Ensure we don't divide by zero
  }, [values, propMaxValue]);
  
  // Detect container size changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
        setContainerHeight(containerRef.current.clientHeight);
      }
    };
    
    // Initial size
    updateSize();
    
    // Set up ResizeObserver if supported
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(containerRef.current);
      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
      };
    } else {
      // Fallback to window resize event
      window.addEventListener('resize', updateSize);
      return () => {
        window.removeEventListener('resize', updateSize);
      };
    }
  }, []);
  
  // Optimize rendering for large arrays
  useEffect(() => {
    if (values.length > 100) {
      setIsRendering(true);
      const timer = setTimeout(() => {
        setIsRendering(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [values, comparingIndices, swappedIndices, sortedIndices]);
  
  // Calculate bar width based on number of elements and container width
  const barWidth = useMemo(() => {
    if (containerWidth === 0 || values.length === 0) return 2;
    
    // Ensure bars have some minimum width and spacing
    const minBarWidth = 2;
    const minSpacing = 1;
    
    // Calculate available width per bar including spacing
    const availableWidth = containerWidth / values.length;
    
    // Ensure we have at least the minimum width and spacing
    return Math.max(availableWidth - minSpacing, minBarWidth);
  }, [containerWidth, values.length]);
  
  // Calculate spacing between bars
  const barSpacing = useMemo(() => {
    if (containerWidth === 0 || values.length === 0) return 1;
    
    // For very large arrays, reduce spacing to minimum
    if (values.length > 100) return 0;
    
    // For smaller arrays, use proportional spacing
    return Math.max(1, containerWidth / values.length / 8);
  }, [containerWidth, values.length]);
  
  // Determine if we should use simplified rendering for mobile or large arrays
  const useSimplifiedRendering = useMemo(() => {
    return isMobileDevice() || values.length > 200;
  }, [values.length]);
  
  // Render loading state if data is loading
  if (isLoading) {
    return <LoadingState message="Generating array..." />;
  }
  
  // Render loading state while rendering large arrays
  if (isRendering) {
    return <LoadingState message="Rendering visualization..." />;
  }
  
  return (
    <div 
      ref={containerRef} 
      className="h-full flex items-end justify-around"
      aria-label={`Bar visualization with ${values.length} elements`}
    >
      {values.map((value, index) => {
        // Calculate height as percentage of container
        const height = `${(value / maxValue) * 100}%`;
        
        // Determine bar class based on state
        const isComparing = comparingIndices.includes(index);
        const isSwapped = swappedIndices.includes(index);
        const isSorted = sortedIndices.includes(index);
        
        let barClass = "visualization-bar";
        if (isComparing) barClass += " visualization-bar-comparing";
        if (isSwapped) barClass += " visualization-bar-swapped";
        if (isSorted) barClass += " visualization-bar-sorted";
        
        // Add animation classes for smaller arrays only
        if ((isComparing || isSwapped) && !useSimplifiedRendering) {
          barClass += " animate-pulse";
        }
        
        // Skip rendering bars that would be too small to see
        if (barWidth < 1 && !isComparing && !isSwapped) {
          // Only render every nth bar for very large arrays
          const skipFactor = Math.ceil(values.length / 200);
          if (index % skipFactor !== 0) {
            return null;
          }
        }
        
        return (
          <div
            key={index}
            className={barClass}
            style={{
              height,
              width: `${barWidth}px`,
              marginLeft: `${barSpacing}px`,
              marginRight: `${barSpacing}px`,
              transition: useSimplifiedRendering ? 'none' : 'height 0.3s ease, background-color 0.3s ease'
            }}
            title={`Value: ${value}`}
            aria-label={`Bar ${index + 1} with value ${value}`}
            data-index={index}
            data-value={value}
          />
        );
      })}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(BarVisualization);
