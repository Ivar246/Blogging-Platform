import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css"
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';


export default function UpdatePost() {

    const { postId } = useParams();
    const { currentUser } = useSelector(state => state.user)
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch(`/api/post/getPosts?postId=${postId}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message);
                }

                setPublishError(null);
                setFormData(data.posts[0]);
            } catch (error) {
                console.log(error.message);
                setPublishError(error.message);
            }
        }

        fetchPost();
    }, [postId]);

    console.log(formData)

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`/api/post/updatePost/${postId}/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            setPublishError(null);
            navigate(`/post/${data.slug}`);
        } catch (error) {
            setPublishError(error.message)
        }
    }

    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImageUploadError("Please select image.");
                return;
            }

            const storage = getStorage(app);
            const fileName = new Date().getTime() + "-" + file.name;
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed", (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError("image upload failed.");
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadUrl) => {
                            setImageUploadProgress(null);
                            setImageUploadError(null);
                            setFormData({ ...formData, image: downloadUrl })
                        })
                }
            )
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput type='text' placeholder='Title'
                        id='title'
                        className='flex-1'
                        onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })}
                        value={formData.title}
                        required />
                    <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        <option value="uncategorized">Select a category</option>
                        <option value="javascript">Javascript</option>
                        <option value="react">React.js</option>
                        <option value="nodejs">Nodejs</option>
                    </Select>
                </div>
                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                    <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                    <Button type='button' gradientDuoTone="purpleToBlue" size='sm'
                        outline
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}
                    >
                        {
                            imageUploadProgress ?
                                <div className='w-16 h-16'>
                                    <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}`}></CircularProgressbar>
                                </div> : "Upload Image"
                        }

                    </Button>
                </div>
                {
                    imageUploadError && (
                        <Alert color='failure'>
                            {imageUploadError}
                        </Alert>
                    )
                }
                {formData.image && (
                    <img src={formData.image}
                        alt='upload'
                        className='w-full h-90' />
                )
                }
                <ReactQuill theme='snow' placeholder="Write something..." className='h-72 mb-12 placeholder-gray-700 dark:placeholder-gray-500'
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    value={formData.content}
                    required />
                <Button type='submit' gradientDuoTone='purpleToPink'>Update post</Button>
                {
                    publishError && (
                        <Alert color="failure" className='mt-5'>{publishError}</Alert>
                    )
                }
            </form>
        </div>
    )
}
