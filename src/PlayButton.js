import React from 'react';

function PlayButton(props) {
    return (
      <button onClick={
        ()=>{
        props.playButtonHandler();
      }            
      }>
      {
        props.playing ? "Pause" : "Play"
      }
      </button>
    );
}

export default PlayButton;