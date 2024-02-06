import { Table, Modal, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from "react-icons/hi"

export default function DashPost() {
    const { currentUser } = useSelector(state => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState("");

    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`, { method: "GET" });;
            const data = await res.json();

            if (res.ok) {
                setUserPosts((prev) => [...prev, ...data.posts])
                if (data.posts.length < 9)
                    setShowMore(false);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeletePost = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/post/deletePost/${postIdToDelete}/${currentUser._id}`, { method: "DELETE" })
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setUserPosts(prev =>
                    prev.filter(post => post._id !== postIdToDelete))
                if (userPosts.length < 9)
                    setShowMore(false)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getPosts?${currentUser._id}`, {
                    method: "GET"
                });
                const data = await res.json();
                if (res.ok) {
                    setUserPosts(data.posts)
                    console.log(data.posts.length)
                    if (data.posts.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        if (currentUser.isAdmin)
            fetchPosts()
    }, [currentUser._id])


    return (
        <div className='table-auto overlfow-x-scroll md:mx-auto p-3 scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Post image</Table.HeadCell>
                            <Table.HeadCell>Post title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell>
                                <span>Edit</span>
                            </Table.HeadCell>
                        </Table.Head>

                        {userPosts.map((post) => {
                            return <Table.Body className='divide-y'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`} as="div">
                                            <img src={post.image} alt={post.title}
                                                className='w-20 h-10 object-cover bg-gray-500' />
                                        </Link>
                                    </Table.Cell>
                                    <Link className='font-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`} as="div">
                                        <Table.Cell>{post.title}</Table.Cell>
                                    </Link>
                                    <Table.Cell>{post.category}</Table.Cell>
                                    <Table.Cell>

                                        <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={() => {
                                            setShowModal(true);
                                            setPostIdToDelete(post._id)
                                        }}>Delete</span>
                                    </Table.Cell>


                                    <Table.Cell>
                                        <Link className='text-teal-500 hover:underline cursor-pointer' to={`/update-post/${post._id}`}>
                                            <span>Edit</span>

                                        </Link>
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
                (<p>You have no posts</p>)
            }
            <Modal show={showModal} onClose={() => setShowModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400
                        dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this post?</h3>
                        <div className="flex justify-center gap-4">
                            <Button color='failure' onClick={handleDeletePost}>Confirm</Button>
                            <Button onClick={() => setShowModal(false)}>Cancel</Button>
                        </div>
                    </div>
                </Modal.Body >
            </Modal >
        </div >
    )
}
