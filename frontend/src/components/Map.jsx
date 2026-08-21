import React, { useState, useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { motion } from 'framer-motion';
import { Ship, Activity, TrendingUp, Navigation, Filter } from 'lucide-react';
import * as THREE from 'three';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const mockVolumeData = [
  { time: 'Mon', value: 120 }, { time: 'Tue', value: 130 }, { time: 'Wed', value: 110 },
  { time: 'Thu', value: 145 }, { time: 'Fri', value: 135 }, { time: 'Sat', value: 160 }, { time: 'Sun', value: 155 }
];

const mockOnTimeData = [
  { time: 'Mon', value: 92 }, { time: 'Tue', value: 94 }, { time: 'Wed', value: 91 },
  { time: 'Thu', value: 96 }, { time: 'Fri', value: 95 }, { time: 'Sat', value: 98 }, { time: 'Sun', value: 97 }
];

const activeVessels = [
  { id: 'AE12831', loc: 'Shanghai', eta: '31.2m' },
  { id: 'AE10022', loc: 'Shanghai', eta: '31.3m' },
  { id: 'AE10003', loc: 'New York', eta: '29.3m' },
  { id: 'AE10037', loc: 'Location', eta: '20.5m' },
  { id: 'AE10078', loc: 'New York', eta: '20.5m' }
];

export default function Map() {
  const globeEl = useRef();
  const containerRef = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      // Adjusted altitude to zoom out and center better
      globeEl.current.pointOfView({ lat: 20, lng: 90, altitude: 2.8 }, 2000);
      
      const scene = globeEl.current.scene();
      
      // Add subtle blue glowing atmosphere
      const geometry = new THREE.SphereGeometry(102, 64, 64);
      const material = new THREE.MeshPhongMaterial({
        color: 0x0088ff,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const atmosphere = new THREE.Mesh(geometry, material);
      scene.add(atmosphere);

      // Auto-rotate
      let animationFrameId;
      const animateScene = () => {
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = 0.5;
        animationFrameId = requestAnimationFrame(animateScene);
      };
      animateScene();

      return () => {
        cancelAnimationFrame(animationFrameId);
        scene.remove(atmosphere);
        geometry.dispose();
        material.dispose();
      };
    }
  }, []);

  // Mock static arcs for the screenshot look
  const arcsData = [
    { startLat: 31.2, startLng: 121.5, endLat: 51.9, endLng: 4.4, color: '#10b981' }, // Shanghai to Rotterdam
    { startLat: 31.2, startLng: 121.5, endLat: 34.0, endLng: -118.2, color: '#3b82f6' }, // Shanghai to LA
    { startLat: 1.3, startLng: 103.8, endLat: 25.2, endLng: 55.2, color: '#ea580c' }, // Singapore to Dubai
    { startLat: 51.9, startLng: 4.4, endLat: 40.7, endLng: -74.0, color: '#3b82f6' }, // Rotterdam to NY
  ];

  const fadeUpVariant = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const fadeRightVariant = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const Sparkline = ({ data, color }) => (
    <div style={{ height: '60px', width: '100%', marginTop: '8px' }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.5}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke={color} fill={`url(#gradient-${color})`} strokeWidth={2} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div ref={containerRef} style={{ width: '100%', height: 'calc(100vh - 100px)', position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#05070a' }}>
      
      {/* Top Header */}
      <div style={{ position: 'absolute', top: 20, left: 320, right: 320, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Globe size={24} color="#3b82f6" />
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1rem', letterSpacing: '0.1em' }}>GLOBAL LOGISTICS | TERRA DASHBOARD</h2>
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Active Routes: <span style={{ color: '#fff' }}>14,032</span> &nbsp; In Transit: <span style={{ color: '#fff' }}>4.1M TEUs</span>
        </div>
      </div>

      {/* Left Sidebar Overlay */}
      <motion.div initial="hidden" animate="show" variants={fadeRightVariant} style={{ position: 'absolute', top: 20, left: 20, bottom: 20, width: '280px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="chart-card" style={{ padding: '0', background: 'rgba(10,15,25,0.85)' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>LIVE TRACKING</div>
            <div style={{ fontSize: '1.25rem', color: 'var(--success)', fontWeight: 700, marginTop: '4px', textShadow: '0 0 10px rgba(16,185,129,0.5)' }}>ASIA-EUROPE [AE1]</div>
          </div>
          
          <div style={{ padding: '8px 0' }}>
            <div className="nav-item">
              <Activity size={18} /> OVERVIEW
            </div>
            <div className="nav-item">
              <Navigation size={18} /> ROUTES
            </div>
            <div className="nav-item active" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <Ship size={18} /> ASSETS
            </div>
          </div>
        </div>
        
        {/* Floating Ship Icon Badge */}
        <div style={{ marginTop: 'auto', alignSelf: 'center', background: 'rgba(59,130,246,0.1)', padding: '24px', borderRadius: '50%', border: '1px solid rgba(59,130,246,0.3)', boxShadow: '0 0 30px rgba(59,130,246,0.2)' }}>
          <Ship size={48} color="#3b82f6" />
        </div>
        <div style={{ textAlign: 'center', color: '#fff', fontSize: '0.85rem', letterSpacing: '0.1em' }}>LIVE TRACKING</div>
      </motion.div>

      {/* Right Sidebar Overlay */}
      <motion.div initial="hidden" animate="show" variants={fadeUpVariant} style={{ position: 'absolute', top: 20, right: 20, bottom: 20, width: '320px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        
        <div className="chart-card" style={{ background: 'rgba(10,15,25,0.85)', padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '12px' }}>ROUTE ANALYTICS</div>
          <div style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '4px' }}><strong>SHG</strong> to <strong>RTM</strong> | Transit: 31 Days</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '2px' }}>Transit: 31 Days</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '2px' }}>Volume: 142K TEUs</div>
          <div style={{ color: 'var(--success)', fontSize: '0.8rem', textShadow: '0 0 5px rgba(16,185,129,0.5)' }}>Status: Optimized</div>
        </div>

        <div className="chart-card" style={{ background: 'rgba(10,15,25,0.85)', padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>VOLUME TREND</div>
          <Sparkline data={mockVolumeData} color="#3b82f6" />
        </div>

        <div className="chart-card" style={{ background: 'rgba(10,15,25,0.85)', padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>ON-TIME %</div>
          <Sparkline data={mockOnTimeData} color="#10b981" />
        </div>

        <div className="chart-card" style={{ background: 'rgba(10,15,25,0.85)', padding: '20px', flex: 1 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '12px' }}>ACTIVE VESSELS</div>
          <table style={{ width: '100%', fontSize: '0.75rem' }}>
            <thead>
              <tr>
                <th style={{ color: 'var(--text-secondary)', textAlign: 'left', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>VESSEL ID</th>
                <th style={{ color: 'var(--text-secondary)', textAlign: 'left', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>LOCATION</th>
                <th style={{ color: 'var(--text-secondary)', textAlign: 'right', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>ETA</th>
              </tr>
            </thead>
            <tbody>
              {activeVessels.map((v, i) => (
                <tr key={i}>
                  <td style={{ color: '#fff', padding: '8px 0' }}>{v.id}</td>
                  <td style={{ color: 'var(--text-secondary)', padding: '8px 0' }}>{v.loc}</td>
                  <td style={{ color: 'var(--text-secondary)', textAlign: 'right', padding: '8px 0' }}>{v.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </motion.div>

      {/* The 3D Globe Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Globe
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-dark.jpg"
          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          
          arcsData={arcsData}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={2000}
          arcStroke={1}
        />
      </div>
    </div>
  );
}
