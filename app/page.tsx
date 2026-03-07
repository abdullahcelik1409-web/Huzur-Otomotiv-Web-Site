'use client'

import { useState, useEffect } from 'react'
import Hero from '@/components/Hero'
import Filters from '@/components/Filters'
import Features from '@/components/Features'
import VehicleCard from '@/components/VehicleCard'

export default function Home() {
  const [featuredVehicles, setFeaturedVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/cars.json')
      .then(res => res.json())
      .then(data => {
        const featured = (data.cars || []).filter((car: any) => car.featured)
        setFeaturedVehicles(featured)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching featured cars:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="home-page">
      <Hero />
      <Filters />

      {featuredVehicles.length > 0 && (
        <section className="featured-listings container py-20 reveal">
          <div className="section-header mb-16">
            <h2 className="section-title">Öne Çıkan <span className="text-neon">İlanlar</span></h2>
            <p className="text-secondary">Huzur Otomotiv güvencesiyle güncel stoklarımız.</p>
          </div>

          <div className="listings-grid">
            {featuredVehicles.map((vehicle: any, idx) => (
              <div key={vehicle.id} className={`reveal stagger-${idx + 1}`}>
                <VehicleCard vehicle={vehicle} />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="reveal">
        <Features />
      </div>

      <section className="cta-section container py-20 reveal">
        <div className="cta-card bg-neon">
          <div className="cta-content">
            <h2>Hemen Ticari Araç Sahibi Olun</h2>
            <p>Size en uygun ödeme seçenekleri ve takas imkanları için iletişime geçin.</p>
          </div>
          <a href="tel:+905323497112" className="glass-btn dark">Hemen Arayın</a>
        </div>
      </section>
    </div>
  )
}
