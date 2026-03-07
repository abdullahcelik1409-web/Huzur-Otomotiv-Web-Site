import Link from 'next/link'
import './VehicleCard.css'

interface VehicleProps {
    id: number
    slug: string
    title: string
    brand: string
    year: number
    price: number
    km: number
    images: string[]
    featured?: boolean
}

export default function VehicleCard({ vehicle }: { vehicle: VehicleProps }) {
    const mainImage = vehicle.images && vehicle.images.length > 0
        ? vehicle.images[0]
        : '/mercedes_actros_listing_placeholder.png'

    return (
        <div className={`vehicle-card ${vehicle.featured ? 'featured' : ''}`}>
            <div className="card-image">
                <img src={mainImage} alt={vehicle.title} />
                <div className="card-badge bg-neon">
                    {vehicle.year}
                </div>
            </div>

            <div className="card-content">
                <h3 className="card-title">{vehicle.title}</h3>

                <div className="card-meta">
                    <span>📅 {vehicle.year}</span>
                    <span>🛣️ {vehicle.km.toLocaleString()} km</span>
                </div>

                <div className="card-footer">
                    <div className="card-price">
                        <span className="price-value">{vehicle.price.toLocaleString()}</span>
                        <span className="price-currency"> TL</span>
                    </div>
                    <Link href={`/ilanlar/${vehicle.slug}`} className="details-link">
                        Detaylar <span className="arrow">→</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
