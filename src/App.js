import logo from './logo.svg';
import './App.css';
import PlayButton from './PlayButton';
import React from 'react';

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      song: process.env.PUBLIC_URL + 'At_Dooms_Gate.mp3',
      //song: process.env.PUBLIC_URL + 'PRESSURE.wav',
      playing: false,
      audioContext: null,
      audioElement: null
    };
  }

  componentDidMount(){
      const AudioContext = window.AudioContext ||      window.webkitAudioContext;
      const audioContext = new AudioContext();
      this.setState({audioContext: audioContext})
      const audioElement = document.querySelector('audio');
      this.setState({audioElement:audioElement})
      const track = audioContext.createMediaElementSource(audioElement);
      track.connect(audioContext.destination);
  }

  playButtonHandler(){
    // Check if context is in suspended state (autoplay policy)
    if (this.state.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    this.setState({playing:!this.state.playing});
    !this.state.playing ? this.state.audioElement.play() : this.state.audioElement.pause();
  }
  
  render() {
    return (
      <div>
        <h1>Clip Comparer</h1>
        <audio src={this.state.song}></audio>
        <PlayButton 
          playButtonHandler = {() => this.playButtonHandler()}
          playing={this.state.playing} 
        />
      </div>

    );
  }
}


export default App;
