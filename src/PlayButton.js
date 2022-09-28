import React from 'react';

export default class PlayButton extends React.Component{
    render() {
        return (
             <button onClick={
                ()=>{
                this.props.playButtonHandler();
              }            
             }>
              {
                this.props.playing ? "Pause" : "Play"
              }
             </button>
        );
    }
}
