/*
  Component Description:
  This component represents the Edit Profile section within the My Account page. It allows users to update their profile information and profile picture.

  Dependencies:
  - Firebase: Used for authentication and storage.

  Props:
  - user: The current user object containing user information.

  State:
  - name: State variable to store the user's name.
  - user2: State variable to store a copy of the user object for displaying email information.
  - image: State variable to store the selected image for profile picture.
  - isNameChanged: State variable to track if the name has been changed.

  Hooks:
  - useEffect: Used for performing side effects when the component mounts.
  - useState: Used for managing state within the component.

  Functions:
  - handleNameChange: Function to handle changes in the user's name input field.
  - updateName: Function to update the user's name.
  - handleImageChange: Function to handle changes in the profile picture.
  - updateProfilePic: Function to update the user's profile picture.
  - handleFileInputChange: Function to handle changes in the file input for uploading profile picture.
*/

import React, { useEffect, useState } from 'react';
import './EditProfile.css';
import { updateProfile } from "firebase/auth";
import { auth } from '../../../../utils/Firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../../../utils/Firebase';
import { CameraIcon } from 'lucide-react';

function EditProfile({ user }) {
    const [name, setName] = useState(user.name);
    const [user2, setUser2] = useState({});
    const [image, setImage] = useState('');
    const [isNameChanged, setIsNameChanged] = useState(false);

    const handleNameChange = (e) => {
        setIsNameChanged(true);
        setName(e.target.value);
    };

    const updateName = async () => {
        if (isNameChanged) {
            await updateProfile(auth.currentUser, {
                displayName: name
            }).then(() => {
                alert("Name updated successfully");
            }).catch((error) => {
                alert("Error updating name");
                console.log(error);
            });
        }
        setIsNameChanged(false);
    };

    const handleImageChange = () => {
        updateProfilePic();
    };

    const updateProfilePic = async () => {
        if (image) {
            const storageRef = ref(storage, 'profile_images/' + auth.currentUser.uid);
            await uploadBytes(storageRef, image).then(async (snapshot) => {
                const downloadURL = await getDownloadURL(snapshot.ref);
                await updateProfile(auth.currentUser, {
                    photoURL: downloadURL
                }).then(() => {
                    const user = JSON.parse(localStorage.getItem('user'));
                    user.photoUrl = downloadURL;
                    localStorage.setItem('user', JSON.stringify(user));
                    alert("Photo updated successfully");
                    window.location.reload();
                }).catch((error) => {
                    alert("Error updating photo");
                    console.log(error);
                });
            });
        } else {
            alert("Please select an image first");
        }
    };

    const handleFileInputChange = (e) => {
        setImage(e.target.files[0]);
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setName(user.name);
        const user2 = {
            name: user.name,
            email: user.email,
        };
        setUser2(user2);
    }, []);

    return (
        <div className='editprofile_main'>
            <div className='editprofile_basic'>
                <div className='editprofile_basic_title'>
                    <p>Personal Info</p>
                </div>
                <div className='editprofile_pic'>
                    {user.photoUrl === '' ? <div className='editprofile_apic2'>{user.name[0]}</div> :
                        <img src={user.photoUrl} alt='um_userIcon' className='editprofile_apic' />
                    }
                </div>
                <div className='editprofile_other'>
                    <div className='editprofile_other_label'>
                        <p>Name</p>
                        <input type='text' disabled value={name} placeholder='Name' className='editprofile_other_input' onChange={handleNameChange} />
                    </div>
                    <div className='editprofile_other_label'>
                        <p>Email</p>
                        <input type='text' value={user2.email} placeholder='Email' className='editprofile_other_input eoi_email' disabled />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;
