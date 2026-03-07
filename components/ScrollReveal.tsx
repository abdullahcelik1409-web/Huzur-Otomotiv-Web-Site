'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollReveal() {
    const pathname = usePathname()

    useEffect(() => {
        // Immediate check + delayed check for Next.js hydration
        const reveal = () => {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active')
                    }
                })
            }, observerOptions)

            const revealElements = document.querySelectorAll('.reveal')

            // Safety: If no elements found, retry once
            if (revealElements.length === 0) return

            revealElements.forEach((el) => {
                observer.observe(el)

                // Force reveal for elements already in viewport on load/nav
                const rect = el.getBoundingClientRect()
                if (rect.top < window.innerHeight) {
                    el.classList.add('active')
                }
            })

            return () => {
                revealElements.forEach((el) => observer.unobserve(el))
            }
        }

        const cleanup = reveal()
        const timer = setTimeout(reveal, 300)

        return () => {
            if (cleanup) cleanup()
            clearTimeout(timer)
        }
    }, [pathname])

    return null
}
