import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom'
import React from 'react'
import { AiOutlineSearch } from "react-icons/ai"
import { FaMoon, FaSun } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { toogleTheme } from '../redux/theme/themeSlice'
import { signoutSuccess, signoutFailure } from "../redux/user/userSlice"
export default function Header() {
    const path = useLocation().pathname // this gets the current path like "/signin", "/signup"
    const dispatch = useDispatch()
    const { theme } = useSelector(state => state.theme)

    const { currentUser } = useSelector(state => state.user)

    const handlesignout = async () => {
        try {
            const res = await fetch("/api/user/signout", {
                method: "POST"
            });
            const data = await res.json();
            if (!res.ok) {
                signoutFailure(data.message)
            } else {
                dispatch(signoutSuccess())
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <Navbar className="border-b-2">
            <Link
                to='/'
                className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
            >
                <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                    Ravi's
                </span>
                Blog
            </Link>

            <form>
                <TextInput
                    type='text'
                    placeholder='Search...'
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline'
                />
            </form>
            <Button className="w-12 h-10 lg:hidden" color='gray' >
                <AiOutlineSearch />
            </Button>

            <div className='flex gap-2 md:order-last'>
                <Button className='w-12 h-10 hidden sm:inline' color="gray" onClick={() => { dispatch(toogleTheme()) }} pill >
                    {theme === "light" ? <FaSun /> : <FaMoon />}
                </Button>
                {
                    currentUser ? (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar alt="user"
                                    img={currentUser.profilePicture} rounded />
                            }>
                            <Dropdown.Header>
                                <span className="block text-sm">@{currentUser.username}</span>
                                <span className="block text-sm font-medium truncate">{currentUser.email}</span>
                            </Dropdown.Header>
                            <Link to={'/dashboard?tab=profile'}>
                                <Dropdown.Item>Profile</Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handlesignout}>Sign Out</Dropdown.Item>
                        </Dropdown>
                    ) :
                        (
                            <Link to='/signin'>
                                <Button gradientDuoTone='purpleToBlue' outline>
                                    Sign In
                                </Button>
                            </Link>
                        )
                }

                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === '/'} as={"div"}>
                    <Link to='/'>Home</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/about'} as={"div"}>
                    <Link to='/about'>About</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/projects'} as={"div"}>
                    <Link to='/projects'>Projects</Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    )
}
