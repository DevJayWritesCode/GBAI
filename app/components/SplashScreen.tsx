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
        const audio = new Audio('/pop.mp3');
        audio.play();
    }, [])
    useEffect(() => {
        let fadeOutTimer: any
        let unmountTimer: any
        if (!isVisible) {
            // Start fade out after 2 seconds
            fadeOutTimer = setTimeout(() => {
                setIsVisible(false);
                const audio = new Audio('/notif.mp3');
                audio.play();
            }, 1000);

            // Unmount component after fade out animation completes
            unmountTimer = setTimeout(() => {
                setIsMounted(false);
                onLoadingComplete?.();
            }, 3000); // 2000ms delay + 1000ms for fade animation
        }

        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(unmountTimer);
        };

    }, [isVisible]);

    if (!isMounted) return null;


    return (
        <div onClick={() => setIsVisible(false)} className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-1000 ease-in-out min-h-screen ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative w-full h-screen">
                <div className="absolute inset-0 backdrop-blur-sm">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-7xl lg:text-7xl font-light text-neutral-800 inline-block">
                            Boo!
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
}