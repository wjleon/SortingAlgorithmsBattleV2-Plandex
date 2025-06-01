import React from "react";
import { SortingMetrics } from "@/types";
import LoadingState from "./LoadingState";

interface VisualizationPanelProps {
  title?: string;
  algorithmName: string;
  elementCount: number;
  comparisons: number;
  timeElapsed: number;
  isComplete: boolean;
  isLoading?: boolean;
  error?: string | null;
  children: React.ReactNode;
}

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({
  title,
  algorithmName,
  elementCount,
  comparisons,
  timeElapsed,
  isComplete,
  isLoading = false,
  error = null,
  children,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Title display with algorithm name and element count */}
      <h3 className="panel-title">
        {algorithmName}: Sorting {elementCount} Elements
      </h3>
      
      {/* Visualization area */}
      <div className="flex-grow border border-gray-200 rounded-lg p-4 overflow-hidden relative">
        {isLoading ? (
          <LoadingState message={`Preparing ${algorithmName}...`} />
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : (
          <>
            {children}
            
            {/* Completion overlay */}
            {isComplete && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg shadow-md text-center">
                  <p className="font-medium text-secondary">Sorting Complete!</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Metrics display for comparisons and time */}
      <div className="metrics-container">
        <div className="flex justify-between">
          <p>Comparisons: {comparisons.toLocaleString()}</p>
          <p>Time Elapsed: {timeElapsed.toFixed(3)} seconds</p>
        </div>
        
        {/* Completion message display */}
        {isComplete && (
          <p className="completion-message">
            {algorithmName} finished sorting {elementCount} elements.
            Comparisons: {comparisons.toLocaleString()}, Time: {timeElapsed.toFixed(3)} seconds.
          </p>
        )}
      </div>
    </div>
  );
};

export default VisualizationPanel;
