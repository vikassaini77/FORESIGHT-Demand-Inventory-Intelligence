import React, { useState, useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { motion } from 'framer-motion';
import { Activity, MapPin, Upload } from 'lucide-react';
import * as THREE from 'three';
import { useToast } from '../context/ToastContext';
import FileDropzone from './FileDropzone';
import { AnimatePresence } from 'framer-motion';

const Map = () => {
  const globeEl = useRef();
  const [arcsData, setArcsData] = useState([]);
  const [status, setStatus] = useState('Connecting to live feed...');
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState();
  const { addToast } = useToast();
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    // Load country data
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);
  }, []);

  useEffect(() => {
    // Initial camera position
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 2000);
      
      // Add realistic Earth clouds layer
      const scene = globeEl.current.scene();
      const geometry = new THREE.SphereGeometry(101.5, 64, 64);
      const textureLoader = new THREE.TextureLoader();
      textureLoader.setCrossOrigin('anonymous');
      
      const material = new THREE.MeshPhongMaterial({
        map: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'),
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const clouds = new THREE.Mesh(geometry, material);
      scene.add(clouds);
      
      // Add Orbiting Moon
      const moonGeo = new THREE.SphereGeometry(8, 32, 32);
      const moonMat = new THREE.MeshPhongMaterial({
        map: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg'),
        color: 0xffffff,
        emissive: 0x444444 // Brighter so it stands out more
      });
      const moon = new THREE.Mesh(moonGeo, moonMat);
      moon.position.set(140, 15, 0); // Closer to Earth so it isn't cut off by the screen edge
      
      const moonPivot = new THREE.Group();
      moonPivot.add(moon);
      scene.add(moonPivot);
      
      let animationFrameId;
      const animateScene = () => {
        if (clouds) {
          clouds.rotation.y += 0.002; 
        }
        if (moonPivot) {
          moonPivot.rotation.y -= 0.005; // orbit speed
          moon.rotation.y += 0.01; // moon's own rotation
        }
        animationFrameId = requestAnimationFrame(animateScene);
      };
      animateScene();

      return () => {
        cancelAnimationFrame(animationFrameId);
        scene.remove(clouds);
        scene.remove(moonPivot);
        geometry.dispose();
        material.dispose();
        moonGeo.dispose();
        moonMat.dispose();
      };
    }
  }, []);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL + '/ws/supply-chain');

    ws.onopen = () => {
      setStatus('Live Satellite Feed Active');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      const newArc = {
        startLat: data.startLat,
        startLng: data.startLng,
        endLat: data.endLat,
        endLng: data.endLng,
        color: data.color,
        name: `${data.origin} → ${data.dest}`
      };

      setArcsData((prev) => [...prev, newArc].slice(-15)); // Keep last 15 active arcs
    };

    ws.onclose = () => {
      setStatus('Connection lost. Reconnecting...');
    };

    return () => {
      ws.close();
    };
  }, []);

  const N_RINGS = 12;
  const ringsData = useMemo(() => [...Array(N_RINGS).keys()].map(() => ({
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
    maxR: Math.random() * 20 + 3,
    propagationSpeed: (Math.random() - 0.5) * 2 + 1,
    repeatPeriod: Math.random() * 2000 + 200
  })), []);

  return (
    <div className="animated-sky" style={{ 
      width: '100%', 
      height: 'calc(100vh - 100px)', 
      position: 'relative', 
      borderRadius: '16px', 
      overflow: 'hidden'
    }}>
      {/* Header Overlay */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, background: 'rgba(5, 5, 5, 0.7)', backdropFilter: 'blur(10px)', padding: '16px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={24} color="var(--accent-color)" />
          Global Supply Chain
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: status.includes('Active') ? 'var(--success)' : 'var(--danger)', boxShadow: `0 0 10px ${status.includes('Active') ? 'var(--success)' : 'var(--danger)'}` }} />
          {status}
        </div>
      </div>

      {/* Upload Toggle Button */}
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <button 
          className="btn" 
          onClick={() => setShowUpload(!showUpload)}
          style={{ background: 'rgba(5, 5, 5, 0.7)', color: 'white', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px' }}
        >
          <Upload size={16} /> {showUpload ? 'Close' : 'Bulk Ingest'}
        </button>
      </div>

      {/* Upload Panel */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            style={{ position: 'absolute', top: 70, right: 20, zIndex: 10, width: '400px' }}
          >
            <div className="chart-card" style={{ padding: '24px', background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)' }}>
              <FileDropzone 
                title="Supply Chain Routes"
                description="Upload CSV containing origin and destination coordinates"
                acceptedTypes=".csv"
                onUploadSuccess={(file) => {
                  addToast(`Ingested ${file.name}. Plotting new routes...`, 'success');
                  setTimeout(() => setShowUpload(false), 3000);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Recent Activity Overlay */}
      <div style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 10, width: '300px' }}>
        <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} /> Live Shipments
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {arcsData.slice(-3).reverse().map((arc, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ background: 'rgba(5,5,5,0.8)', borderLeft: `3px solid ${arc.color}`, padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}
            >
              {arc.name}
            </motion.div>
          ))}
        </div>
      </div>

      <Globe
        ref={globeEl}
        globeImageUrl="https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/imgs/earth-blue-marble.jpg"
        bumpImageUrl="https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/imgs/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        
        polygonsData={countries.features}
        polygonAltitude={d => d === hoverD ? 0.02 : 0.005}
        polygonCapColor={d => d === hoverD ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0)'}
        polygonSideColor={() => 'rgba(0,0,0,0)'}
        polygonStrokeColor={() => 'rgba(255, 255, 255, 0.1)'}
        polygonLabel={({ properties: d }) => `
          <div style="background: rgba(10, 10, 10, 0.85); border: 1px solid var(--accent-color); padding: 10px 14px; border-radius: 8px; backdrop-filter: blur(10px); box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
            <strong style="color: #fff; font-size: 1.1rem; display: block; margin-bottom: 4px;">${d.ADMIN}</strong>
            <span style="color: #a1a1aa; font-size: 0.85rem; display: block;">ISO: ${d.ISO_A2}</span>
            <span style="color: #a1a1aa; font-size: 0.85rem; display: block;">Population: ${(d.POP_EST / 1000000).toFixed(1)}M</span>
          </div>
        `}
        onPolygonHover={setHoverD}
        
        arcsData={arcsData}
        arcColor="color"
        arcDashLength={() => Math.random()}
        arcDashGap={() => Math.random()}
        arcDashAnimateTime={() => Math.random() * 4000 + 1000}
        
        ringsData={ringsData}
        ringColor={() => t => `rgba(255,100,50,${1-t})`}
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
      />
    </div>
  );
};

export default Map;
