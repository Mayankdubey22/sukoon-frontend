import React from 'react';

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img shimmer"></div>
      <div className="skeleton-line shimmer" style={{ width: '80%' }}></div>
      <div className="skeleton-line shimmer" style={{ width: '50%' }}></div>
    </div>
  );
}

export function SkeletonRow({ count = 5 }) {
  return (
    <div className="carousel-track" style={{ overflow: 'hidden' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ flex: `0 0 calc((100% - 4 * 20px) / 4.5)` }}>
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}