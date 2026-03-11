import './Features.css'

export default function Features() {
    const advantages = [
        { title: '25 Yıl Güven', desc: 'Sektördeki köklü geçmişimizle size en güvenilir araçları sunuyoruz.', icon: 'verified' },
        { title: 'Uzman Ekspertiz', desc: 'Her aracımız uzman ekibimiz tarafından detaylı kontrolden geçmektedir.', icon: 'manage_search' },
        { title: 'Hızlı Finansman', desc: 'Ticari araç alımlarında size özel finansman çözümleri sunuyoruz.', icon: 'payments' },
        { title: 'Geniş Portföy', desc: 'Kamyondan tırra kadar her ihtiyaca uygun geniş araç stoğu.', icon: 'local_shipping' },
    ]

    return (
        <section className="features container py-20">
            <div className="section-header text-center mb-16">
                <h2 className="section-title text-center">Neden <span className="text-neon">Huzur Otomotiv?</span></h2>
                <p className="text-secondary">Ticari araç dünyasında çözüm ortağınız.</p>
            </div>

            <div className="features-grid">
                {advantages.map((item, idx) => (
                    <div key={idx} className="feature-card glass">
                        <div className="feature-icon">
                            <span className="material-symbols-outlined">{item.icon}</span>
                        </div>
                        <h3 className="feature-title">{item.title}</h3>
                        <p className="feature-desc">{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
