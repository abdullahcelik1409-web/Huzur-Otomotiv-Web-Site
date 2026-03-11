import { Metadata } from 'next'
import './iletisim.css'

export const metadata: Metadata = {
    title: "İletişim | Huzur Otomotiv",
    description: "Huzur Otomotiv Maltepe şubesi ile iletişime geçin. Adres, telefon ve e-posta bilgileri.",
}

export default function Iletisim() {
    return (
        <main className="contact-page">
            <div className="contact-container container">
                <header className="contact-header reveal">
                    <h1 className="contact-title">Bize <span className="text-neon">Ulaşın</span></h1>
                    <div className="title-underline"></div>
                </header>

                <div className="contact-grid">
                    <aside className="info-card reveal stagger-1">
                        <h2 className="card-title-modern">İletişim Bilgileri</h2>
                        
                        <div className="contact-list">
                            <div className="contact-item">
                                <div className="item-icon">
                                    <span className="material-symbols-outlined">location_on</span>
                                </div>
                                <div className="item-content">
                                    <h3>Adres</h3>
                                    <p>Feyzullah Mah. Maltepe Plaza No:123 Maltepe, İstanbul</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="item-icon">
                                    <span className="material-symbols-outlined">call</span>
                                </div>
                                <div className="item-content">
                                    <h3>Telefon</h3>
                                    <p>+90 (216) 123 45 67</p>
                                    <p>+90 532 349 71 12</p>
                                    <p>+90 (532) 987 85 43</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="item-icon">
                                    <span className="material-symbols-outlined">mail</span>
                                </div>
                                <div className="item-content">
                                    <h3>E-posta</h3>
                                    <p>info@huzurotomotiv.com</p>
                                    <p>sales@huzurotomotiv.com</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="item-icon">
                                    <span className="material-symbols-outlined">schedule</span>
                                </div>
                                <div className="item-content">
                                    <h3>Çalışma Saatleri</h3>
                                    <p>Pazartesi - Cumartesi: 09:00 - 19:00</p>
                                    <p>Pazar: Kapalı</p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <section className="form-card reveal stagger-2">
                        <h2 className="card-title-modern">Mesaj Gönderin</h2>
                        <form className="contact-form-modern">
                            <div className="form-group-modern">
                                <label>Ad Soyad</label>
                                <input type="text" className="input-modern" placeholder="Adınız Soyadınız" required />
                            </div>
                            
                            <div className="form-group-modern">
                                <label>E-posta</label>
                                <input type="email" className="input-modern" placeholder="E-posta adresiniz" required />
                            </div>

                            <div className="form-group-modern">
                                <label>Konu</label>
                                <select className="select-modern">
                                    <option>Araç Hakkında Bilgi</option>
                                    <option>Finansman Seçenekleri</option>
                                    <option>Takas Teklifi</option>
                                    <option>Diğer</option>
                                </select>
                            </div>

                            <div className="form-group-modern">
                                <label>Mesajınız</label>
                                <textarea className="textarea-modern" rows={4} placeholder="Nasıl yardımcı olabiliriz?" required></textarea>
                            </div>

                            <button type="submit" className="neon-btn submit-btn-modern">GÖNDER</button>
                        </form>
                    </section>
                </div>

                {/* Map Section */}
                <section className="mt-20 reveal stagger-3">
                    <div className="info-card" style={{ padding: '0', overflow: 'hidden', height: '400px' }}>
                        <div className="flex items-center justify-center h-full bg-tertiary">
                            <p className="text-secondary">Google Haritalar Entegrasyonu Bu Alanda Yer Alacaktır</p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
