'use client'

import { useState, useEffect } from 'react'
import Filters from '@/components/Filters'
import VehicleCard from '@/components/VehicleCard'

export default function Ilanlar() {
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/cars.json')
            .then(res => res.json())
            .then(data => {
                setVehicles(data.cars || [])
                setLoading(false)
            })
            .catch(err => {
                console.error('Error fetching cars:', err)
                setLoading(false)
            })
    }, [])

    return (
        <div className="listings-page pt-32">
            <div className="container">
                <div className="page-header mb-12">
                    <h1 className="section-title">Tüm <span className="text-neon">İlanlar</span></h1>
                    <p style={{ color: '#e0e0e0', fontSize: '1.1rem', fontWeight: 500 }}>
                        {loading ? 'Yükleniyor...' : `Aradığınız kriterlere uygun ${vehicles.length} araç bulundu.`}
                    </p>
                </div>

                <Filters />

                <div className="listings-grid mt-16 py-10">
                    {vehicles.length > 0 ? (
                        vehicles.map((vehicle: any) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))
                    ) : (
                        !loading && (
                            <div className="no-results text-center py-20">
                                <h3 className="text-xl">Henüz bir ilan eklenmemiş.</h3>
                                <p className="text-secondary">Daha sonra tekrar kontrol edin veya bizimle iletişime geçin.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}
