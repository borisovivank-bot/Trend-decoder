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
          <section className="results-section container animate-fade-in" id="results">
            <h3 className="section-title">Найденные товары</h3>
            <div className="results-grid">
              {results.map(item => (
                <div key={item.id} className="result-card glass">
                  <div className="card-info">
                    <h4>{item.name}</h4>
                    <p className="brand">{item.brand}</p>
                    <p className="price">{item.price}</p>
                    <a href={item.link} className="btn-buy" target="_blank" rel="noopener noreferrer">Купить сейчас</a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="how-it-works container" id="how-it-works">
          <h3 className="section-title">Как это работает</h3>
          <div className="steps-grid">
            <div className="step-card glass">
              <div className="step-number">01</div>
              <h4>Загрузка</h4>
              <p>Просто загрузите фотографию образа, который вам понравился.</p>
            </div>
            <div className="step-card glass">
              <div className="step-number">02</div>
              <h4>ИИ Анализ</h4>
              <p>Наш Gemini ИИ мгновенно распознает все элементы одежды на фото.</p>
            </div>
            <div className="step-card glass">
              <div className="step-number">03</div>
              <h4>Поиск и Покупка</h4>
              <p>Получите ссылки на похожие товары и узнайте примерную стоимость.</p>
            </div>
          </div>
        </section>

        <section className="about-section glass container" id="about">
          <div className="about-content">
            <h3 className="section-title">О проекте Trend Decoder</h3>
            <p>Trend Decoder — это ваш персональный стилист на базе искусственного интеллекта. Мы верим, что мода должна быть доступной, а поиск идеального образа — простым и вдохновляющим.</p>
            <p>Наша миссия — помочь вам найти вещи, которые вы видите на улицах, в соцсетях или журналах, используя новейшие технологии компьютерного зрения от Google.</p>
          </div>
        </section>
      </main>

      <footer className="container">
        <p>&copy; 2026 Trend Decoder. Все права защищены. Сделано с любовью к моде.</p>
      </footer>
    </div>
  )
}

export default App
