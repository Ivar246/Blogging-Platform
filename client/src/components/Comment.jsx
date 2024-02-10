import { useState, useEffect } from 'react'
import moment from 'moment'

export default function Comment({ comment }) {
    const [user, setUser] = useState({})
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`)
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);

                setUser(data)
            } catch (error) {
                console.log(error.message);
            }
        }

        getUser();
    }, [comment]);

    console.log("user", user)
    return (
        <div className='flex p-4 border border-b dark:border-gray-600 text-sm'>
            <div className='flex shrink-0 mr-3'>
                <img className='w-10 h-10 rounded-full ' src={user.profilePicture} alt={user.username} />
            </div>
            <div className="flex-1">
                <div className="flex items-center mb-1">
                    <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.username}` : 'annonymous user'}</span>
                    <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
                </div>
                <p className='text-gray-500 mb-2'>{comment.content}</p>
            </div>
        </div>
    )
}