import './Filters.css'

export default function Filters() {
    const categories = [
        { name: 'Çekici', icon: '🚛' },
        { name: 'Kamyon', icon: '🚚' },
        { name: 'Kamyonet', icon: '🚐' },
        { name: 'Dorse', icon: '🚥' },
        { name: 'İş Makinesi', icon: '🏗️' },
    ]

    return (
        <section className="search-filters container">
            <div className="filter-card glass">
                <div className="filter-header">
                    <h2 className="font-display">Hızlı <span className="text-neon">Arama</span></h2>
                    <p>Hayalinizdeki ticari aracı saniyeler içinde bulun.</p>
                </div>

                <div className="filter-body">
                    <div className="filter-group">
                        <label>Marka</label>
                        <select>
                            <option>Tümü</option>
                            <option>Mercedes-Benz</option>
                            <option>Volvo</option>
                            <option>Scania</option>
                            <option>MAN</option>
                            <option>Ford Trucks</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Model Yılı</label>
                        <div className="range-inputs">
                            <input type="number" placeholder="Min" />
                            <input type="number" placeholder="Max" />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Fiyat (TL)</label>
                        <div className="range-inputs">
                            <input type="text" placeholder="Min" />
                            <input type="text" placeholder="Max" />
                        </div>
                    </div>

                    <button className="neon-btn search-btn">Sonuçları Göster</button>
                </div>

                <div className="category-quick-links">
                    {categories.map((cat, idx) => (
                        <button key={idx} className="category-tag">
                            <span className="cat-icon">{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    )
}
