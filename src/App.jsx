import { useState } from 'react'
import { analyzeClothing } from './geminiService'
import './App.css'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [detectedCategories, setDetectedCategories] = useState([])
  const [error, setError] = useState(null)

  const handleReset = () => {
    setSelectedFile(null)
    setResults(null)
    setAnalysisProgress(0)
    setDetectedCategories([])
    setIsAnalyzing(false)
    setError(null)
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(URL.createObjectURL(file))
      setIsAnalyzing(true)
      setAnalysisProgress(0)
      setDetectedCategories([])
      setResults(null)
      setError(null)

      // Simulate progress while waiting for API
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 95) return 95
          return prev + 5
        })
      }, 500)

      try {
        const clothingResults = await analyzeClothing(file)
        setResults(clothingResults)
        setAnalysisProgress(100)
        setDetectedCategories(['анализ завершен'])
      } catch (err) {
        console.error(err)
        setError("Ошибка при обращении к Gemini. Проверьте API ключ в .env")
      } finally {
        clearInterval(progressInterval)
        setIsAnalyzing(false)
      }
    }
  }

  return (
    <div className="app-wrapper">
      <header className="glass">
        <div className="container header-content">
          <div className="logo">
            <span className="logo-icon">👗</span>
            <h1>Trend Decoder</h1>
          </div>
          <nav>
            <ul>
              <li><a href="#how-it-works">Как это работает</a></li>
              <li><a href="#about">О нас</a></li>
              <li><button className="btn-primary">Войти</button></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-background-blobs">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
          </div>
          <div className="container hero-content animate-fade-in">
            <h2 className="hero-title">Раскройте секреты любого стиля</h2>
            <p className="hero-subtitle">Загрузите фото образа, и наш ИИ найдет каждую вещь за считанные секунды.</p>
            
            {error && <p className="error-message">{error}</p>}
            
            <div className="upload-container glass">
              {!selectedFile ? (
                <label className="upload-label">
                  <div className="upload-icon">📸</div>
                  <span>Загрузите фото для анализа</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
                </label>
              ) : (
                <div className="preview-area">
                  <img src={selectedFile} alt="Preview" className="preview-img" />
                  {!isAnalyzing && (
                    <button className="btn-reset" onClick={handleReset}>
                      <span>✕</span> Отменить
                    </button>
                  )}
                  {isAnalyzing && (
                    <div className="analysis-overlay">
                      <div className="analysis-content">
                        <div className="analysis-scanner"></div>
                        <div className="progress-bar-container">
                          <div className="progress-bar-fill" style={{ width: `${analysisProgress}%` }}></div>
                        </div>
                        <p className="analysis-status">Анализируем ваш стиль: {analysisProgress}%</p>
                        <div className="detection-tags">
                          {detectedCategories.map((cat, idx) => (
                            <div key={idx} className="tag-plaque animate-pop">
                              {cat}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {results && (
          <section className="results-section container animate-fade-in">
            <h3 className="section-title">Найденные товары</h3>
            <div className="results-grid">
              {results.map(item => (
                <div key={item.id} className="result-card glass">
                  <div className="card-info">
                    <h4>{item.name}</h4>
                    <p className="brand">{item.brand}</p>
                    <p className="price">{item.price}</p>
                    <a href={item.link} className="btn-buy">Купить сейчас</a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="container">
        <p>&copy; 2026 Trend Decoder. Все права защищены. Сделано с любовью к моде.</p>
      </footer>
    </div>
  )
}

export default App
