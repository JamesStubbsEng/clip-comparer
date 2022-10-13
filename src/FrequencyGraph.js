import React from 'react';

const freqArray = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
const freqStringArray = ["20", "50", "100", "200", "500", "1k", "2k", "5k", "10k", "20k"];

class FrequencyGraph extends React.Component{
    constructor(props){
        super(props);
        this.canvasBackgroundRef = React.createRef();
        this.canvasRef = React.createRef();
        this.canvasRef2 = React.createRef();
    }

    componentDidMount(){    
        requestAnimationFrame(() => this.loopingFunction());
    }

    componentDidUpdate(){
        this.drawBackground();  
    }

    loopingFunction(){
        requestAnimationFrame(() => this.loopingFunction());
        this.draw();
    }

    calculateX(i, length, context){

        // Center middle canvas x to ~2 kHz with log scale
        // using forumula logOfX = a*log10(x + 1)
        // where x = i_norm * (x_max - x_min)/(i_norm_max - i_norm_min)

        // intermediate equations:
        // a = 0.5 / (log10(x_2k + 1)),
        // x_2k = (f/(f_sample/2))*(x_max - x_min)
        // x_min = 0 and i_norm_min = 0, f = 2k
        // x_max = 10^(1/a) - 1

        // solve these 2 equations:
        // 1) x_max = (10^(1/a) - 1)) 
        // 2) x_max = ((f_sample/2)/f) * (10^(0.5/a) - 1)

        // results
        // a = 0.499
        // x_max - x_min = 99.5

        const x = (i/length)*(99.5);
        const logOfX = 0.499 * Math.log10(x + 1);
        return logOfX * context.canvas.width;
    }

    calculateXFromFrequency(freq, canvasContext){
        return this.calculateX(freq, this.props.audioContext.sampleRate/2, canvasContext);
    }

    draw(){
        const data = new Uint8Array(this.props.analyser1.frequencyBinCount);
        this.props.analyser1.getByteFrequencyData(data);
        const canvas = this.canvasRef.current;
        this.plotFreqGraph(data, canvas, "rgb(128,128,129, 1.0)");

        const data2 = new Uint8Array(this.props.analyser2.frequencyBinCount);
        this.props.analyser2.getByteFrequencyData(data2);
        const canvas2 = this.canvasRef2.current;

        this.plotFreqGraph(data2, canvas2, "rgb(44,44,45, 0.7)");
    }

    drawBackground(){
        const canvas = this.canvasBackgroundRef.current;
        const context = canvas.getContext('2d');
        context.fillStyle = "#0f0f0f";    
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = "grey";
        context.font = "10px Arial";
        
        //frequency markings
        freqArray.forEach((freq, index) => {
            //line
            context.beginPath();
            const x = this.calculateXFromFrequency(freq, context);
            context.moveTo(x, canvas.height);
            context.lineTo(x, 0);
            context.stroke();

            //text
            context.fillStyle = "white";
            context.fillText(freqStringArray[index], x + 1, 15);
        });
    }

    plotFreqGraph(data, canvas, color){
        if(canvas == null)
        return;

        const context = canvas.getContext('2d');
        const dataParm = [...data];      
              
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        const canvasTopMargin = 20;

        let region = new Path2D();
        dataParm.forEach((value, i) => {
            const x = this.calculateX(i, dataParm.length, context);
            //TODO: show values over 0 dB?
            // value is in dB from Web Audio API
            const y = canvas.height*(1-value/255);

            if(x === 0)
                region.moveTo(0, canvas.height);
            else 
                region.lineTo(x, ((canvas.height - canvasTopMargin)/canvas.height) * y + canvasTopMargin);
        });  
        
        region.closePath();

        context.fillStyle = color;
        context.fill(region);
    }

    render(){
        return(
            <div className = "freqBackground">
                <canvas ref={this.canvasBackgroundRef} width="640" height="250"/>
                <canvas ref={this.canvasRef} width="640" height="250"/>
                <canvas ref={this.canvasRef2} width="640" height="250"/>
            </div>
        );        
    }
}

export default FrequencyGraph;
