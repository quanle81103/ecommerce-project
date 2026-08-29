import { useEffect, useState } from "react";
import heroFallback from "../../src/assets/hero.png";

export default function HeroBanner({ banners = [], loading = false }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slides = banners.length ? banners : [{ id: "fallback", bannerUrl: heroFallback }];

    useEffect(() => {
        if (slides.length < 2) return undefined;
        const timer = window.setInterval(() => setCurrentIndex((index) => (index + 1) % slides.length), 5000);
        return () => window.clearInterval(timer);
    }, [slides.length]);

    useEffect(() => { if (currentIndex >= slides.length) setCurrentIndex(0); }, [currentIndex, slides.length]);

    if (loading) return <div className="app-container mt-5"><div className="h-52 animate-pulse rounded-2xl bg-slate-200 sm:h-80 lg:h-96" /></div>;

    const changeSlide = (step) => setCurrentIndex((index) => (index + step + slides.length) % slides.length);

    return (
        <section className="app-container mt-5" aria-label="Khuyến mãi nổi bật">
            <div className="relative overflow-hidden rounded-2xl bg-slate-200 shadow-sm">
                <img
                    key={slides[currentIndex]?.id || currentIndex}
                    src={slides[currentIndex]?.bannerUrl || heroFallback}
                    alt="Khuyến mãi mua sắm nổi bật"
                    className="hero-banner-image h-52 w-full object-cover sm:h-80 lg:h-96"
                />
                <div className="hero-banner-shine pointer-events-none absolute inset-0" aria-hidden="true" />
                {slides.length > 1 && (
                    <>
                        <button type="button" aria-label="Banner trước" onClick={() => changeSlide(-1)} className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-xl shadow hover:bg-white">‹</button>
                        <button type="button" aria-label="Banner tiếp theo" onClick={() => changeSlide(1)} className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-xl shadow hover:bg-white">›</button>
                        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                            {slides.map((slide, index) => (
                                <button key={slide.id || index} type="button" aria-label={`Xem banner ${index + 1}`} onClick={() => setCurrentIndex(index)} className={`h-2.5 rounded-full transition-all ${currentIndex === index ? "w-7 bg-white" : "w-2.5 bg-white/60"}`} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
