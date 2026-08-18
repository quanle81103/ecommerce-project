import { useEffect, useState } from "react";
import { responseBanner } from "../../services/dataService";

export default function HeroBanner({ banners }) {

    const [currentIndex, setCurrentIndex] = useState(0);

    // logic previous/next banner
    useEffect(() => {
        if (banners.length === 0) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) =>
                prev === banners.length - 1 ? 0 : prev + 1
            );
        }, 3000);

        return () => clearInterval(timer);
    }, [banners]);

    const nextBanner = () => {
        setCurrentIndex((prev) =>
            prev === banners.length - 1 ? 0 : prev + 1
        );
    };

    const prevBanner = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? banners.length - 1 : prev - 1
        );
    };
    
    return (
        <div className="relative max-w-full mx-auto mt-4 flex gap-2 ">
            <img
                src={banners[currentIndex]?.bannerUrl}
                alt="Banner"
                className="w-1/2 h-96 object-cover rounded-xl shadow-lg"
            />

            <img 
                src={banners[(currentIndex + 1) % banners.length]?.bannerUrl} 
                alt="Banner" 
                className="w-1/2 h-96 object-cover rounded-xl shadow-lg"
            />

            {/* Nút trái */}
            <button
                onClick={prevBanner}
                className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    bg-white/80
                    hover:bg-white
                    px-3
                    py-2
                    rounded-full
                    shadow
                "
            >
                ❮
            </button>

            {/* Nút phải */}
            <button
                onClick={nextBanner}
                className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    bg-white/80
                    hover:bg-white
                    px-3
                    py-2
                    rounded-full
                    shadow
                "
            >
                ❯
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                            currentIndex === index
                                ? "bg-white"
                                : "bg-white/50"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}