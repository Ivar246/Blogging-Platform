import { useSelector, useDispatch } from 'react-redux'
import { Alert, Button, TextInput } from 'flowbite-react'
import { useState, useRef, useEffect } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice'

export default function DashProfile() {
    const { currentUser } = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const filePickerRef = useRef();
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
    const [imageFileUploadError, setImageFileUploadError] = useState("");
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null)
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

    console.log(formData)

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
                <Button type='submit' gradientDuoTone="purpleToBlue">
                    update
                </Button>

            </form>
            <div className="text-red-500 flex justify-between">
                <span className='cursor-pointerd '>Delete User</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
            {updateUserSuccess && (
                <Alert color="success" className='mt-5'>{updateUserSuccess}</Alert>
            )}
            {updateUserError && (
                <Alert color="failure" className='mt-5'>{updateUserError}</Alert>
            )}
        </div>


    )
}
