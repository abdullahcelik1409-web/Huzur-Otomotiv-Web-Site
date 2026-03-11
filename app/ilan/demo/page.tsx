import { prisma } from '@/lib/prisma'
import './VehicleDetail.css'

export const dynamic = 'force-dynamic'

export default async function VehicleDetailDemo({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
    const params = await searchParams
    const vehicleId = params?.id
    const id = vehicleId ? parseInt(vehicleId, 10) : NaN

    if (!id || isNaN(id)) {
        return (
            <div className="pt-32 text-center">
                <p>Araç bulunamadı.</p>
            </div>
        )
    }

    const vehicle = await prisma.vehicle.findUnique({
        where: { id }
    })

    if (!vehicle) {
        return (
            <div className="pt-32 text-center">
                <p>Araç bulunamadı.</p>
            </div>
        )
    }


    return (
        <div className="detail-page pt-32 container">
            <div className="detail-grid">
                <div className="detail-gallery">
                    <div className="main-image glass">
                        <img src={vehicle.images?.[0] || '/mercedes_actros_listing_placeholder.png'} alt={vehicle.title} />
                    </div>
                    <div className="thumbnails">
                        {(vehicle.images || []).map((img: string, idx: number) => (
                            <div key={idx} className="thumb glass">
                                <img src={img} alt="thumbnail" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="detail-info">
                    <h1 className="detail-title">{vehicle.title}</h1>
                    <div className="detail-price-box bg-neon">
                        <span className="price">{vehicle.price?.toLocaleString?.() ?? vehicle.price} TL</span>
                    </div>

                    <div className="spec-table mt-8">
                        <div className="spec-item">
                            <span>İlan No</span>
                            <strong>{vehicle.id}</strong>
                        </div>
                        <div className="spec-item">
                            <span>Model Yılı</span>
                            <strong>{vehicle.year}</strong>
                        </div>
                        <div className="spec-item">
                            <span>Kilometre</span>
                            <strong>{vehicle.km?.toLocaleString?.() ?? vehicle.km} km</strong>
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

