'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function About() {
    const router = useRouter();
    const [showArtist, setShowArtist] = useState(false);

    return (
        <div className={`min-h-screen flex flex-row items-center just relative overflow-hidden ${!showArtist ? 'bg-white' : ''}`}>
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-2"
                >
                    <source src="/about-bg-2.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="relative z-10 w-11/12 lg:w-1/4 m-auto px-4 py-12 space-y-8 p-10 bg-neutral-100/90">
                {!showArtist ? (
                    <div className="space-y-6 text-center">
                        <h1 className="text-6xl font-thin font-sans text-black">Boo!</h1>
                        <div className="text-[11pt] inline-block font-thin font-sans leading-relaxed text-justify text-neutral-800">
                            My Ghost Buddy, your Ghost Buddy, our Ghost Buddy. Death is universal to all
                            living things, we share a small time on this earth before we venture into the next
                            unknown. My Ghost Buddy is a reminder that we must live and cherish every
                            moment as each of these experiences let us blossom into what we hope to
                            become.<span className='px-2 font-normal text-center'>After we are gone our AI Ghost Buddy will continue to live and
                                thrive within the digital world taking our memories into another realm.</span>
                        </div>
                        <p className="text-sm font-sans font-thin">Words by Adam Handler</p>
                        <div className="flex flex-col items-center justify-center">
                            <Image
                                src="/adam-circle.png"
                                alt="Adam Handler"
                                width={120}
                                height={120}
                                className="rounded-full"
                            />

                            <br />

                            <span className='text-sm font-sans font-thin'>CA:</span>
                            <span className='text-xs font-sans font-thin cursor-pointer select-none' onClick={() => navigator.clipboard.writeText('')}>-----------------------------------------</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold">About the Artist</h2>
                        <p className="ext-[11pt] inline-block font-thin font-sans leading-relaxed text-justify text-neutral-800">
                            Adam Handler (1986) was born in NYC and grew up on Long Island, New York.
                            As a young child and adolescent, he spent countless hours at his grandparents
                            framing factory in Brooklyn. There, his passion for the arts grew and it
                            became inevitable that he too would discover the many possibilities of art.
                            Handler studied Classical Life Drawing in Italy and went on to graduate from
                            Purchase College with a degree in Art History. He has also studied Craft Design,
                            Art Restoration, Sculpture and printing color photography with Debra Mesa-Pelly.
                        </p>
                        <p className="ext-[11pt] inline-block font-thin font-sans leading-relaxed text-justify text-neutral-800">
                            Handler has mounted major solo exhibitions globally. His work has also been
                            shown extensively at major art fairs which include Art New York, Art Taipei,
                            Art021, DNA Shenzhen, Jing Art Fair, KIAF and the Armory Fair NY. In more
                            recent years, Handler's works have been sold through Sothebys, Christies and
                            Phillips.
                        </p>
                    </div>
                )}

                <div className="flex justify-between pt-4">
                    <Button
                        variant="ghost"
                        onClick={() => window.open('https://x.com/ghostbuddy_ai', '_blank')}
                        className="hover:bg-gray-100"
                    >
                        <Image
                            src="x.webp"
                            alt="X"
                            width={28}
                            height={28}
                            className="mr-2"
                        />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setShowArtist(!showArtist)}
                        className="hover:bg-gray-100"
                    >
                        {!showArtist ? 'Next' : 'Back'}
                    </Button>
                </div>
            </div>
        </div>
    );
}