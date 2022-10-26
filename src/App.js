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
      source1: null,
      source2: null,
      initTime1: 0,
      initTime2: 0,
      audioBuffer1: null,
      audioBuffer2: null,
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
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    const audioElement1 = document.querySelector(".clip1");
    const audioElement2 = document.querySelector(".clip2");
    
    //track 1
    const analyser1 = audioContext.createAnalyser();
    analyser1.fftSize = 2048;

    const gainNode1 = audioContext.createGain();

    analyser1.connect(gainNode1).connect(audioContext.destination);

    // track 2

    const analyser2 = audioContext.createAnalyser();
    analyser2.fftSize = 2048;

    const gainNode2 = audioContext.createGain();

    analyser2.connect(gainNode2).connect(audioContext.destination);

    // set state which updates DOM
    this.setState({
      audioContext: audioContext,
      audioElement1:audioElement1,
      audioElement2:audioElement2,
      analyser1: analyser1,
      gain1: gainNode1,
      analyser2: analyser2,
      gain2: gainNode2
    })
  }

  playButtonHandler(){
    this.setState(prevState => {
      const audioContext = this.state.audioContext;

      if(!prevState.playing){
        //recreate AudioBufferSourceNode      
        const source1 = audioContext.createBufferSource();
        source1.buffer = this.state.audioBuffer1;
        source1.connect(this.state.analyser1);
        source1.loop = true;
        source1.start();

        const source2 = audioContext.createBufferSource();
        source2.buffer = this.state.audioBuffer2;
        source2.connect(this.state.analyser2);
        source2.loop = true;
        source2.start();

        if(this.state.toggle){
          this.state.gain1.gain.value = 0;
          this.state.gain2.gain.value = 1;
        }
        else{
          this.state.gain1.gain.value = 1;
          this.state.gain2.gain.value = 0;
        }

        return {
          playing:!this.state.playing, 
          source1: source1, 
          source2: source2,
          initTime1: audioContext.currentTime,
          initTime2: audioContext.currentTime
        };
      }
      else{
        console.log("Current time - initTime1: " + String(audioContext.currentTime - prevState.initTime1));
        //call stop() on the AudioBufferSourceNode
        this.state.source1.stop();
        this.state.source2.stop();
      }

      return {playing:!this.state.playing};
    });
  }

  clipToggleButtonHandler(){
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
      this.readFileIntoAudioBuffer(file, isFile1);
    }
    else{
      this.setState({file2: file});
      this.readFileIntoAudioBuffer(file, isFile1);
    } 
  };

  readFileIntoAudioBuffer(file, isFile1){
    const audioContext = this.state.audioContext;
    const source = audioContext.createBufferSource();

    const reader = new FileReader();
    reader.onload = (e) => { 
      audioContext.decodeAudioData(
        e.target.result,
        (buffer) => {
          source.buffer = buffer;
          if(isFile1)
            this.setState({audioBuffer1: buffer});
          else
            this.setState({audioBuffer2: buffer});
        },
  
        (err) => console.error(`Error with decoding audio data: ${err.err}`)
      );
    };
    reader.readAsArrayBuffer(file);
  }
  
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
        audioContext = {this.state.audioContext}
        />
      </div>        
    );
  }
}


export default App;
