import { useSelector, useDispatch } from 'react-redux'
import { Alert, Button, TextInput, Modal, Spinner } from 'flowbite-react'
import { useState, useRef, useEffect } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess, signoutFailure, signoutSuccess } from '../redux/user/userSlice'
import { HiOutlineExclamationCircle } from "react-icons/hi"
import { Link } from 'react-router-dom'

export default function DashProfile() {
    const { currentUser, error, loading } = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const filePickerRef = useRef();
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
    const [imageFileUploadError, setImageFileUploadError] = useState("");
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();

    console.log(imageFileUploadProgress, imageFileUploadError)

    // image input field change handler
    const handleImageChange = (e) => {
        const file = e.target.files[0]

        if (file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }


    // input field change handler
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleDeleteUser = async () => {
        setShowModal(false);

        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok) {
                dispatch(deleteUserFailure(data.message))
            } else {
                dispatch(deleteUserSuccess(data))
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }

    }

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

    // submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        // check if formData has some value
        if (Object.keys(formData).length === 0) {
            setUpdateUserError("No changes were made")
            return;
        }
        if (imageFileUploading) {
            setUpdateUserError("Please wait, File is uploading.")
            return;
        }
        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message)
            } else {
                dispatch(updateSuccess(data))
                setUpdateUserSuccess("User's Profile updated successfully.")
            }
        } catch (error) {
            dispatch(updateFailure(error.message))
        }
    }


    // handle side effect if input file field change
    useEffect(() => {
        if (imageFile)
            uploadImage()

    }, [imageFile]);


    const uploadImage = async () => {
        // service firebase.storage {
        //     match / b / { bucket } / o {
        //         match / { allPaths=**} {
        //         allow read, write;
        //         allow write: if 
        //         request.resource.size < 2 * 1024 * 1024 &&
        //                 request.resource.contentType.matches('image/.*')
        //       }
        //     }
        // }
        setImageFileUploading(true);
        setImageFileUploadError(null);
        const storage = getStorage(app);// gets firebase storage instance
        const fileName = new Date().getTime() + imageFile.name; // make file name unique
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);// gives information of file upload in bytes
        uploadTask.on(
            'state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0))
            },
            (error) => {
                setImageFileUploadError("Couldn't upload image (file must me less than 2MB)")
                setImageFileUploadProgress(null)
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploading(false)
            },
            // get called when file upload complete
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({ ...formData, profilePicture: downloadURL })
                    setImageFileUploading(false)
                }).catch(error => console.log(error))

            });

    }

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>

            <h1 className='my-7 text-center font-semibold text-3xl'>profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type='file' accept='image/*' hidden onChange={handleImageChange} ref={filePickerRef} />
                <div className='relative w-32 h-32 self-center cursor-pointer shadow-md
                overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>

                    {imageFileUploadProgress && (
                        <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                },
                                path: {
                                    stroke: `rgba(rgba(62,152,199, 
                                        ${imageFileUploadProgress / 100}))`
                                }
                            }} />
                    )}
                    <img
                        src={imageFileUrl || currentUser.profilePicture}
                        alt="user"
                        className={`rounded-full w-full h-full object-cover border-8  border-[lightgray]
                      ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}  `}
                    />
                </div>
                {imageFileUploadError && <Alert color="failure"> {imageFileUploadError}</Alert>}
                <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange} />
                <TextInput type='email' id='email' placeholder='username' defaultValue={currentUser.email} onChange={handleChange} />
                <TextInput type='password' id='password' placeholder='password' onChange={handleChange} />
                <Button type='submit' gradientDuoTone="purpleToBlue"
                    disabled={loading || imageFileUploading}>
                    {
                        loading ? (
                            <>
                                <Spinner size="sm" />
                                <span>Loading...</span>
                            </>
                        ) :
                            "Update"
                    }
                </Button>
                {
                    currentUser.isAdmin && (
                        <Link to={'/create-post'}>
                            <Button type='button' gradientDuoTone='purpleToPink' className='w-full'>Create a post</Button>
                        </Link>

                    )
                }

            </form>
            <div className="text-red-500 flex justify-between">
                <span className='cursor-pointer' onClick={() => setShowModal(true)}>Delete User</span>
                <span className='cursor-pointer' onClick={handlesignout}>Sign Out</span>
            </div>
            {updateUserSuccess && (
                <Alert color="success" className='mt-5'>{updateUserSuccess}</Alert>
            )}
            {updateUserError && (
                <Alert color="failure" className='mt-5'>{updateUserError}</Alert>
            )}
            {error && (
                <Alert color="failure" className='mt-5'>{error}</Alert>
            )}

            <Modal show={showModal} onClose={() => setShowModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400
                        dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this account?</h3>
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
