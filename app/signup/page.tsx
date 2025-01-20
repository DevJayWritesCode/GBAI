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
                        setAlert('Welcome!', `user ${email} created successfully`)
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
        <div className="bg-white min-h-screen flex items-center justify-center">
            <div className="px-5 py-12 w-full md:max-w-lg mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-700">Ghost buddy sign-up</h1>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input onChange={(e: any) => setEmail(e.target.value)} type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input onChange={(e: any) => setPassword(e.target.value)} type="password" id="password" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input onChange={(e: any) => setConfPassword(e.target.value)} type="password" id="password" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" />
                    </div>
                    <div className='flex flex-row w-full items-center justify-center space-x-2'>
                        <button onClick={onSignup} type="submit" className="w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Sign up</button>
                        <a href="/login" className='w-1/2'><button type="submit" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button></a>
                    </div>
                </div>
            </div>
        </div>
    )
}
