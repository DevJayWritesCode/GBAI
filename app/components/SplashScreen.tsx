import Image from 'next/image';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
    onLoadingComplete?: () => void;
}

export default function SplashScreen({ onLoadingComplete }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isMounted, setIsMounted] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(() => {
        return Math.floor(Math.random() * 5);
    });
    const splashImages = ['/splash/1.JPG', '/splash/2.JPG', '/splash/3.JPG', '/splash/4.JPG', '/splash/5.JPG'];

    useEffect(() => {
        // Start fade out after 2 seconds
        const fadeOutTimer = setTimeout(() => {
            setIsVisible(false);
        }, 1000);

        // Unmount component after fade out animation completes
        const unmountTimer = setTimeout(() => {
            setIsMounted(false);
            onLoadingComplete?.();
        }, 3000); // 2000ms delay + 1000ms for fade animation

        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(unmountTimer);
        };
    }, [onLoadingComplete]);

    if (!isMounted) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000 ease-in-out min-h-screen ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

            <div className="relative w-full h-screen">
                <div className="absolute inset-0 backdrop-blur-sm">
                    <Image
                        src={splashImages[currentImageIndex]}
                        alt="Ghost Buddy AI"
                        fill
                        quality={100}
                        priority
                        className="object-none h-max w-max md:object-cover md:h-screen md:w-screen blur-sm opacity-90"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-4xl lg:text-7xl font-black bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 inline-block text-transparent bg-clip-text drop-shadow-lg">
                            Ghost Buddy AI
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
}