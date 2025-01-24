"use client"
import React, { useEffect, useState } from 'react'
import { signIn } from '../firebase'
import { useRouter } from 'next/navigation'
import { Alert } from "@/components/ui/alert";
import { setAlert } from '../mixins';
import Image from 'next/image';

export default function page() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const router = useRouter()

    const onLogin = () => {
        signIn(email, password).then(() => {
            router.push('/')
        }).catch(() => {
            setAlert('Login failed!', 'Incorrect Credentials. Please try again.')
        })
    }

    const [randomImage] = useState(() => Math.floor(Math.random() * 5) + 1);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <Image
                src={`/splash/${randomImage}.JPG`}
                alt="Background"
                fill
                className="object-none h-max w-max md:object-cover md:h-screen md:w-screen"
                priority
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div className="relative z-10 px-5 py-12 w-full md:max-w-lg mx-auto">
                <h1 className="text-4xl text-center font-black bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 inline-block text-transparent bg-clip-text drop-shadow-lg mb-8">Ghost buddy login</h1>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
                        <input onChange={(e: any) => setEmail(e.target.value)} type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white/80 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-200 focus:border-transparent" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
                        <input onChange={(e: any) => setPassword(e.target.value)} type="password" id="password" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white/80 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-200 focus:border-transparent" />
                    </div>
                    <div className="text-center mt-4">
                        <a href="/signup" className="text-sm text-white hover:text-indigo-200 hover:underline">
                            No account yet? Register here
                        </a>
                    </div>
                    <button onClick={onLogin} type="submit" className="w-full px-3 py-2 bg-white/90 border border-gray-300 rounded-md text-gray-900 hover:bg-white hover:shadow-lg transition-all duration-200">Login</button>
                </div>
            </div>
        </div>
    )
}

