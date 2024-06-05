// Main.js
// This component handles the main functionality of uploading videos either directly or via a YouTube link.
// It allows users to select a model for processing the video and displays the upload progress.
// After the upload is complete, it navigates to a results page to show the transcript and summary.


import { CheckIcon, UploadIcon } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import './Main.css';
import axios from 'axios';  // Import Axios
import Loader from './Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { ResultContext } from '../../../Contexts/ResultProvider';
import { useRef } from 'react';

function Main() {
    const Navigae = useNavigate();

    const modelRef = useRef(null)
    const youtubeLinkRef = useRef(null);


    const [waitLoader, setWaitLoader] = useState(false); // Add this line
    const [isYoutube, setIsYoutube] = useState(false);
    const [transcript, setTranscript] = useState(''); // Add this line
    const [summary, setSummary] = useState(''); // Add this line
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadingStarted, setUploadingStarted] = useState(false);
    const { contextValue, updateContextValue } = useContext(ResultContext);

    const [fileDetails, setFileDetails] = useState({
        fileName: '',
        fileSize: '',
        fileType: '',
    }); // Add this line
    const switchUploadType = () => {
        setIsYoutube(!isYoutube);
    };

    const convertBytes = (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        if (file) {
            setFileDetails({
                fileName: file.name,
                fileSize: convertBytes(file.size),
                fileType: file.type,
            });
        }


    };

    // ...

    const handleUpload = async () => {
        alert('Uploading file...');
        const selectedModel = modelRef.current.value;
        if (selectedModel === "none") {
            alert("Please select the model")
            return
        }

        if (selectedFile) {
            setUploadingStarted(true);
            const formData = new FormData();
            formData.append('video', selectedFile);

            try {
                const modelName = selectedModel;
                formData.append('modelName', modelName);

                const response = await axios.post('http://localhost:5000/upload_video', formData, {
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        setUploadProgress(progress);
                        if (uploadProgress >= 99) {
                            alert('File uploaded succssfully');

                        }
                    },

                });

                if (response) {
                    setWaitLoader(false)
                }
                // Handle the response as needed
                console.log(response);
                setTranscript(response.data.transcript); // Add this line
                const transcript = response.data.transcript;
                const summary = response.data.summary;
                const updatedValue = {
                    ...contextValue,
                    transcript,
                    summary,
                };
                updateContextValue(updatedValue);
                setSummary(response.data.summary); // Add this line
                setWaitLoader(false)

                Navigae('/vr/123/result')
            } catch (error) {
                console.error('Error uploading file:', error);
                setUploadingStarted(false);
                setWaitLoader(false);
            }
        }
    };


    const handleYoutubeLink = async (e) => {
        e.preventDefault();
        const link = youtubeLinkRef.current.value;
        const selectedModel = modelRef.current.value;
        if (selectedModel === "none") {
            alert("Please select the model")
            return
        }
        if (link === '') {
            alert('Please enter youtube link')
            return
        }

        const modelName = selectedModel;

        const formData = new FormData();
        formData.append('link', link);

        formData.append('modelName', modelName);
        // setUploadingStarted(true);

        const response = await axios.post('http://localhost:5000/youtube_upload_video', formData);
        if (response) {
            setWaitLoader(false)
        }
        console.log(response);
        setTranscript(response.data.transcript); // Add this line
        const transcript = response.data.transcript;
        const summary = response.data.summary;
        const updatedValue = {
            ...contextValue,
            transcript,
            summary,
        };
        updateContextValue(updatedValue);
        setSummary(response.data.summary); // Add this line
        setWaitLoader(false)

        Navigae('/vr/123/result')
    }


    return (
        <div className='main_main'>

            {uploadProgress < 100 ? <div className='main_main_upload_card'>
                <p className='main_main_upload_card_p1'>Upload your video here</p>
                {!isYoutube ? (
                    <>
                        <label className='main_main_upload_card_uploadBtn'>
                            <UploadIcon size={19} />
                            Select File
                            <input type='file' style={{ display: 'none' }} onChange={handleFileChange} />
                        </label>

                    </>
                ) : (
                    <form className='youtube_link_form'>
                        <input type='text' placeholder='Enter youtube link' className='main_main_upload_card_youtubeLink' ref={youtubeLinkRef} />
                        <div className="select-model-div">
                            <select className="select-div" ref={modelRef}>
                                <option value="none">-- SELECT THE MODEL --</option>
                                <option value="T5">T5</option>
                                <option value="BART">BART</option>

                                <option value="SPACY">SPACY</option>
                            </select>
                        </div>

                        <button className='main_main_upload_card_youtubeLinkBtn' onClick={handleYoutubeLink}>Upload</button>
                    </form>
                )}
                {uploadingStarted && <div className='loader_container'>
                    {uploadProgress < 100 && <p>File {selectedFile.name} is uploading ...</p>}
                    {uploadProgress < 100 ? <div className='loader'>
                        <div className='loader_bar' style={{ width: `${uploadProgress}%` }}>
                            {uploadProgress > 0 && <span>{uploadProgress}%</span>}
                        </div>
                    </div> :
                        <div className='succ_uploaded'>Successfully Uploaded <CheckIcon className='checkicon' /></div>}
                </div>}
                {!selectedFile && <p className='main_main_upload_youtube' onClick={switchUploadType}>
                    {isYoutube ? 'or upload manually' : 'or upload using youtube link'}
                </p>}
                {selectedFile && (

                    <div className='preview_video'>
                        {!uploadingStarted && <>
                            <video src={URL.createObjectURL(selectedFile)} controls className='preview_video_player' />
                            <div className="select-model-div">
                                <select className="select-div" ref={modelRef}>
                                    <option value="none">-- SELECT THE MODEL --</option>
                                    <option value="T5">T5</option>
                                    <option value="BART">BART</option>

                                    <option value="SPACY">SPACY</option>
                                </select>
                            </div>

                            <button className='upload-btn' id='ub' onClick={handleUpload}>
                                Upload
                            </button></>}
                    </div>
                )}

            </div> :
                <Loader />
            }
        </div>
    );
}

export default Main;
