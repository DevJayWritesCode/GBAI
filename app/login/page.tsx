"use client"
import React, { useEffect, useState } from 'react'
import { signIn } from '../firebase'
import { useRouter } from 'next/navigation'
import { Alert } from "@/components/ui/alert";
import { setAlert } from '../mixins';

export default function page() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const router = useRouter()

    const onLogin = () => {
        signIn(email, password).then(() => {
            setAlert(`Welcome, ${email}!`, 'You have successfully logged in')
            router.push('/')
        }).catch(() => {
            setAlert('Login failed!', 'Incorrect Credentials. Please try again.')
        })
    }

    return (
        <div className="bg-white min-h-screen flex items-center justify-center">
            <div className="px-5 py-12 w-full md:max-w-lg mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-700">Ghost buddy login</h1>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input onChange={(e: any) => setEmail(e.target.value)} type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input onChange={(e: any) => setPassword(e.target.value)} type="password" id="password" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" />
                    </div>
                    <div className="text-center mt-4">
                        <a href="/signup" className="text-sm text-rose-300 hover:underline">
                            No account yet? Register here
                        </a>
                    </div>
                    <button onClick={onLogin} type="submit" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Login</button>
                </div>
            </div>


        </div>
    )
}

