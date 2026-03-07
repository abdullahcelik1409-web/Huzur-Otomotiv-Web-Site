import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "İletişim | Huzur Otomotiv",
    description: "Huzur Otomotiv Maltepe şubesi ile iletişime geçin. Adres, telefon ve e-posta bilgileri.",
}

export default function Iletisim() {
    return (
        <div className="pt-32 container">
            <section className="reveal">
                <h1 className="section-title">Bize <span className="text-neon">Ulaşın</span></h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
                    <div className="contact-info">
                        <div className="glass p-8">
                            <h2 className="text-2xl font-display mb-8 text-neon">İletişim Bilgileri</h2>

                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <span className="text-2xl">📍</span>
                                    <div>
                                        <strong className="block text-neon">Adres</strong>
                                        <p className="text-secondary">Feyzullah Mah. Maltepe Plaza No:123 Maltepe, İstanbul</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-2xl">📞</span>
                                    <div>
                                        <strong className="block text-neon">Telefon</strong>
                                        <p className="text-secondary">+90 (216) 123 45 67</p>
                                        <p className="text-secondary">+90 532 349 71 12</p>
                                        <p className="text-secondary">+90 (532) 987 65 43</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-2xl">📧</span>
                                    <div>
                                        <strong className="block text-neon">E-posta</strong>
                                        <p className="text-secondary">info@huzurotomotiv.com</p>
                                        <p className="text-secondary">sales@huzurotomotiv.com</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-2xl">🕒</span>
                                    <div>
                                        <strong className="block text-neon">Çalışma Saatleri</strong>
                                        <p className="text-secondary">Pazartesi - Cumartesi: 09:00 - 19:00</p>
                                        <p className="text-secondary">Pazar: Kapalı</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="contact-form reveal stagger-1">
                        <div className="glass p-8">
                            <h2 className="text-2xl font-display mb-8 text-neon">Mesaj Gönderin</h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Ad Soyad</label>
                                    <input type="text" className="w-full bg-tertiary border border-border-color rounded-lg p-3 outline-none focus:border-neon" placeholder="Adınız Soyadınız" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">E-posta</label>
                                    <input type="email" className="w-full bg-tertiary border border-border-color rounded-lg p-3 outline-none focus:border-neon" placeholder="E-posta adresiniz" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Konu</label>
                                    <select className="w-full bg-tertiary border border-border-color rounded-lg p-3 outline-none focus:border-neon">
                                        <option>Araç Hakkında Bilgi</option>
                                        <option>Finansman Seçenekleri</option>
                                        <option>Takas Teklifi</option>
                                        <option>Diğer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Mesajınız</label>
                                    <textarea rows={4} className="w-full bg-tertiary border border-border-color rounded-lg p-3 outline-none focus:border-neon" placeholder="Nasıl yardımcı olabiliriz?"></textarea>
                                </div>
                                <button type="submit" className="neon-btn w-full py-4 mt-4">Gönder</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Placeholder */}
            <section className="mt-20 reveal">
                <div className="glass h-[400px] rounded-2xl flex items-center justify-center overflow-hidden">
                    <p className="text-secondary">Google Haritalar Entegrasyonu Bu Alanda Yer Alacaktır</p>
                </div>
            </section>
        </div>
    )
}
