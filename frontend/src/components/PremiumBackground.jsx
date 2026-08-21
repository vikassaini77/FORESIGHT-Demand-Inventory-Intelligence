import React, { useEffect, useRef } from 'react';

export default function PremiumBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    
    // 3D Globe parameters
    const GLOBE_RADIUS = window.innerWidth > 1000 ? window.innerWidth * 0.35 : 300; 
    const POINTS_COUNT = 800; // Number of dots on the globe
    const DOT_RADIUS = 1.2;
    
    // Arrays for dots and arcs
    const points = [];
    const hubs = []; // Special points that arcs jump between
    const arcs = [];
    
    // Rotation variables
    let angleX = 0.05; // Initial tilt
    let angleY = 0;    // Rotation axis

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      // Generate points on a sphere using Fibonacci spiral for even distribution
      const phi = Math.PI * (3 - Math.sqrt(5)); 
      
      points.length = 0;
      hubs.length = 0;

      for (let i = 0; i < POINTS_COUNT; i++) {
        const y = 1 - (i / (POINTS_COUNT - 1)) * 2; // y goes from 1 to -1
        const radiusAtY = Math.sqrt(1 - y * y); // radius at y
        const theta = phi * i; // golden angle increment

        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;

        points.push({ x, y, z });

        // Select ~15 random points to act as major global hubs
        if (Math.random() > 0.98 && hubs.length < 15) {
          hubs.push({ x, y, z, id: i });
        }
      }
    };

    // Rotate 3D coordinates
    const rotate3D = (p, ax, ay) => {
      // Rotate around X (tilt)
      let cosX = Math.cos(ax), sinX = Math.sin(ax);
      let y1 = p.y * cosX - p.z * sinX;
      let z1 = p.y * sinX + p.z * cosX;
      
      // Rotate around Y (spin)
      let cosY = Math.cos(ay), sinY = Math.sin(ay);
      let x2 = p.x * cosY + z1 * sinY;
      let z2 = -p.x * sinY + z1 * cosY;
      
      return { x: x2, y: y1, z: z2 };
    };

    let animationFrameId;
    let lastArcTime = 0;

    const animate = (time) => {
      ctx.clearRect(0, 0, width, height);
      
      // Slow rotation
      angleY += 0.001;
      
      // Center of globe (offset to the right and bottom)
      const centerX = width * 0.7;
      const centerY = height * 0.6;
      
      // Draw background dots
      points.forEach(point => {
        const rotated = rotate3D(point, angleX, angleY);
        
        // Simple 3D projection
        const scale = 300 / (300 + rotated.z * GLOBE_RADIUS * 0.5); // Perspective scaling
        const x2d = centerX + rotated.x * GLOBE_RADIUS * scale;
        const y2d = centerY + rotated.y * GLOBE_RADIUS * scale;
        
        // Alpha based on Z depth (fade out points on the back of the globe)
        // rotated.z goes from -1 (front) to 1 (back)
        const alpha = Math.max(0.05, Math.min(0.6, 0.4 - rotated.z * 0.4));
        
        ctx.beginPath();
        ctx.arc(x2d, y2d, DOT_RADIUS * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      });

      // Periodically spawn a new data arc
      if (time - lastArcTime > 800) {
        lastArcTime = time;
        if (hubs.length > 2) {
          const fromHub = hubs[Math.floor(Math.random() * hubs.length)];
          let toHub = hubs[Math.floor(Math.random() * hubs.length)];
          while (toHub === fromHub) toHub = hubs[Math.floor(Math.random() * hubs.length)]; // Prevent self-loop
          
          arcs.push({
            from: fromHub,
            to: toHub,
            progress: 0, // 0 to 1
            speed: 0.01 + Math.random() * 0.01
          });
        }
      }

      // Draw Arcs
      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i];
        arc.progress += arc.speed;
        
        if (arc.progress > 1) {
          arcs.splice(i, 1);
          continue;
        }

        const rFrom = rotate3D(arc.from, angleX, angleY);
        const rTo = rotate3D(arc.to, angleX, angleY);
        
        // Only draw if both points are somewhat on the front of the globe
        if (rFrom.z > 0.5 && rTo.z > 0.5) continue; // Both on the back

        const scaleFrom = 300 / (300 + rFrom.z * GLOBE_RADIUS * 0.5);
        const x1 = centerX + rFrom.x * GLOBE_RADIUS * scaleFrom;
        const y1 = centerY + rFrom.y * GLOBE_RADIUS * scaleFrom;

        const scaleTo = 300 / (300 + rTo.z * GLOBE_RADIUS * 0.5);
        const x2 = centerX + rTo.x * GLOBE_RADIUS * scaleTo;
        const y2 = centerY + rTo.y * GLOBE_RADIUS * scaleTo;

        // Calculate control point for the arc (push it OUT from the center of the globe)
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        
        // Push control point away from center to create an arching curve
        const vectorCenterX = midX - centerX;
        const vectorCenterY = midY - centerY;
        const len = Math.sqrt(vectorCenterX*vectorCenterX + vectorCenterY*vectorCenterY) || 1;
        
        const cpX = midX + (vectorCenterX / len) * (distance * 0.4);
        const cpY = midY + (vectorCenterY / len) * (distance * 0.4);

        // Calculate current position of the "packet" along the quadratic bezier
        const t = arc.progress;
        const invT = 1 - t;
        const currentX = invT * invT * x1 + 2 * invT * t * cpX + t * t * x2;
        const currentY = invT * invT * y1 + 2 * invT * t * cpY + t * t * y2;

        // Draw the faint full arc path
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cpX, cpY, x2, y2);
        ctx.strokeStyle = `rgba(234, 88, 12, ${0.1 * Math.sin(t * Math.PI)})`; // Fade in and out
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw the glowing data packet moving along the arc
        ctx.beginPath();
        ctx.arc(currentX, currentY, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${Math.sin(t * Math.PI)})`; // Bright gold/orange
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ea580c';
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animationFrameId = requestAnimationFrame(animate);
    
    window.addEventListener('resize', init);
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, left: 0, right: 0, bottom: 0, 
      zIndex: -1, 
      overflow: 'hidden', 
      pointerEvents: 'none',
      background: 'var(--bg-color)' 
    }}>
      
      {/* 1. Subtle Dot Grid Texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.15
      }} />

      {/* 2. Global Glow Behind the Globe */}
      <div style={{
        position: 'absolute', top: '10%', right: '-10%', width: '80vw', height: '80vw',
        background: 'radial-gradient(circle, rgba(234, 88, 12, 0.03) 0%, transparent 60%)',
        borderRadius: '50%', filter: 'blur(100px)'
      }} />

      {/* 3. The 3D Canvas Globe */}
      <canvas 
        ref={canvasRef} 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.8 }}
      />
      
      {/* Overlay to dim everything slightly in dark mode to keep contrast high for charts */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))',
        pointerEvents: 'none'
      }} />
    </div>
  );
}
