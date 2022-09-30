import logo from './logo.svg';
import './App.css';
import PlayButton from './PlayButton';
import DragDrop from './DragDrop';
import FrequencyGraph from './FrequencyGraph';
import React from 'react';

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      playing: false,
      audioContext: null,
      audioElement: null,
      analyser: null
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

    //analyser
    const analyser = audioContext.createAnalyser();
    track.connect(analyser);
    analyser.fftSize = 2048;
    this.setState({analyser: analyser});
  }

  playButtonHandler(){
    // Check if context is in suspended state (autoplay policy)
    if (this.state.audioContext.state === 'suspended') {
      this.state.audioContext.resume();
    }
    this.setState({playing:!this.state.playing});
    !this.state.playing ? this.state.audioElement.play() : this.state.audioElement.pause();
  }

  handleDragDrop(file){
    this.setState({file: file});
    const audioElement = document.querySelector('audio');
    const sourceAux = URL.createObjectURL(file);
    console.log(sourceAux);
    audioElement.src = sourceAux;
  };
  
  render() {
    return (
      <div>
        <h1>Clip Comparer</h1>
        <DragDrop
          handleDragDrop = {(file) => this.handleDragDrop(file)}
          file = {this.state.file}
        />
        <audio></audio>
        <PlayButton 
          playButtonHandler = {() => this.playButtonHandler()}
          playing = {this.state.playing} 
        />
        <FrequencyGraph 
        analyser = {this.state.analyser}
        />
      </div>        
    );
  }
}


export default App;
