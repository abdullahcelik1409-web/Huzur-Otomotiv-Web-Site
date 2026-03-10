'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function VehicleDetail() {
    const params = useParams()
    const [vehicle, setVehicle] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [activeIndex, setActiveIndex] = useState(0)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)

    useEffect(() => {
        // Ensure page is reset to top (no leftover horizontal scroll) when showing details
        window.scrollTo({ top: 0, left: 0 })
    }, [])

    useEffect(() => {
        // Prevent page shift/scroll when lightbox is open
        document.body.style.overflow = isLightboxOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isLightboxOpen])

    useEffect(() => {
        fetch('/api/vehicles')
            .then(res => res.json())
            .then(data => {
                const found = (data.cars || []).find((c: any) => c.slug === params.slug)
                setVehicle(found)
                setLoading(false)
            })
            .catch(err => {
                console.error('Error fetching vehicle details:', err)
                setLoading(false)
            })
    }, [params.slug])

    const nextImage = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!vehicle) return;
        setActiveIndex((prev) => (prev + 1) % vehicle.images.length)
    }

    const prevImage = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!vehicle) return;
        setActiveIndex((prev) => (prev === 0 ? vehicle.images.length - 1 : prev - 1))
    }

    if (loading) return <div className="pt-32 text-center">Yükleniyor...</div>
    if (!vehicle) return <div className="pt-32 text-center">Araç bulunamadı.</div>

    const renderThumbnails = () => {
        const totalImages = vehicle.images.length;
        const maxThumbs = 4;
        const displayedThumbs = vehicle.images.slice(0, maxThumbs);
        const remainingCount = totalImages - maxThumbs;

        return displayedThumbs.map((img: string, idx: number) => {
            const isLastBox = idx === maxThumbs - 1 && remainingCount > 0;
            return (
                <div
                    key={idx}
                    className={`thumb glass ${activeIndex === idx ? 'active-thumb' : ''}`}
                    onClick={() => {
                        if (isLastBox) {
                            setIsLightboxOpen(true);
                            setActiveIndex(idx);
                        } else {
                            setActiveIndex(idx);
                        }
                    }}
                >
                    <img src={img} alt={`${vehicle.title} - ${idx + 1}`} />
                    {isLastBox && (
                        <div className="thumb-overlay">
                            <span>+{remainingCount}</span>
                        </div>
                    )}
                </div>
            )
        })
    }

    return (
        <div className="vehicle-detail-page pb-20" style={{ paddingTop: '120px' }}>
            <div className="container">
                <Link href="/ilanlar" className="back-link mb-8 inline-block text-secondary hover:text-neon transition-colors">
                    ← İlanlara Dön
                </Link>

                <div className="detail-grid">
                    <div className="detail-gallery">
                        <div className="main-image-container group">
                            {/* Main Image */}
                            <div className="main-image">
                                <img
                                    src={vehicle.images[activeIndex]}
                                    alt={`${vehicle.title} Main`}
                                    className="main-img"
                                />
                            </div>

                            {/* Click Area for Background (to open Lightbox) */}
                            <div
                                className="main-image-click-area"
                                onClick={() => setIsLightboxOpen(true)}
                            ></div>

                            {/* Left Arrow */}
                            <button
                                className="gallery-nav-btn prev-btn"
                                onClick={prevImage}
                                aria-label="Previous image"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                            </button>

                            {/* Right Arrow */}
                            <button
                                className="gallery-nav-btn next-btn"
                                onClick={nextImage}
                                aria-label="Next image"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                            </button>

                            {/* Enlarge Button */}
                            <button
                                type="button"
                                className="enlarge-btn"
                                onClick={() => setIsLightboxOpen(true)}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                                Tam Ekran
                            </button>

                            {/* Image Counter Badge */}
                            <div className="image-counter">
                                {activeIndex + 1} / {vehicle.images.length}
                            </div>
                        </div>

                        <div className="thumbnail-grid mt-4">
                            {renderThumbnails()}
                        </div>
                    </div>

                    <div className="detail-info glass p-8">
                        <h1 className="text-4xl font-display mb-4">{vehicle.title}</h1>
                        <div className="price-tag text-3xl font-bold text-neon mb-8">
                            {vehicle.price.toLocaleString()} {vehicle.currency || 'TL'}
                        </div>

                        <div className="specs-table">

                            <div className="spec-row">
                                <span>Marka</span>
                                <strong>{vehicle.brand}</strong>
                            </div>
                            <div className="spec-row">
                                <span>Model</span>
                                <strong>{vehicle.model}</strong>
                            </div>
                            <div className="spec-row">
                                <span>Paket</span>
                                <strong>{vehicle.package || '-'}</strong>
                            </div>
                            <div className="spec-row">
                                <span>Yıl</span>
                                <strong>{vehicle.year}</strong>
                            </div>
                            <div className="spec-row">
                                <span>Kilometre</span>
                                <strong>{vehicle.km.toLocaleString()} km</strong>
                            </div>
                            <div className="spec-row">
                                <span>Yakıt</span>
                                <strong>{vehicle.fuel}</strong>
                            </div>
                            <div className="spec-row">
                                <span>Vites</span>
                                <strong>{vehicle.transmission}</strong>
                            </div>
                        </div>

                        <div className="contact-actions mt-12 grid grid-cols-2 sm:grid-cols-2 gap-4">
                            <a href="tel:+905323497112" className="neon-btn text-center flex items-center justify-center p-4">Hemen Ara</a>
                            <a href={`https://wa.me/905323497112?text=${vehicle.title} ilanı hakkında bilgi alabilir miyim?`} className="neon-btn text-center flex items-center justify-center p-4" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                        </div>
                    </div>
                </div>

                {/* Full-width Description Section */}
                <div className="description-card mt-12">
                    <h3 className="description-title">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-neon)" }}>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        Araç Açıklaması
                    </h3>
                    <div className="description-content text-secondary leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                        {vehicle.description}
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div
                    className="lightbox-overlay"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <div
                        className="lightbox-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="lightbox-close-btn"
                            onClick={() => setIsLightboxOpen(false)}
                            aria-label="Close fullscreen"
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        <button
                            className="lightbox-nav-btn prev"
                            onClick={prevImage}
                            aria-label="Previous image"
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                        </button>

                        <img
                            src={vehicle.images[activeIndex]}
                            alt={`${vehicle.title} Fullscreen`}
                            className="lightbox-img"
                            draggable={false}
                        />

                        <button
                            className="lightbox-nav-btn next"
                            onClick={nextImage}
                            aria-label="Next image"
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                        </button>

                        <div className="lightbox-counter">
                            {activeIndex + 1} <span>/</span> {vehicle.images.length}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .detail-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
                    gap: 3rem;
                    width: 100%;
                }
                .main-image-container {
                    position: relative;
                    width: 100%;
                    border-radius: 20px;
                    overflow: hidden;
                    background: rgba(0,0,0,0.2);
                }
                .main-image {
                    width: 100%;
                    aspect-ratio: 16/10;
                }
                .main-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                .main-image-container:hover .main-img {
                    transform: scale(1.02);
                }
                .main-image-click-area {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    cursor: pointer;
                }
                .thumbnail-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                }
                @media (max-width: 576px) {
                    .thumbnail-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 0.5rem;
                    }
                }
                .thumb {
                    position: relative;
                    aspect-ratio: 16/10;
                    border-radius: 12px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 2px solid transparent;
                    min-width: 0;
                }
                .thumb:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
                }
                .thumb:hover img {
                    transform: scale(1.05);
                }
                .active-thumb {
                    border-color: var(--neon-green);
                    box-shadow: 0 0 15px rgba(204, 255, 0, 0.15);
                }
                .thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                .thumb-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.7);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: white;
                    border-radius: 10px;
                }
                .specs-table {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .spec-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 1rem;
                    padding-bottom: 0.8rem;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .spec-row span {
                    color: var(--text-secondary);
                    flex-shrink: 0;
                }
                .spec-row strong {
                    text-align: right;
                    overflow-wrap: break-word;
                    word-break: break-all;
                }
                
                /* Description Card */
                .description-card {
                    background: rgba(20, 20, 20, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    padding: 2rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .description-card:hover {
                    border-color: rgba(204, 255, 0, 0.2);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                .description-title {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1.5rem;
                    font-family: var(--font-display);
                    margin-bottom: 1.5rem;
                    color: white;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    padding-bottom: 1rem;
                }
                .description-content {
                    font-size: 1.05rem;
                }
                
                /* Gallery Overlay UI Elements */
                .gallery-nav-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: rgba(0, 0, 0, 0.6);
                    color: white;
                    opacity: 0;
                    border: none;
                    cursor: pointer;
                    z-index: 20;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .main-image-container:hover .gallery-nav-btn {
                    opacity: 1;
                }
                .gallery-nav-btn:hover {
                    background: var(--accent-neon);
                    color: black;
                }
                .prev-btn { left: 1rem; }
                .next-btn { right: 1rem; }

                .enlarge-btn {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    opacity: 0;
                    z-index: 30;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .main-image-container:hover .enlarge-btn {
                    opacity: 1;
                }
                .enlarge-btn:hover {
                    background: var(--accent-neon);
                    color: black;
                }

                .image-counter {
                    position: absolute;
                    bottom: 1rem;
                    right: 1rem;
                    background: rgba(0, 0, 0, 0.6);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 500;
                    backdrop-filter: blur(8px);
                    z-index: 10;
                    pointer-events: none;
                }

                /* Lightbox Modal UI */
                .lightbox-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    background: rgba(0, 0, 0, 0.98);
                    backdrop-filter: blur(12px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    overflow: hidden;
                }
                .lightbox-content {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    box-sizing: border-box;
                }

                .lightbox-close-btn {
                    position: absolute;
                    top: 0.75rem;
                    right: 0.75rem;
                    color: rgba(255,255,255,0.6);
                    background: none;
                    border: none;
                    padding: 0.5rem;
                    cursor: pointer;
                    z-index: 50;
                    transition: color 0.3s ease;
                }
                .lightbox-close-btn:hover { color: white; }

                .lightbox-nav-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 54px;
                    height: 54px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.12);
                    color: rgba(255, 255, 255, 0.65);
                    border: none;
                    cursor: pointer;
                    z-index: 50;
                    transition: all 0.25s ease;
                }
                .lightbox-nav-btn:hover {
                    background: var(--accent-neon);
                    color: black;
                }
                .lightbox-nav-btn.prev { left: 0.75rem; }
                .lightbox-nav-btn.next { right: 0.75rem; }

                .lightbox-img {
                    max-width: 100%;
                    max-height: 100%;
                    width: auto !important;
                    height: auto !important;
                    object-fit: contain;
                    border-radius: 8px;
                    user-select: none;
                    filter: drop-shadow(0 25px 25px rgba(0,0,0,0.5));
                }
                .lightbox-counter {
                    position: absolute;
                    bottom: 0.75rem;
                    left: 50%;
                    transform: translateX(-50%);
                    color: rgba(255,255,255,0.8);
                    letter-spacing: 0.1em;
                    font-size: 0.9rem;
                    font-weight: 500;
                    background: rgba(0,0,0,0.45);
                    padding: 0.5rem 1rem;
                    border-radius: 9999px;
                    backdrop-filter: blur(8px);
                }
                .lightbox-counter span { margin: 0 0.5rem; color: rgba(255,255,255,0.35); }

                @media (max-width: 992px) {
                    .detail-grid {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }
                    .gallery-nav-btn, .enlarge-btn {
                        opacity: 1;
                    }
                    .gallery-nav-btn {
                        width: 36px;
                        height: 36px;
                        transition: none;
                        will-change: auto;
                    }
                    .gallery-nav-btn svg {
                        width: 18px;
                        height: 18px;
                    }
                    .prev-btn { left: 0.5rem; }
                    .next-btn { right: 0.5rem; }
                    .main-image-container {
                        border-radius: 12px;
                    }
                    .main-image-container:hover .main-img {
                        transform: none;
                    }
                    .lightbox-nav-btn {
                        width: 44px;
                        height: 44px;
                    }
                    .lightbox-nav-btn.prev { left: 0.5rem; }
                    .lightbox-nav-btn.next { right: 0.5rem; }
                    .lightbox-close-btn {
                        top: 1rem;
                        right: 1rem;
                    }
                    .lightbox-content {
                        width: 100%;
                        height: 100%;
                        max-width: 100%;
                        max-height: 100%;
                        padding: 0;
                    }
                    .description-card {
                        padding: 1.25rem;
                    }
                }
            `}</style>
        </div>
    )
}

