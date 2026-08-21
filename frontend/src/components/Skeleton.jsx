import React from 'react';

export function Skeleton({ width, height, borderRadius = '8px', style = {} }) {
  return (
    <div 
      className="skeleton" 
      style={{ 
        width, 
        height, 
        borderRadius,
        ...style 
      }} 
    />
  );
}

export function SkeletonPage() {
  return (
    <div className="page-container animate-fade-in" style={{ padding: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
        <div>
          <Skeleton width="300px" height="32px" style={{ marginBottom: '8px' }} />
          <Skeleton width="200px" height="16px" />
        </div>
        <Skeleton width="120px" height="40px" />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <Skeleton height="120px" />
        <Skeleton height="120px" />
        <Skeleton height="120px" />
      </div>
      
      <Skeleton height="400px" />
    </div>
  );
}
