import { Table, Modal, Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashUser() {
    const { currentUser } = useSelector(state => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState("");
    const [loading, setLoading] = useState(true)

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(`/api/user/getUsers?startIndex${startIndex}`);
            const data = await res.json();

            if (res.ok) {
                setUsers((prev) => [...prev, ...data.users])
                if (data.posts.length < 9)
                    setShowMore(false);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/user/delete/${userIdToDelete}`, { method: "DELETE" })
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message);
            }

            setUsers(prev => prev.filter(user => user._id !== userIdToDelete))
            if (users.length < 9)
                setShowMore(false)

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/user/getUsers`);
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    setLoading(false)
                    if (data.users.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                setLoading(false)
                console.log(error.message);
            }
        }
        if (currentUser.isAdmin)
            fetchUsers();
    }, [currentUser._id]);

    if (loading)
        return <div className='flex max-w-screen mx-auto items-center min-h-screen'>
            <Spinner size="xl" />
        </div>

    return (
        <div className='table-auto overlfow-x-scroll md:mx-auto p-3 scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date created</Table.HeadCell>
                            <Table.HeadCell>User image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>

                        {users.map((user) => {
                            return <Table.Body className='divide-y' key={user._id}>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>
                                        <img src={user.profilePicture} alt={user.username}
                                            className='w-10 h-10 object-cover bg-gray-500 rounded-full' />
                                    </Table.Cell>
                                    <Table.Cell>{user.username}</Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>{
                                        user.isAdmin ? <FaCheck className='text-green-500' /> : <FaTimes className='text-red-500' />
                                    }</Table.Cell>
                                    <Table.Cell>

                                        <span className='text-sm text-red-900 hover:underline cursor-pointer' onClick={() => {
                                            setShowModal(true);
                                            setUserIdToDelete(user._id)
                                        }}>Delete</span>
                                    </Table.Cell>


                                </Table.Row>
                            </Table.Body>
                        })}
                    </Table>

                    {
                        showMore && (
                            <button className='w-full text-teal-500 self-center text-sm py-7' onClick={handleShowMore}>Show more</button>
                        )
                    }
                </>
            ) :
                (<p>No user available</p>)
            }
            <Modal show={showModal} onClose={() => setShowModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400
                        dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this user?</h3>
                        <div className="flex justify-center gap-4">
                            <Button color='failure' onClick={handleDeleteUser}>Confirm</Button>
                            <Button onClick={() => setShowModal(false)}>Cancel</Button>
                        </div>
                    </div>
                </Modal.Body >
            </Modal >
        </div >
    )
}
