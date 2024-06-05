/*
  Component Description:
  This component represents a loading indicator displayed while a video is being processed. It includes a spinning loader animation, a message indicating that the video is being processed, and an estimated processing time.

  Dependencies:
  - None

  Props:
  - None

  State:
  - None

  Functions:
  - None

  CSS Classes:
  - loader_main: Main container for the loader.
  - loader_main_loader: Loader animation element.
  - loader_p: CSS class for the message indicating that the video is being processed.
  - estimated_time: CSS class for the estimated processing time message.

*/

import React from 'react';
import './Loader.css';

function Loader() {
    return (
        <div className='loader_main'>
            <div class="loader_main_loader"></div>
            <p className='loader_p'>Please wait while we process your video ...</p>
            <p className='estimated_time'>Estimated time: 10 min</p>
        </div>
    )
}

export default Loader;
