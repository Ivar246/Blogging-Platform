import React from 'react'
import { Button, Label, TextInput } from 'flowbite-react'
import { Link } from 'react-router-dom'

export default function Signup() {
    return (
        <div className='min-h-screen mt-20'>
            <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-8'>
                {/* left */}
                <div className='flex-1' >
                    <Link
                        to='/'
                        className='font-bold  dark:text-white sm:text-4xl'
                    >
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                            Ravi's
                        </span>
                        Blog
                    </Link>
                    <p className='text-sm mt-5'>This is the best Blogging Platform.You can signup with your email and password.</p>
                </div>

                {/* right */}
                <div className='flex-1'>
                    <form className='flex flex-col gap-4'>
                        <div>
                            <Label value='Username' />
                            <TextInput type='text' placeholder='username' id='username'></TextInput>
                        </div>
                        <div>
                            <Label value='Email' />
                            <TextInput type='email' placeholder='email..' id='email'></TextInput>
                        </div>
                        <div>
                            <Label value='Password' />
                            <TextInput type='password' placeholder='password' id='password'></TextInput>
                        </div>
                        <Button gradientDuoTone='purpleToPink' type='submit'>Sign Up</Button>
                    </form>
                    <div>
                        <div className="flex gap-2 text-sm mt-5">
                            <span>Have an account?</span>
                            <Link to='/signin' className='text-blue-500'>
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
