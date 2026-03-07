import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Kurumsal | Huzur Otomotiv",
    description: "Huzur Otomotiv'in 25 yıllık tecrübesi, misyonu ve vizyonu hakkında bilgi edinin.",
}

export default function Kurumsal() {
    return (
        <div className="pt-32 container">
            <section className="reveal">
                <h1 className="section-title">Hakkımızda <span className="text-neon">Kurumsal</span></h1>

                <div className="glass p-8 mt-8 leading-relaxed">
                    <p className="mb-6">
                        Huzur Otomotiv, 1995 yılından bu yana İstanbul Maltepe'de ticari araç sektöründe hizmet vermektedir.
                        Çeyrek asırlık tecrübemizle, müşterilerimize en kaliteli ve güvenilir araç çözümlerini sunmayı ilke edindik.
                    </p>
                    <p className="mb-6">
                        Portföyümüzde bulunan tüm çekici, tır, kamyon ve hafif ticari araçlar, uzman ekibimiz tarafından titizlikle seçilir
                        ve detaylı ekspertiz kontrollerinden geçirilir. "Huzurla al, huzurla kullan" mottosuyla çıktığımız bu yolda,
                        satış sonrası desteğimizle de her zaman yanınızdayız.
                    </p>

                    <h2 className="text-2xl font-display mt-10 mb-4 text-neon">Vizyonumuz</h2>
                    <p className="mb-6">
                        Türkiye'nin ticari araç pazarında güven ve kalitenin simgesi haline gelerek, sektördeki lider konumumuzu pekiştirmek.
                    </p>

                    <h2 className="text-2xl font-display mt-10 mb-4 text-neon">Misyonumuz</h2>
                    <p>
                        Müşterilerimizin ticari faaliyetlerini en verimli şekilde sürdürebilmeleri için onlara en uygun araç ve finansman
                        çözümlerini profesyonel bir hizmet anlayışıyla sunmak.
                    </p>
                </div>
            </section>

            <section className="py-20 reveal stagger-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="glass p-8">
                        <h3 className="text-4xl font-display text-neon mb-2">25+</h3>
                        <p className="text-secondary uppercase tracking-widest text-sm">Yıllık Tecrübe</p>
                    </div>
                    <div className="glass p-8">
                        <h3 className="text-4xl font-display text-neon mb-2">1000+</h3>
                        <p className="text-secondary uppercase tracking-widest text-sm">Teslim Edilen Araç</p>
                    </div>
                    <div className="glass p-8">
                        <h3 className="text-4xl font-display text-neon mb-2">%100</h3>
                        <p className="text-secondary uppercase tracking-widest text-sm">Müşteri Memnuniyeti</p>
                    </div>
                </div>
            </section>
        </div>
    )
}
