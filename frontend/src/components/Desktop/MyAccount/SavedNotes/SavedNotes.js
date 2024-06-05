/*
  Component Description:
  This component represents the section of the My Account page where saved notes or summaries are displayed. It fetches summaries from Firestore based on the user's ID and allows the user to select a summary from a dropdown list to view its details.

  Dependencies:
  - Firebase: Used for Firestore database.

  Props:
  - None

  State:
  - summaries: State variable to store an array of summaries fetched from Firestore.
  - selectedSummary: State variable to store the currently selected summary.

  Hooks:
  - useEffect: Used for performing side effects when the component mounts.
  - useState: Used for managing state within the component.

  Functions:
  - selectSelectedSummary: Function to handle the selection of a summary from the dropdown list.

  Sub-components:
  - SummaryList: Renders the dropdown list of summary titles and the details of the selected summary.

*/

import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../../../utils/Firebase';
import './SavedNotes.css';

// Sub-component for rendering the list of summaries and their details
function SummaryList({ summaries }) {
    const titleRef = React.createRef();
    const [selectedSummary, setSelectedSummary] = useState({});

    // Function to handle the selection of a summary from the dropdown list
    const selectSelectedSummary = () => {
        const title = titleRef.current.value;
        if (!title) return setSelectedSummary({});
        if (title === '') return setSelectedSummary({});
        const summary = summaries.find((summary) => summary.title === title);
        setSelectedSummary(summary);
    };

    return (
        <div className='summary_main'>
            <div className='summary_main_left'>
                <select className='select_sum_titles' onChange={selectSelectedSummary} ref={titleRef}>
                    <option value=''>Select a summary</option>
                    {summaries.map((summary, index) => (
                        <option key={index} className='summary_titles'>
                            {summary.title}
                        </option>
                    ))}
                </select>
            </div>
            <div className='summary_main_right'>
                <h2>{selectedSummary.title}</h2>
                <p>{selectedSummary.summary}</p>
            </div>
        </div>
    );
}

function SavedNotes() {
    const [summaries, setSummaries] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem('user');
        const userId = user && JSON.parse(user).uid;

        // Function to fetch saved summaries
        const fetchSummaries = async () => {
            // Replace 'YOUR_USER_ID' with the actual user ID
            const userDocRef = doc(db, "summaries", userId);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const summaries = userDoc.data().summaries || [];
                setSummaries(summaries);
            }
        };

        fetchSummaries(); // Fetch summaries when the component mounts
    }, []);

    return (
        <div>
            {summaries.length > 0 ? (
                <SummaryList summaries={summaries} />
            ) : (
                <p>No summaries saved yet.</p>
            )}
        </div>
    );
}

export default SavedNotes;
