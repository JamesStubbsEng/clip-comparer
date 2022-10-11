import logo from './logo.svg';
import './App.css';
import PlayButton from './PlayButton';
import ClipToggleButton from './ClipToggleButton';
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
      analyser2: null,
      gain1: null,
      gain2: null
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
    
    //track 1
    const track = audioContext.createMediaElementSource(audioElement1);

    const analyser1 = audioContext.createAnalyser();
    analyser1.fftSize = 2048;
    this.setState({analyser1: analyser1});

    const gainNode1 = audioContext.createGain();
    this.setState({gain1: gainNode1});

    track.connect(analyser1).connect(gainNode1).connect(audioContext.destination);

    // track 2
    const track2 = audioContext.createMediaElementSource(audioElement2);

    const analyser2 = audioContext.createAnalyser();
    analyser2.fftSize = 2048;
    this.setState({analyser2: analyser2});

    const gainNode2 = audioContext.createGain();
    this.setState({gain2: gainNode2});

    track2.connect(analyser2).connect(gainNode2).connect(audioContext.destination);
  }

  playButtonHandler(){
    // Check if context is in suspended state (autoplay policy)
    if (this.state.audioContext.state === 'suspended') {
      this.state.audioContext.resume();
    }
    // this.setState({playing:!this.state.playing});
    // !this.state.playing ? this.state.audioElement1.play() : this.state.audioElement1.pause();
    // !this.state.playing ? this.state.audioElement2.play() : this.state.audioElement2.pause();

    this.setState(prevState => {
      if(!prevState.playing){
        this.state.audioElement1.play();
        this.state.audioElement2.play();

        if(this.state.toggle){
          this.state.gain1.gain.value = 0;
          this.state.gain2.gain.value = 1;
        }
        else{
          this.state.gain1.gain.value = 1;
          this.state.gain2.gain.value = 0;
        }
      }
      else{
        this.state.audioElement1.pause();
        this.state.audioElement2.pause();
      }

      return {playing:!this.state.playing};
    });
  }

  clipToggleButtonHandler(){
    // Check if context is in suspended state (autoplay policy)
    if (this.state.audioContext.state === 'suspended') {
      this.state.audioContext.resume();
    }
    this.setState(prevState => {
      if(!prevState.toggle){
        this.state.gain1.gain.value = 0;
        this.state.gain2.gain.value = 1;
      }
      else{
        this.state.gain1.gain.value = 1;
        this.state.gain2.gain.value = 0;
      }

      return {toggle: !prevState.toggle};
    });
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
        <ClipToggleButton
        clipToggleButtonHandler = {() => this.clipToggleButtonHandler()}
        toggle = {this.state.toggle}
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
