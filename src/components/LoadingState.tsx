import React from 'react';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  size = 'medium' 
}) => {
  // Determine spinner size based on prop
  const spinnerSize = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }[size];

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${spinnerSize} mb-2`}></div>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
};

export default LoadingState;
