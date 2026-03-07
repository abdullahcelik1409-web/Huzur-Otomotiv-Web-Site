import { Metadata } from 'next'
import './VehicleDetail.css'

export const metadata: Metadata = {
    title: "2022 Mercedes-Benz Actros 1845 LS | Huzur Otomotiv İlan Detayı",
    description: "Hatassız, boyasız, 145.000 km'de Mercedes-Benz Actros 1845 LS. Detaylar ve fiyat için tıklayın.",
}

export default function VehicleDetailDemo() {
    const vehicle = {
        title: '2022 Mercedes-Benz Actros 1845 LS',
        price: '3.450.000 TL',
        year: 2022,
        km: '145.000',
        fuel: 'Dizel',
        transmission: 'Otomatik',
        color: 'Gümüş Gri',
        description: 'İlk sahibinden, yetkili servis bakımlı, hatasız boyasız Mercedes-Benz Actros. Ağır yük görmemiş, sadece uzun yolda çalışmıştır. Lastik durumu %90. ADR mevcut.',
        images: [
            '/mercedes_actros_listing_placeholder.png',
            '/hero_truck_premium.png',
            '/volvo_fh_listing_placeholder.png'
        ]
    }

    return (
        <div className="detail-page pt-32 container">
            <div className="detail-grid">
                <div className="detail-gallery">
                    <div className="main-image glass">
                        <img src={vehicle.images[0]} alt={vehicle.title} />
                    </div>
                    <div className="thumbnails">
                        {vehicle.images.map((img, idx) => (
                            <div key={idx} className="thumb glass">
                                <img src={img} alt="thumbnail" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="detail-info">
                    <h1 className="detail-title">{vehicle.title}</h1>
                    <div className="detail-price-box bg-neon">
                        <span className="price">{vehicle.price}</span>
                    </div>

                    <div className="spec-table mt-8">
                        <div className="spec-item">
                            <span>İlan No</span>
                            <strong>123456789</strong>
                        </div>
                        <div className="spec-item">
                            <span>Model Yılı</span>
                            <strong>{vehicle.year}</strong>
                        </div>
                        <div className="spec-item">
                            <span>Kilometre</span>
                            <strong>{vehicle.km} km</strong>
                        </div>
                        <div className="spec-item">
                            <span>Yakıt Tipi</span>
                            <strong>{vehicle.fuel}</strong>
                        </div>
                        <div className="spec-item">
                            <span>Vites</span>
                            <strong>{vehicle.transmission}</strong>
                        </div>
                        <div className="spec-item">
                            <span>Renk</span>
                            <strong>{vehicle.color}</strong>
                        </div>
                    </div>

                    <div className="detail-actions mt-10">
                        <button className="neon-btn w-full py-4 text-xl">Şimdi Ara: +90 (216) 123 45 67</button>
                        <button className="glass-btn w-full mt-4 py-4">WhatsApp ile Sorun</button>
                    </div>
                </div>
            </div>

            <div className="detail-description mt-20">
                <h2 className="section-title">Açıklama</h2>
                <div className="description-content glass p-8 mt-8">
                    <p>{vehicle.description}</p>
                </div>
            </div>
        </div>
    )
}
