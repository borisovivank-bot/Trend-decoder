import { useState } from 'react'
import './App.css'
import heroBg from './assets/hero-bg.png'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(URL.createObjectURL(file))
      setIsAnalyzing(true)
      // Simulate AI analysis
      setTimeout(() => {
        setIsAnalyzing(false)
        setResults([
          { id: 1, name: 'Кашемировое пальто', brand: 'Loro Piana', price: '245,000 ₽', link: '#' },
          { id: 2, name: 'Шелковая блуза', brand: 'Brunello Cucinelli', price: '89,000 ₽', link: '#' },
          { id: 3, name: 'Брюки прямого кроя', brand: 'Prada', price: '110,000 ₽', link: '#' }
        ])
      }, 3000)
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
        <section className="hero-section" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${heroBg})` }}>
          <div className="container hero-content animate-fade-in">
            <h2 className="hero-title">Раскройте секреты любого стиля</h2>
            <p className="hero-subtitle">Загрузите фото образа, и наш ИИ найдет каждую вещь за считанные секунды.</p>
            
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
                  {isAnalyzing && (
                    <div className="analysis-overlay">
                      <div className="loader"></div>
                      <p>Анализируем ваш стиль...</p>
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
