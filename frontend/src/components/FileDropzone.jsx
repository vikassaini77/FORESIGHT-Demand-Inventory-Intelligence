import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, Loader2, FileText, ImageIcon, FileSpreadsheet } from 'lucide-react';

const FileDropzone = ({ 
  title = "Upload Data", 
  description = "Drag and drop your file here, or click to browse",
  acceptedTypes = "*", // e.g. ".csv, .xlsx", ".pdf", "image/*"
  onUploadSuccess = (file) => {}
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, processing, success
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const simulateProcessing = (uploadedFile) => {
    setFile(uploadedFile);
    setUploadState('uploading');
    setProgress(0);

    // Simulate Upload
    let p = 0;
    const uploadInterval = setInterval(() => {
      p += 15;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(uploadInterval);
        setUploadState('processing');
        
        // Simulate AI Processing
        setTimeout(() => {
          setUploadState('success');
          onUploadSuccess(uploadedFile);
          
          // Reset after 3 seconds
          setTimeout(() => {
            setUploadState('idle');
            setFile(null);
            setProgress(0);
          }, 3000);
        }, 2500);
      }
    }, 200);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateProcessing(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      simulateProcessing(e.target.files[0]);
    }
  };

  const getFileIcon = () => {
    if (!file) return <UploadCloud size={40} className="dropzone-icon" />;
    if (file.type.includes('image')) return <ImageIcon size={40} className="dropzone-icon text-accent" />;
    if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) return <FileSpreadsheet size={40} className="dropzone-icon text-success" />;
    return <FileText size={40} className="dropzone-icon text-accent" />;
  };

  return (
    <div 
      className={`file-dropzone ${dragActive ? 'active' : ''} ${uploadState !== 'idle' ? 'processing' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => uploadState === 'idle' && inputRef.current.click()}
    >
      <input 
        ref={inputRef}
        type="file" 
        accept={acceptedTypes}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      
      <div className="dropzone-content">
        {uploadState === 'idle' && (
          <>
            <div className="icon-wrapper glow">{getFileIcon()}</div>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="dropzone-formats">Supported formats: {acceptedTypes}</div>
          </>
        )}

        {uploadState === 'uploading' && (
          <div className="uploading-state">
            <Loader2 size={40} className="spinner text-accent mb-3 mx-auto" />
            <h3 style={{marginTop: '12px'}}>Uploading {file?.name}...</h3>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {uploadState === 'processing' && (
          <div className="processing-state">
            <div className="ai-scan-animation mb-3 mx-auto">
              <div className="scan-line"></div>
              {getFileIcon()}
            </div>
            <h3 style={{marginTop: '12px'}}>AI Analyzing Data...</h3>
            <p style={{color: 'var(--text-secondary)'}}>Extracting metrics and mapping logic</p>
          </div>
        )}

        {uploadState === 'success' && (
          <div className="success-state">
            <CheckCircle size={48} className="text-success mb-3 mx-auto" style={{color: 'var(--success)'}} />
            <h3 style={{marginTop: '12px', color: 'var(--success)'}}>Upload Complete</h3>
            <p style={{color: 'var(--text-secondary)'}}>Data successfully integrated.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDropzone;
