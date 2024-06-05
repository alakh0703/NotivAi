/*
  Component Description:
  This component renders the result page, displaying either the summary or transcript content based on user selection. It also provides functionality to copy content to clipboard and save summary to database.

  Dependencies:
  - lucide-react: Used for the CopyIcon component.
  - ResultContext: Context for managing result data.
  - Firebase: Used for interacting with Firestore database.

  State:
  - saveSummaryPopUp: Boolean state to control the visibility of the save summary popup.
  - summary: State to hold the summary content.
  - transcript: State to hold the transcript content.
  - notes: State to hold additional notes content.
  - summaryTitle: State to hold the title of the summary.
  - showCopied: Boolean state to control the visibility of the 'copied' message.
  - isActive: Boolean state to track whether the summary or transcript tab is active.

  Ref:
  - titleRef: Reference to the input field for the summary title.

  Functions:
  - copyHandler(): Handles copying content to clipboard.
  - showTranscript(): Sets the active tab to transcript.
  - showSummary(): Sets the active tab to summary.
  - saveSummaryHandler(): Displays the save summary popup.
  - saveSummaryToDatabase(): Saves the summary to the Firestore database.
  - saveSummaryPopUpCancel(): Cancels the save summary popup.

  Effects:
  - useEffect(): Updates state with context data on component mount.
*/

import React, { useContext, useEffect, useRef, useState } from 'react';
import './Result.css';
import { CopyIcon } from 'lucide-react';
import { ResultContext } from '../../Contexts/ResultProvider';
import { db } from '../../utils/Firebase';
import { getDatabase, ref, set } from "firebase/database";
import { collection, query, where, getDoc, getDocs, setDoc, doc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'

function Result() {
    const { contextValue } = useContext(ResultContext);
    const [saveSummaryPopUp, setSaveSummaryPopUp] = useState(false);
    const [summary, setSummary] = useState('');
    const [transcript, setTranscript] = useState('');
    const [notes, setNotes] = useState('');
    const [summaryTitle, setSummaryTitle] = useState('');
    const [showCopied, setShowCopied] = useState(false);
    const titleRef = useRef(null);

    const [isActive, setIsActive] = useState(false);
    const copyHandler = () => {
        if (!isActive) {
            navigator.clipboard.writeText(summary);
            setShowCopied(true);
        } else {
            navigator.clipboard.writeText(transcript);
            setShowCopied(true);
        }

        setTimeout(() => {
            setShowCopied(false);
        }, 1500);
    }


    const showTranscript = () => {
        setIsActive(true);
    }

    const showSummary = () => {
        setIsActive(false);
    }
    const saveSummaryHandler = () => {
        setSaveSummaryPopUp(true);
    }
    const saveSummaryToDatabase = async () => {
        const user = localStorage.getItem('user');
        const userId = JSON.parse(user).uid;
        const title = titleRef.current.value;

        // Ensure that both title and summary are not empty before saving
        if (title.trim() === '' || summary.trim() === '') {
            // Handle the case where either title or summary is empty
            console.error('Title or summary is empty');
            return;
        }

        // Get a reference to the Firebase database
        const userDocRef = doc(db, "summaries", userId);

        // Get the existing summaries for the user
        const userDocSnapshot = await getDoc(userDocRef);
        let existingSummaries = [];

        if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            if (userData && userData.summaries) {
                existingSummaries = userData.summaries;
            }
        }

        // Create an object containing the title and summary
        const summaryData = {
            title: title,
            summary: summary,
        };

        // Add the new summaryData to the existing list of summaries
        existingSummaries.push(summaryData);

        // Update the user document with the new list of summaries
        await setDoc(
            userDocRef,
            { summaries: existingSummaries },
            { merge: true }
        );

        alert('Summary saved successfully');
        setSaveSummaryPopUp(false);

        console.log('Save summary to database');
    };




    const saveSummaryPopUpCancel = () => {
        setSaveSummaryPopUp(false);
    }

    useEffect(() => {
        const { summary, transcript, notes } = contextValue
        setSummary(summary);
        setTranscript(transcript);
        setNotes(notes);
    }, [])

    return (
        <div className='result_main'>
            <div className='result_container'>
                <nav className='result_tabs'>
                    <div className={!isActive ? 'result_tab result_tab_summary active-tab' : 'result_tab result_tab_summary'} onClick={showSummary}>
                        <p>Summary</p>
                    </div>
                    <div className={isActive ? 'result_tab result_tab_trans active-tab' : 'result_tab result_tab_trans'} onClick={showTranscript}>
                        <p>Transcript</p>
                    </div>
                </nav>
                <div className='result_content'>
                    <div className='result_content_nav'>
                        <CopyIcon size={20} className='copyIcon' onClick={copyHandler} />
                        {showCopied && <p>copied</p>}
                    </div>
                    {!isActive ? <div className='contentX'>
                        <p>{summary}</p>
                        <button className='save_summary_btn' onClick={saveSummaryHandler}>Save Summary</button>

                    </div> :
                        <div className='contentX'>
                            {transcript}
                        </div>}
                </div>
                {saveSummaryPopUp && <div className='save_summary_form'>
                    <input className='save_summary_input' ref={titleRef} type='text' placeholder='Write Title for your summary' value={summaryTitle} onChange={(e) => setSummaryTitle(e.target.value)} />
                    <button className='save_summary_btn2' onClick={saveSummaryToDatabase} >Save Summary</button>
                    <p className='save_summary_cancel' onClick={saveSummaryPopUpCancel}>Cancel</p>


                </div>}
            </div>
        </div>
    )
}

export default Result;