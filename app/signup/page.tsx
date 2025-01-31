"use client"
import React, { useState } from 'react'
import { createUser, signIn, updateCredentials } from '../firebase.js'
import { useRouter } from 'next/navigation.js'
import { setAlert } from '../mixins'

export default function page() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')
    const router = useRouter()


    const onSignup = () => {
        if (password === confPassword) {
            createUser(email, password).then(() => {
                const data = { ID: window.crypto.randomUUID(), email: email }
                updateCredentials(data).then(() => {
                    signIn(email, password).then(() => {
                        router.push('/')
                    }).catch((data) => {

                    })

                })
            }).catch((data) => {
                if (data.code === "auth/email-already-in-use") {
                    setAlert('Error!', 'Email already in use')

                } else {
                    setAlert('Error!', 'Something went wrong')
                }
            })
        }
    }

    return (
        <div className="bg-neutral-500 relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0"></div>
            <div className="relative z-10 px-5 py-12 w-full md:max-w-lg mx-auto">
                <h1 className="text-4xl lg:text-6xl text-center text-neutral-100 font-thin mb-8">Register here</h1>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
                        <input onChange={(e: any) => setEmail(e.target.value)} type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white/80 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-200 focus:border-transparent" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
                        <input onChange={(e: any) => setPassword(e.target.value)} type="password" id="password" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white/80 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-200 focus:border-transparent" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-white">Confirm Password</label>
                        <input onChange={(e: any) => setConfPassword(e.target.value)} type="password" id="confirm-password" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white/80 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-200 focus:border-transparent" />
                    </div>
                    <div className='flex flex-row w-full items-center justify-center space-x-2'>
                        <button onClick={onSignup} type="submit" className="w-1/2 px-3 py-2 bg-white/90 border border-gray-300 rounded-md text-gray-900 hover:bg-white hover:shadow-lg transition-all duration-200">Sign up</button>
                        <a href="/login" className='w-1/2'><button type="submit" className="w-full px-3 py-2 bg-white/90 border border-gray-300 rounded-md text-gray-900 hover:bg-white hover:shadow-lg transition-all duration-200">Cancel</button></a>
                    </div>
                </div>
            </div>
        </div>
    )
}
