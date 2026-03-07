import './Hero.css'
import Link from 'next/link'

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-overlay"></div>
            <div className="container hero-content">
                <h1 className="hero-title">
                    Geleceğin <span className="text-neon">Ticari Araç</span> Deneyimi
                </h1>
                <p className="hero-subtitle">
                    Huzur Otomotiv ile güvenilirlik ve performansı keşfedin.
                    En kaliteli çekici, kamyon ve hafif ticari araçlar burada.
                </p>
                <div className="hero-btns">
                    <Link href="/ilanlar" className="neon-btn">İlanları İncele</Link>
                    <Link href="/iletisim" className="glass-btn">Bizimle İletişime Geçin</Link>
                </div>
            </div>

            <div className="hero-stats container">
                <div className="stat-item">
                    <span className="stat-number">25+</span>
                    <span className="stat-label">Yıllık Tecrübe</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Mutlu Müşteri</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <span className="stat-number">50+</span>
                    <span className="stat-label">Güncel İlan</span>
                </div>
            </div>
        </section>
    )
}
