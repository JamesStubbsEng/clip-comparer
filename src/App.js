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
      file1: null,
      file2: null,
      playing: false,
      toggle: false,
      audioContext: null,
      audioElement1: null,
      audioElement2: null,
      analyser1: null,
      analyser2: null
    };
  }

  componentDidMount(){
    const AudioContext = window.AudioContext ||      window.webkitAudioContext;
    const audioContext = new AudioContext();

    this.setState({audioContext: audioContext})
    const audioElement1 = document.querySelector(".clip1");
    this.setState({audioElement1:audioElement1});
    const audioElement2 = document.querySelector(".clip2");
    this.setState({audioElement2:audioElement2})
    
    // tracks and analysers
    const track = audioContext.createMediaElementSource(audioElement1);
    track.connect(audioContext.destination);

    const analyser1 = audioContext.createAnalyser();
    track.connect(analyser1);
    analyser1.fftSize = 2048;
    this.setState({analyser1: analyser1});

    const track2 = audioContext.createMediaElementSource(audioElement2);
    track2.connect(audioContext.destination);

    const analyser2 = audioContext.createAnalyser();
    track2.connect(analyser2);
    analyser2.fftSize = 2048;
    this.setState({analyser2: analyser2});
  }

  playButtonHandler(){
    // Check if context is in suspended state (autoplay policy)
    if (this.state.audioContext.state === 'suspended') {
      this.state.audioContext.resume();
    }
    this.setState({playing:!this.state.playing});
    !this.state.playing ? this.state.audioElement1.play() : this.state.audioElement1.pause();
    !this.state.playing ? this.state.audioElement2.play() : this.state.audioElement2.pause();
  }

  handleDragDrop(file, isFile1){
    if(isFile1){
      this.setState({file1: file});
      const audioElement = document.querySelector(".clip1");
      const sourceAux = URL.createObjectURL(file);
      audioElement.src = sourceAux;
    }
    else{
      this.setState({file2: file});
      const audioElement = document.querySelector(".clip2");
      const sourceAux = URL.createObjectURL(file);
      audioElement.src = sourceAux;
    } 
  };
  
  render() {
    return (
      <div>
        <h1>Clip Comparer</h1>
        <DragDrop
          handleDragDrop = {(file) => this.handleDragDrop(file, true)}
          file = {this.state.file1}
        />
        <DragDrop
          handleDragDrop = {(file) => this.handleDragDrop(file, false)}
          file = {this.state.file2}
        />
        <audio className="clip1"></audio>
        <audio className="clip2"></audio>
        <PlayButton 
          playButtonHandler = {() => this.playButtonHandler()}
          playing = {this.state.playing} 
        />
        <FrequencyGraph 
        analyser1 = {this.state.analyser1}
        analyser2 = {this.state.analyser2}
        />
      </div>        
    );
  }
}


export default App;
