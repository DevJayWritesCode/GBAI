import React from 'react'

export default function DailyJournal() {
    return (
        <div className='flex flex-col items-center justify-start py-5'>
            <div className='bg-white rounded-lg p-5 w-5/6 md:w-1/2 m-auto'>
                <span className='font-bold text-sm'>{new Date().toLocaleDateString()}</span>
                <p className='text-md italic text-justify text-gray-600'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, quisquam? Fugit, eaque. Quasi, quidem distinctio aperiam, aspernatur dolore, quae beatae commodi quibusdam sint consectetur alias. Obcaecati, voluptates. Consequatur, quas?
                </p>
            </div>
        </div>
    )
}
