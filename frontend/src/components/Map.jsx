import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Activity, Navigation, Ship, Globe as GlobeIcon, Crosshair } from 'lucide-react';

const mockVolumeData = [
  { name: 'Mon', value: 1000 },
  { name: 'Tue', value: 1800 },
  { name: 'Wed', value: 1200 },
  { name: 'Thu', value: 2500 },
  { name: 'Fri', value: 2100 },
  { name: 'Sat', value: 2900 },
  { name: 'Sun', value: 3800 },
];

const mockOnTimeData = [
  { name: 'Mon', value: 92 },
  { name: 'Tue', value: 95 },
  { name: 'Wed', value: 89 },
  { name: 'Thu', value: 96 },
  { name: 'Fri', value: 94 },
  { name: 'Sat', value: 98 },
  { name: 'Sun', value: 97 },
];

export default function Map() {
  const globeEl = useRef();
  
  // Ports data for labels and glowing nodes
  const portsData = [
    { lat: 51.9, lng: 4.4, name: 'Rotterdam [RTM]', stat: '85%' },
    { lat: 34.0, lng: -118.2, name: 'Los Angeles [LAX]', stat: '118%' },
    { lat: 25.2, lng: 55.2, name: 'Dubai [DXB]', stat: '93%' },
    { lat: 1.3, lng: 103.8, name: 'Singapore [SIN]', stat: '82%' },
    { lat: 31.2, lng: 121.5, name: 'Shanghai [SHG]', stat: '78%' },
    { lat: 40.7, lng: -74.0, name: 'New York [JFK]', stat: '90%' }
  ];

  // Complex network of routes
  const arcsData = [
    { startLat: 31.2, startLng: 121.5, endLat: 51.9, endLng: 4.4, color: '#10b981' }, 
    { startLat: 31.2, startLng: 121.5, endLat: 34.0, endLng: -118.2, color: '#0ea5e9' },
    { startLat: 1.3, startLng: 103.8, endLat: 25.2, endLng: 55.2, color: '#f97316' },
    { startLat: 51.9, startLng: 4.4, endLat: 40.7, endLng: -74.0, color: '#10b981' },
    { startLat: -33.8, startLng: 151.2, endLat: 1.3, endLng: 103.8, color: '#f97316' },
    { startLat: -23.5, startLng: -46.6, endLat: 40.7, endLng: -74.0, color: '#0ea5e9' },
    { startLat: 25.2, startLng: 55.2, endLat: 51.9, endLng: 4.4, color: '#10b981' },
    { startLat: 34.0, startLng: -118.2, endLat: -33.8, endLng: 151.2, color: '#0ea5e9' },
    { startLat: 1.3, startLng: 103.8, endLat: 31.2, endLng: 121.5, color: '#10b981' }
  ];

  const activeVessels = [
    { id: 'AE12831', loc: 'Shanghai', eta: '31.2m' },
    { id: 'AE10022', loc: 'Shanghai', eta: '31.3m' },
    { id: 'AE10003', loc: 'New York', eta: '29.3m' },
    { id: 'AE10037', loc: 'Location', eta: '20.5m' },
    { id: 'AE10078', loc: 'New York', eta: '20.5m' },
  ];

  useEffect(() => {
    if (globeEl.current) {
      // Set initial camera position slightly further back so it fits perfectly
      globeEl.current.pointOfView({ lat: 20, lng: 90, altitude: 2.5 }, 0);
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  const fadeUpVariant = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const fadeRightVariant = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const Sparkline = ({ data, color }) => (
    <div style={{ height: '50px', width: '100%', marginTop: '4px' }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.6}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke={color} fill={`url(#gradient-${color})`} strokeWidth={2} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div style={{ 
      width: '100%', 
      height: 'calc(100vh - 100px)', 
      position: 'relative', 
      borderRadius: '16px', 
      overflow: 'hidden', 
      background: 'radial-gradient(circle at 50% 120%, rgba(14, 165, 233, 0.4) 0%, rgba(5, 7, 10, 1) 50%, #000 100%)',
      boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)'
    }}>
      
      {/* Top Header */}
      <div style={{ position: 'absolute', top: 20, left: 320, right: 320, zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 24px' }}>
         <div style={{ display: 'none' }}> {/* Hidden to match screenshot exactly which has no top header */} </div>
      </div>

      {/* Left Sidebar Overlay */}
      <motion.div initial="hidden" animate="show" variants={fadeRightVariant} style={{ position: 'absolute', top: 20, left: 20, bottom: 20, width: '280px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="chart-card" style={{ padding: '0', background: 'rgba(5, 10, 20, 0.65)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>LIVE TRACKING</div>
            <div style={{ fontSize: '1.25rem', color: '#10b981', fontWeight: 700, marginTop: '4px', textShadow: '0 0 10px rgba(16,185,129,0.5)' }}>ASIA-EUROPE [AE1]</div>
          </div>
          
          <div style={{ padding: '8px 0' }}>
            <div className="nav-item" style={{ padding: '12px 20px', display: 'flex', gap: '12px', alignItems: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
              <Activity size={18} /> OVERVIEW
            </div>
            <div className="nav-item" style={{ padding: '12px 20px', display: 'flex', gap: '12px', alignItems: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
              <Navigation size={18} /> ROUTES
            </div>
            <div className="nav-item active" style={{ padding: '12px 20px', display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '0.85rem', borderLeft: '3px solid #fff' }}>
              <Ship size={18} /> ASSETS
            </div>
            <div className="nav-item" style={{ padding: '12px 20px', display: 'flex', gap: '12px', alignItems: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
              <Crosshair size={18} /> ALERTS
            </div>
            <div className="nav-item" style={{ padding: '12px 20px', display: 'flex', gap: '12px', alignItems: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
              <Activity size={18} /> ANALYTICS
            </div>
          </div>
        </div>
        
        {/* Floating Ship Icon Badge */}
        <div style={{ marginTop: 'auto', alignSelf: 'center', background: 'linear-gradient(135deg, rgba(14,165,233,0.2) 0%, rgba(14,165,233,0.05) 100%)', padding: '24px', borderRadius: '50%', border: '1px solid rgba(14,165,233,0.4)', boxShadow: '0 0 40px rgba(14,165,233,0.3)', backdropFilter: 'blur(10px)' }}>
          <Ship size={40} color="#0ea5e9" />
        </div>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', letterSpacing: '0.15em', marginTop: '-4px' }}>LIVE TRACKING</div>
      </motion.div>

      {/* Right Sidebar Overlay */}
      <motion.div initial="hidden" animate="show" variants={fadeUpVariant} style={{ position: 'absolute', top: 20, right: 20, bottom: 20, width: '300px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        
        <div className="chart-card" style={{ background: 'rgba(5, 10, 20, 0.65)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <span>ROUTE ANALYTICS</span>
            <span>...</span>
          </div>
          <div style={{ color: '#fff', fontSize: '0.85rem', marginBottom: '8px' }}><strong style={{ color: '#fff' }}>SHG</strong> to <strong style={{ color: '#fff' }}>RTM</strong> | Transit: 31 Days</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginBottom: '4px' }}>Transit: 31 Days</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginBottom: '8px' }}>Volume: 142K TEUs</div>
          <div style={{ color: '#10b981', fontSize: '0.75rem', textShadow: '0 0 5px rgba(16,185,129,0.5)' }}>Status: Optimized</div>
        </div>

        <div className="chart-card" style={{ background: 'rgba(5, 10, 20, 0.65)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', display: 'flex', justifyContent: 'space-between' }}>
            <span>Volume Trend</span>
            <span>...</span>
          </div>
          <Sparkline data={mockVolumeData} color="#0ea5e9" />
        </div>

        <div className="chart-card" style={{ background: 'rgba(5, 10, 20, 0.65)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', display: 'flex', justifyContent: 'space-between' }}>
            <span>On-Time %</span>
            <span>%</span>
          </div>
          <Sparkline data={mockOnTimeData} color="#10b981" />
        </div>

        <div className="chart-card" style={{ background: 'rgba(5, 10, 20, 0.65)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', flex: 1 }}>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Active Vessels</span>
            <span>...</span>
          </div>
          <table style={{ width: '100%', fontSize: '0.7rem' }}>
            <thead>
              <tr>
                <th style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'left', paddingBottom: '12px', fontWeight: 500 }}>VESSEL ID</th>
                <th style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'left', paddingBottom: '12px', fontWeight: 500 }}>LOCATION</th>
                <th style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'right', paddingBottom: '12px', fontWeight: 500 }}>ETA</th>
              </tr>
            </thead>
            <tbody>
              {activeVessels.map((v, i) => (
                <tr key={i}>
                  <td style={{ color: 'rgba(255,255,255,0.8)', padding: '8px 0' }}>{v.id}</td>
                  <td style={{ color: 'rgba(255,255,255,0.8)', padding: '8px 0' }}>{v.loc}</td>
                  <td style={{ color: 'rgba(255,255,255,0.8)', textAlign: 'right', padding: '8px 0' }}>{v.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </motion.div>

      {/* Behind-Globe Glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }}></div>

      {/* The 3D Globe Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
        <Globe
          ref={globeEl}
          globeImageUrl="https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/imgs/earth-blue-marble.jpg"
          bumpImageUrl="https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/imgs/earth-topology.png"
          backgroundImageUrl="https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/imgs/night-sky.png"
          backgroundColor="rgba(0,0,0,0)"
          
          atmosphereColor="#0ea5e9"
          atmosphereAltitude={0.15}
          
          arcsData={arcsData}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={3000}
          arcStroke={0.5}
          
          pointsData={portsData}
          pointColor={() => '#f97316'}
          pointAltitude={0.05}
          pointRadius={0.4}
          
          htmlElementsData={portsData}
          htmlElement={d => {
            const el = document.createElement('div');
            el.innerHTML = `
              <div style="
                color: white; 
                font-size: 10px; 
                font-family: Inter, sans-serif;
                white-space: nowrap; 
                background: rgba(10, 15, 25, 0.7); 
                backdrop-filter: blur(4px);
                padding: 4px 8px; 
                border-radius: 4px; 
                border: 1px solid rgba(255,255,255,0.15);
                transform: translate(10px, -10px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
              ">
                <div style="margin-bottom: 2px;">${d.name}</div>
                <div style="color: #10b981; font-weight: 600;">${d.stat}</div>
              </div>
            `;
            el.style.pointerEvents = 'none';
            return el;
          }}
        />
      </div>
    </div>
  );
}
