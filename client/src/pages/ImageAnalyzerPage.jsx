import React, { useState, useRef } from 'react';
import { FileText, Upload, Image as ImageIcon, Trash2, Play, Info, RotateCcw } from 'lucide-react';
import { analyzeUploadedImage } from '../utils/imageAnalyzer';
import HonestResponseCard from '../components/HonestResponseCard';

export default function ImageAnalyzerPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);
  const imgElementRef = useRef(null);

  const handleFileChange = (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload a JPG, JPEG, PNG, or WEBP image.');
      return;
    }

    // Validate file size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setError('File size exceeds 15MB limit.');
      return;
    }

    setError('');
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file to analyze.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = analyzeUploadedImage(selectedFile, imgElementRef.current);
      setAnalysisResult(res);
      setLoading(false);
    }, 450);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#8B5CF6', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            XELOVO SECURITY TOOLS
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', color: '#F2F5F9', fontFamily: 'var(--font-display)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ImageIcon color="#8B5CF6" size={32} /> Image Scam & Manipulation Analyzer
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#B5C0D0', marginTop: '0.4rem', maxWidth: '750px' }}>
          Upload JPG, PNG, or WEBP images to inspect EXIF metadata, file byte structure, resolution aspect ratios, and visual manipulation indicators.
        </p>
      </div>

      {/* Upload & Form Container */}
      <div className="xelavo-card" style={{ padding: '2rem' }}>
        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', padding: '0.85rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        {!imagePreview ? (
          /* Drag and Drop Upload Area */
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{
              border: '2px dashed rgba(139, 92, 246, 0.4)',
              backgroundColor: 'rgba(3, 11, 28, 0.6)',
              borderRadius: '12px',
              padding: '3.5rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              transition: 'all 0.25s ease'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8B5CF6'
            }}>
              <Upload size={32} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#F2F5F9', margin: 0, fontWeight: 700 }}>
                Drag and drop your image here, or click to browse
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#B5C0D0', marginTop: '0.35rem' }}>
                Supports JPG, JPEG, PNG, and WEBP files (Max 15MB)
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          /* Image Preview & Details Card */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
              {/* Image Preview Box */}
              <div style={{
                position: 'relative',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                backgroundColor: '#030B1C',
                maxHeight: '260px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  ref={imgElementRef}
                  src={imagePreview}
                  alt="Uploaded Preview"
                  style={{ maxWidth: '100%', maxHeight: '250px', objectFit: 'contain' }}
                />
              </div>

              {/* File Information */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#F2F5F9', margin: 0, fontWeight: 700, wordBreak: 'break-all' }}>
                    {selectedFile.name}
                  </h3>
                  <button
                    onClick={handleRemoveImage}
                    className="btn-outline-electric"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', borderColor: '#EF4444', color: '#EF4444' }}
                  >
                    <Trash2 size={14} /> Remove File
                  </button>
                </div>

                <div style={{ backgroundColor: 'rgba(3, 11, 28, 0.6)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid rgba(45, 125, 255, 0.2)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <span style={{ color: '#8494AB', fontSize: '0.78rem' }}>File Size:</span>
                    <p style={{ color: '#F2F5F9', fontWeight: 600, margin: 0 }}>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <div>
                    <span style={{ color: '#8494AB', fontSize: '0.78rem' }}>MIME Type:</span>
                    <p style={{ color: '#8B5CF6', fontWeight: 600, margin: 0, fontFamily: 'var(--font-mono)' }}>{selectedFile.type}</p>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#B5C0D0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Info size={15} color="#19D7E8" /> Image processed 100% locally in browser memory. Not stored on remote servers.
                </div>
              </div>
            </div>

            {/* Analyze Action Button */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleAnalyze} className="btn-blue-gradient" disabled={loading} style={{ padding: '0.75rem 1.75rem', fontSize: '0.92rem' }}>
                {loading ? 'Processing Image Metadata...' : 'Run Image Manipulation Analysis'} <Play size={16} />
              </button>
              {analysisResult && (
                <button onClick={handleRemoveImage} className="btn-outline-electric" style={{ padding: '0.75rem 1.25rem', fontSize: '0.92rem' }}>
                  <RotateCcw size={16} /> Reset
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {analysisResult && <HonestResponseCard result={analysisResult} />}
    </div>
  );
}
