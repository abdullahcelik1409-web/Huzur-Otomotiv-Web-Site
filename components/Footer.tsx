import Link from 'next/link'
import './Footer.css'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer">
            <div className="container footer-grid">
                <div className="footer-info">
                    <Link href="/" className="footer-logo">
                        HUZUR <span className="text-neon">OTOMOTİV</span>
                    </Link>
                    <p className="footer-desc">
                        1995'ten beri İstanbul Maltepe'de ticari araç sektöründe güvenin ve kalitenin adresi.
                        Geniş araç portföyümüz ve profesyonel ekibimizle hizmetinizdeyiz.
                    </p>
                </div>

                <div className="footer-links">
                    <h3>Hızlı Menü</h3>
                    <ul>
                        <li><Link href="/">Ana Sayfa</Link></li>
                        <li><Link href="/ilanlar">İlanlar</Link></li>
                        <li><Link href="/kurumsal">Kurumsal</Link></li>
                        <li><Link href="/iletisim">İletişim</Link></li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h3>İletişim</h3>
                    <ul>
                        <li><span className="text-neon">Adres:</span> Feyzullah Mah. Maltepe, İstanbul</li>
                        <li><span className="text-neon">Telefon:</span> +90 (216) 123 45 67 / +90 532 349 71 12</li>
                        <li><span className="text-neon">E-posta:</span> info@huzurotomotiv.com</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {currentYear} Huzur Otomotiv. Tüm Hakları Saklıdır.</p>
                </div>
            </div>
        </footer>
    )
}
