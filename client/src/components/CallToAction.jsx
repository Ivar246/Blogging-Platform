import { Button } from 'flowbite-react'
import React from 'react'

export default function CallToAction() {
    return (
        <div className='flex flex-col sm:flex-row p-3 border border-teal-50 justify-center items-center
        rounded-tl-3xl rounded-br-3xl text-center'>
            <div className="flex-1 justify-center flex flex-col ">
                <h2 className='text-2xl dark:text-white dark'>
                    Want to learn more about javascript?
                </h2>
                <p className='text-gray-500 my-5'>
                    Checkout these resources with 100 javascript projects
                </p>
                <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none'>
                    <a href="https://www.ravi1.com.np" target="_blank" rel="noopener noreferrer">
                        100 Javascript Projects
                    </a>
                </Button>
            </div>
            <div className="flex-1 p-7">
                <img src='https://www.codingnepalweb.com/wp-content/uploads/2022/09/10-best-beginner-to-intermediate-js-projec-fix.jpg' />
            </div>
        </div>
    )
}
