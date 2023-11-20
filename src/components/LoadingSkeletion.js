// LoadingSkeleton.jsx
import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row justify-around items-center">
      <div className="skeleton-profile"></div>
      <div className="skeleton-content"></div>
    </div>
  );
};

export default LoadingSkeleton;
