import { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const MAX_FILE_SIZE = parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 10485760;

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 10MB limit');
      return false;
    }
    return true;
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedImage(file);
        setPreview(URL.createObjectURL(file));
        setResult(null);
        setError(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await axios.post(`${API_URL}/api/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <div className="logo-icon">🔍</div>
            <h1>AI Image Detector</h1>
          </div>
          <nav className="nav">
            <a href="#home" className="nav-link">Home</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Detect AI-Generated Images</h1>
          <p className="hero-subtitle">
            Powered by advanced machine learning algorithms to distinguish between synthetic and real images with high accuracy
          </p>
          <div className="hero-features">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast Detection</h3>
              <p>Get results in seconds</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>High Accuracy</h3>
              <p>Advanced AI model</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure</h3>
              <p>Your images are safe</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <section className="upload-section">
            <h2 className="section-title">Upload Your Image</h2>
            <p className="section-description">
              Upload an image to detect whether it's AI-generated or real. Supports JPG, PNG, and other common formats.
            </p>

            <div 
              className={`upload-area ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!preview ? (
                <>
                  <div className="upload-icon">📁</div>
                  <h3>Drag & Drop your image here</h3>
                  <p>or</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    id="file-input"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="file-input" className="upload-button">
                    Browse Files
                  </label>
                  <p className="upload-info">Maximum file size: 10MB</p>
                </>
              ) : (
                <div className="preview-section">
                  <img src={preview} alt="Preview" className="preview-image" />
                  <button onClick={handleReset} className="change-image-btn">
                    Change Image
                  </button>
                </div>
              )}
            </div>

            {selectedImage && !result && (
              <button 
                onClick={handleSubmit} 
                disabled={loading} 
                className="analyze-button"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    Analyze Image
                  </>
                )}
              </button>
            )}

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {result && (
              <div className="result-section">
                <h2 className="result-title">Analysis Results</h2>
                <div className={`result-card ${result.prediction}`}>
                  <div className="result-icon">
                    {result.prediction === 'synthetic' ? '🤖' : '✅'}
                  </div>
                  <div className="result-content">
                    <div className="prediction">
                      <span className="label">Classification:</span>
                      <span className={`value ${result.prediction}`}>
                        {result.prediction === 'synthetic' ? 'AI-Generated (Synthetic)' : 'Real Image'}
                      </span>
                    </div>
                    <div className="confidence">
                      <span className="label">Confidence Score:</span>
                      <span className="value">{(result.confidence * 100).toFixed(2)}%</span>
                    </div>
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill"
                        style={{ width: `${result.confidence * 100}%` }}
                      ></div>
                    </div>
                    <p className="result-description">
                      {result.prediction === 'synthetic' 
                        ? 'This image appears to be generated by artificial intelligence.'
                        : 'This image appears to be a real photograph.'}
                    </p>
                  </div>
                </div>
                <button onClick={handleReset} className="reset-button">
                  <span>🔄</span>
                  Analyze Another Image
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>AI Image Detector</h3>
            <p>Advanced AI-powered detection to identify synthetic and real images with high accuracy.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="#documentation">Documentation</a></li>
              <li><a href="#api">API</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <a href="#github" className="social-icon">GitHub</a>
              <a href="#twitter" className="social-icon">Twitter</a>
              <a href="#linkedin" className="social-icon">LinkedIn</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 AI Image Detector. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
