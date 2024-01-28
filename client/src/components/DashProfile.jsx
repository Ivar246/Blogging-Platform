import { useSelector } from 'react-redux'
import { Alert, Button, TextInput } from 'flowbite-react'
import { useState, useRef, useEffect } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
    const { currentUser } = useSelector(state => state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const filePickerRef = useRef()
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0)
    const [imageFileUploadError, setImageFileUploadError] = useState("")

    console.log(imageFileUploadProgress, imageFileUploadError)
    const handleImageChange = (e) => {
        const file = e.target.files[0]

        if (file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }

    useEffect(() => {
        if (imageFile)
            uploadImage()

    }, [imageFile]);

    const uploadImage = async () => {
        // service firebase.storage {
        //     match / b / { bucket } / o {
        //         match / { allPaths=**} {
        //         allow read, write: if false;
        //         allow write: if 
        //         request.resource.size < 2 * 1024 * 1024 &&
        //                 request.resource.contentType.matches('image/.*')
        //       }
        //     }
        // }
        setImageFileUploadError(null)
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
                setImageFile(null)
                setImageFileUrl(null)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    setImageFileUrl(downloadUrl);
                })

            });

    }

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>

            <h1 className='my-7 text-center font-semibold text-3xl'>profile</h1>
            <form className='flex flex-col gap-4'>
                <input type='file' accept='image/*' hidden onChange={handleImageChange} ref={filePickerRef} />
                <div className='relative w-32 h-32 self-center cursor-pointer shadow-md
                overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>

                    {imageFileUploadProgress && (
                        <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: "100%",
                                    height: '100%',
                                    position: "absolute",
                                    top: 0,
                                    left: 0
                                },
                                path: {
                                    stroke: `rgba(rgba(62,152,190, ${imageFileUploadProgress / 100}))`
                                }
                            }} />
                    )}
                    <img
                        src={imageFileUrl || currentUser.profilePicture}
                        alt="user"
                        className={`rounded-full w-full h-full border-8 object-cover border-[lightgray]
                      ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}  `}
                    />
                </div>

                {imageFileUploadError && <Alert color="failure">
                    {imageFileUploadError}
                </Alert>}
                <TextInput type='text' id='usename' placeholder='username' defaultValue={currentUser.username} />
                <TextInput type='email' id='email' placeholder='username' defaultValue={currentUser.email} />
                <TextInput type='password' id='password' placeholder='password' />
                <Button type='submit' gradientDuoTone="purpleToBlue">
                    update
                </Button>

            </form>
            <div className="text-red-500 flex justify-between">
                <span className='cursor-pointerd '>Delete User</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
        </div>


    )
}
