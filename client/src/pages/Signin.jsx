import React, { useState } from 'react'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice"
import Oauth from '../components/Oauth'

export default function Signin() {
    const [formData, setFormData] = useState({})
    const { loading, error: errorMessage } = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value.trim() })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.email || !formData.password) {
            return dispatch(signInFailure("Please fill up all field."))
        }
        try {
            dispatch(signInStart());
            const res = await fetch("/api/auth/signin", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            const data = await res.json();
            console.log(data)
            if (data.success === false) {
                return dispatch(signInFailure(data.message))
            }

            if (res.ok) {
                dispatch(signInSuccess(data))
                return navigate("/")
            }

        } catch (error) {
            return dispatch(signInFailure(error.message))

        }
    }

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
                    <p className='text-sm mt-5'>This is the best Blogging Platform.You can signin with your email and password.</p>
                </div>

                {/* right */}
                <div className='flex-1'>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                        <div>
                            <Label value='Email' />
                            <TextInput name="email" type='email' placeholder='email..' id='email' onChange={handleChange}></TextInput>
                        </div>
                        <div>
                            <Label value='Password' />
                            <TextInput name='password' type='password' placeholder='***********' id='password' onChange={handleChange}></TextInput>
                        </div>
                        <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading} > {
                            loading ? (
                                <>
                                    <Spinner size="sm" />
                                    <span>Loading...</span>
                                </>
                            ) :
                                "Sign In"
                        }</Button>
                        <Oauth />
                    </form>
                    <div>
                        <div className="flex gap-2 text-sm mt-5">
                            <span>Don't have an account?</span>
                            <Link to='/signup' className='text-blue-500'>
                                Sign Up
                            </Link>
                        </div>

                        {
                            errorMessage && (
                                <Alert className='mt-f' color='failure'>
                                    {errorMessage}
                                </Alert>
                            )
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}
