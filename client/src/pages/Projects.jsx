import React from 'react'
import CallToAction from "../components/CallToAction"

export default function Projects() {
    return (
        <div className='min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3'>
            <h1 className='text-3xl font-semibold text-white'>Projects</h1>
            <p className='text-md text-gray-500'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis, similique. Quisquam illo adipisci aperiam laboriosam veniam nisi velit accusantium, laudantium eligendi ad.
                Natus, ratione labore! Cupiditate repellat velit aliquid quidem.</p>
            <CallToAction />
        </div>
    )
}
