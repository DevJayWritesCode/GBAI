import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface EmotionTheme {
    id: number;
    name: string;
    image: string;
    sound: string;
}

interface ComingSoonProps {
    setSelectedImage: (image: string | null) => void;
}

const emotionThemes: EmotionTheme[] = [
    { id: 1, name: 'Happy', image: 'emotions/happy.png', sound: '/sounds/happy.mp3' },
    { id: 2, name: 'Calm', image: 'emotions/calm.png', sound: '/sounds/calm.mp3' },
    { id: 3, name: 'Energetic', image: '/emotions/energetic.png', sound: '/sounds/energetic.mp3' },
    { id: 4, name: 'Sad', image: '/emotions/sad.png', sound: '/sounds/sad.mp3' },
    { id: 5, name: 'Anxious', image: '/emotions/anxious.png', sound: '/sounds/anxious.mp3' },
    { id: 6, name: 'Peaceful', image: '/emotions/peaceful.png', sound: '/sounds/peaceful.mp3' },
    { id: 7, name: 'Melancholic', image: '/emotions/melancholic.png', sound: '/sounds/melancholic.mp3' },
    { id: 8, name: 'Excited', image: '/emotions/excited.png', sound: '/sounds/excited.mp3' },
    { id: 9, name: 'Relaxed', image: '/emotions/relaxed.png', sound: '/sounds/relaxed.mp3' },
];

export default function ComingSoon({ setSelectedImage }: ComingSoonProps) {
    const [selectedEmotion, setSelectedEmotion] = useState<EmotionTheme | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    const handleEmotionSelect = (emotion: EmotionTheme) => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        const newAudio = new Audio(emotion.sound);
        newAudio.loop = true;
        newAudio.play();
        setAudio(newAudio);
        setSelectedEmotion(emotion);
        setSelectedImage(emotion.image);
    };

    return (
        <div className={cn(
            'w-full min-h-screen p-2 flex items-center justify-center',
            'transition-all duration-500 ease-in-out'
        )}>
            <div className="max-w-3xl mx-auto w-full px-4">
                <div className="grid grid-cols-3 gap-1 md:gap-2">
                    {emotionThemes.map((emotion) => (
                        <div
                            key={emotion.id}
                            onClick={() => handleEmotionSelect(emotion)}
                            className={cn(
                                'aspect-square relative cursor-pointer overflow-hidden rounded-lg',
                                'transform transition-all duration-300 hover:scale-105',
                                'border-4',
                                selectedEmotion?.id === emotion.id ? 'border-primary' : 'border-transparent'
                            )}
                        >
                            <img
                                src={emotion.image}
                                alt={emotion.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
