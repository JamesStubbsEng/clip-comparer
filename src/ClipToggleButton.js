import React from 'react';

function ClipToggleButton(props) {
    return (
      <button onClick={
        ()=>{
        props.clipToggleButtonHandler();
      }            
      }>
      {
        props.toggle ? "Clip 2" : "Clip 1"
      }
      </button>
    );
}

export default ClipToggleButton;