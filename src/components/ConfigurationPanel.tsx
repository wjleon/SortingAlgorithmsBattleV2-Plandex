
import React, { ChangeEvent } from "react";
import { ALGORITHMS, Distribution, ConfigurationHook } from "@/hooks/useConfiguration";

interface ConfigurationPanelProps {
  config: ConfigurationHook[0];
  actions: ConfigurationHook[1];
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  config,
  actions,
}) => {
  const {
    algorithm1,
    algorithm2,
    elementCount,
    distribution,
    isSoundEnabled,
    animationSpeed,
    isRunning,
    isPaused,
  } = config;

  const {
    setAlgorithm1,
    setAlgorithm2,
    setElementCount,
    setDistribution,
    toggleSound,
    setAnimationSpeed,
    startSorting,
    pauseSorting,
    resetSorting,
  } = actions;

  const handleElementCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setElementCount(value);
    }
  };

  const handleDistributionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDistribution(e.target.value as Distribution);
  };

  const handleAnimationSpeedChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setAnimationSpeed(value);
    }
  };

  // Determine button states
  const startButtonDisabled = isRunning && !isPaused;
  const pauseButtonDisabled = !isRunning || isPaused;
  const resetButtonDisabled = !isRunning && !isPaused;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Algorithm Selection */}
      <div className="space-y-4">
        <h3 className="font-medium">Algorithm Selection</h3>
        <div className="space-y-2">
          <div>
            <label htmlFor="algorithm1" className="block text-sm mb-1">
              Algorithm 1 (Left Panel)
            </label>
            <select
              id="algorithm1"
              className="select w-full"
              value={algorithm1}
              onChange={(e) => setAlgorithm1(e.target.value)}
              disabled={isRunning}
            >
              {ALGORITHMS.map((algo) => (
                <option key={`algo1-${algo}`} value={algo}>
                  {algo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="algorithm2" className="block text-sm mb-1">
              Algorithm 2 (Right Panel)
            </label>
            <select
              id="algorithm2"
              className="select w-full"
              value={algorithm2}
              onChange={(e) => setAlgorithm2(e.target.value)}
              disabled={isRunning}
            >
              {ALGORITHMS.map((algo) => (
                <option key={`algo2-${algo}`} value={algo}>
                  {algo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Array Configuration */}
      <div className="space-y-4">
        <h3 className="font-medium">Array Configuration</h3>
        <div className="space-y-2">
          <div>
            <label htmlFor="elementCount" className="block text-sm mb-1">
              Number of Elements (10-200)
            </label>
            <input
              id="elementCount"
              type="number"
              className="input w-full"
              value={elementCount}
              onChange={handleElementCountChange}
              min={10}
              max={200}
              disabled={isRunning}
            />
          </div>
          <div>
            <p className="block text-sm mb-1">Distribution of Elements</p>
            <div className="radio-group">
              <div className="radio-item">
                <input
                  type="radio"
                  id="random"
                  name="distribution"
                  value="random"
                  checked={distribution === "random"}
                  onChange={handleDistributionChange}
                  disabled={isRunning}
                />
                <label htmlFor="random">Random</label>
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  id="ascending"
                  name="distribution"
                  value="ascending"
                  checked={distribution === "ascending"}
                  onChange={handleDistributionChange}
                  disabled={isRunning}
                />
                <label htmlFor="ascending">Ascending</label>
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  id="descending"
                  name="distribution"
                  value="descending"
                  checked={distribution === "descending"}
                  onChange={handleDistributionChange}
                  disabled={isRunning}
                />
                <label htmlFor="descending">Descending</label>
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  id="split-ascending"
                  name="distribution"
                  value="split-ascending"
                  checked={distribution === "split-ascending"}
                  onChange={handleDistributionChange}
                  disabled={isRunning}
                />
                <label htmlFor="split-ascending">Split Ascending</label>
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  id="split-descending"
                  name="distribution"
                  value="split-descending"
                  checked={distribution === "split-descending"}
                  onChange={handleDistributionChange}
                  disabled={isRunning}
                />
                <label htmlFor="split-descending">Split Descending</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <h3 className="font-medium">Controls</h3>
        <div className="flex flex-wrap gap-2">
          <button
            className={`btn ${startButtonDisabled ? "btn-disabled" : "btn-primary"}`}
            onClick={startSorting}
            disabled={startButtonDisabled}
            aria-label="Start sorting"
          >
            {isPaused ? "Resume" : "Start"}Start
          </button>
          <button
            className={`btn ${pauseButtonDisabled ? "btn-disabled" : "btn-secondary"}`}
            onClick={pauseSorting}
            disabled={pauseButtonDisabled}
            aria-label="Pause sorting"
          >
            Pause
          </button>
          <button
            className={`btn ${resetButtonDisabled ? "btn-disabled" : "btn-accent"}`}
            onClick={resetSorting}
            disabled={resetButtonDisabled}
            aria-label="Reset sorting"
          >
            Reset
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="sound" className="text-sm">
              Sound {isSoundEnabled ? "On" : "Off"}
            </label>

            <div
              className="relative inline-block w-10 align-middle select-none cursor-pointer"
              onClick={toggleSound}
              role="switch"
              aria-checked={isSoundEnabled}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleSound();
                  e.preventDefault();
                }
              }}
            >
              <input
                type="checkbox"
                id="sound"
                className="sr-only"
                checked={isSoundEnabled}
                onChange={toggleSound}
              />
              <div className={`block h-6 rounded-full w-10 ${isSoundEnabled ? "bg-primary" : "bg-gray-300"}`}></div>
              <div
                className={`absolute left-1 top-1 bg-white rounded-full h-4 w-4 transition-transform ${
                  isSoundEnabled ? "transform translate-x-4" : ""
                }`}
              ></div>
            </div>

          </div>
          <div>
            <label htmlFor="speed" className="block text-sm mb-1">
              Animation Speed: {animationSpeed}
            </label>
            <input
              id="speed"
              type="range"
              min="1"
              max="10"
              value={animationSpeed}
              onChange={handleAnimationSpeedChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPanel;
