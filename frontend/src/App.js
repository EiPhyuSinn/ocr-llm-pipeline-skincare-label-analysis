import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const [question, setQuestion] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [recommendations, setRecommendations] = useState({ products: [] });
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    
    try {
      setIsProcessing(true);
      setProgress(10);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSessionId(response.data.session_id);
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 500);
    } catch (error) {
      console.error('Upload error:', error);
      setIsProcessing(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || !sessionId) return;
    
    try {
      setIsProcessing(true);
      setProgress(30);
      
      const response = await axios.post('http://localhost:8000/ask', {
        question: question,
        session_id: sessionId
      });
      
      setResults(prev => [...prev, {
        question,
        answer: response.data.answer,
        extractedText: response.data.extracted_text,
        timestamp: new Date(response.data.timestamp).toLocaleString()
      }]);
      
      setQuestion('');
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 500);
    } catch (error) {
      console.error('Question error:', error);
      setIsProcessing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🌸✨ Check your skincare ✨🌸</h1>
        <p>Upload a product label and let's explore its secrets together!</p>
      </header>

      <div className="main-content">
        <div className="content-area">
          {activeTab === 'upload' && (
            <div className="cute-container">
              <div className="upload-section">
                {/* Always render the file input, just keep it hidden */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                
                {!preview ? (
                  <div className="upload-box" onClick={triggerFileInput}>
                    <div className="emoji">📸</div>
                    <p>Tap to upload your product label 🧴✨</p>
                  </div>
                ) : (
                  <div className="image-preview-container">
                    <img src={preview} alt="Uploaded product" className="image-preview" />
                    <button 
                      className="change-image-button"
                      onClick={triggerFileInput}
                    >
                      ✏️ Change Image
                    </button>
                  </div>
                )}
              </div>

              {isProcessing && (
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                  <div className="progress-text">
                    {progress < 30 ? '📤 Uploading your image...' : 
                     progress < 70 ? '🔍 Reading the label...' : 
                     '🧪 Analyzing ingredients...'}
                  </div>
                </div>
              )}

              {sessionId && (
                <div className="question-section">
                  <div className="input-group">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask me anything! (e.g., 'Is this good for sensitive skin? 🌸')"
                      onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                    />
                    <button 
                      onClick={handleAskQuestion}
                      disabled={isProcessing}
                    >
                      💌 Ask
                    </button>
                  </div>
                </div>
              )}

              {results.length > 0 && (
                <div className="results-section">
                  <h3>🌈 Analysis Results</h3>
                  {results.map((result, index) => (
                    <div key={index} className="result-card">
                      <div className="result-question">
                        <span className="emoji-bubble">💭</span> {result.question}
                      </div>
                      <div className="result-answer">
                        <span className="emoji-bubble">💖</span> {result.answer}
                      </div>
                      <div className="result-meta">
                        <span>🕒 {result.timestamp}</span>
                        <button 
                          className="show-text-button"
                          onClick={() => alert(`📜 Extracted Text:\n\n${result.extractedText}`)}
                        >
                          👀 See original text
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-section cute-container">
              <h3>📚 Your History</h3>
              {results.length === 0 ? (
                <p className="empty-state">No questions yet! Ask me something cute~ 🌸</p>
              ) : (
                <div className="history-list">
                  {results.map((result, index) => (
                    <div key={index} className="history-item">
                      <div className="history-question">💬 {result.question}</div>
                      <div className="history-timestamp">⏱️ {result.timestamp}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'recommend' && (
            <div className="recommendation-section cute-container">
              <RecommendationForm 
                sessionId={sessionId} 
                onRecommend={(data) => {
                  setRecommendations(data || { products: [] });
                }} 
              />
              
              {recommendations.products && recommendations.products.length > 0 ? (
                <div className="recommendations-results">
                  <h3>✨ Personalized Recommendations</h3>
                  <div className="recommendation-list">
                    {recommendations.products.map((product, index) => (
                      <div key={index} className="recommendation-card">
                        <h4>{product.name || 'Unnamed Product'}</h4>
                        <p>{product.reason || 'No reason provided'}</p>
                        {product.match_score && (
                          <p className="match-score">Match: {product.match_score}%</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                recommendations.products && <p className="empty-state">No recommendations yet. Fill out the form above!</p>
              )}
            </div>
          )}
        </div>

        <div className="cute-tabs">
          <button 
            className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            📤 Upload
          </button>
          <button 
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📜 History
          </button>
          {sessionId && (
            <button 
              className={`tab-button ${activeTab === 'recommend' ? 'active' : ''}`}
              onClick={() => setActiveTab('recommend')}
            >
              💖 Recommendations
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RecommendationForm({ sessionId, onRecommend }) {
  const [skinType, setSkinType] = useState('');
  const [concerns, setConcerns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skinType) {
      alert('Please select your skin type');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:8000/recommend-products', {
        session_id: sessionId,
        skin_type: skinType,
        concerns: concerns
      });
      
      const formattedData = {
        products: Array.isArray(response.data?.products) 
          ? response.data.products 
          : []
      };
      
      onRecommend(formattedData);
    } catch (error) {
      console.error('Recommendation error:', error);
      alert('Failed to get recommendations. Please try again.');
      onRecommend({ products: [] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="recommendation-form">
      <h3>🌸 Get Personalized Recommendations</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Skin Type:</label>
          <select 
            value={skinType} 
            onChange={(e) => setSkinType(e.target.value)}
            required
          >
            <option value="">Select...</option>
            <option value="dry">Dry</option>
            <option value="oily">Oily</option>
            <option value="combination">Combination</option>
            <option value="sensitive">Sensitive</option>
            <option value="normal">Normal</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Your Concerns:</label>
          <div className="concerns-list">
            {['Acne', 'Aging', 'Dryness', 'Redness', 'Dark Spots', 'Oiliness'].map(concern => (
              <label key={concern}>
                <input 
                  type="checkbox" 
                  checked={concerns.includes(concern)}
                  onChange={() => setConcerns(prev => 
                    prev.includes(concern) 
                      ? prev.filter(c => c !== concern) 
                      : [...prev, concern]
                  )}
                />
                {concern}
              </label>
            ))}
          </div>
        </div>
        
        <button 
          type="submit" 
          className="recommend-button"
          disabled={isLoading}
        >
          {isLoading ? '✨ Loading...' : '✨ Get Recommendations'}
        </button>
      </form>
    </div>
  );
}

export default App;