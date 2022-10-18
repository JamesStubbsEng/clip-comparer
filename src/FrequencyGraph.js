import React from 'react';

const freqArray = [20, 60, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
const freqStringArray = ["20", "60", "125", "250", "500", "1k", "2k", "4k", "8k", "16k"];

const dBMarkingValues = [-80, -60, -40, -20, -10, 0];

const canvasTopMargin = 20;

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

        // Center middle canvas x to a given frequency 'f' with log scale
        // using forumula logOfX = a*log10(x + 1)
        // where x = i_norm * (x_max - x_min)/(i_norm_max - i_norm_min)

        // intermediate equations:
        // a = 0.5 / (log10(x_f + 1)),
        // x_f = (f/(f_sample/2))*(x_max - x_min)
        // x_min = 0 and i_norm_min = 0, f = 750, f_sample = 44000
        // x_max = 10^(1/a) - 1

        // solve these 2 equations:
        // 1) x_max = (10^(1/a) - 1)) 
        // 2) x_max = ((f_sample/2)/f) * (10^(0.5/a) - 1)

        // results
        // a = 0.367
        // x_max - x_min = 529.6

        const x = (i/length)*(529.6);
        const logOfX = 0.367 * Math.log10(x + 1);
        return logOfX * context.canvas.width;
    }

    calculateXFromFrequency(freq, canvasContext){
        return this.calculateX(freq, this.props.audioContext.sampleRate/2, canvasContext);
    }

    draw(){
        const data = new Float32Array(this.props.analyser1.frequencyBinCount);
        this.props.analyser1.getFloatFrequencyData(data);
        const canvas = this.canvasRef.current;
        this.plotFreqGraph(data, canvas, "rgb(128,128,129, 1.0)");

        const data2 = new Float32Array(this.props.analyser2.frequencyBinCount);
        this.props.analyser2.getFloatFrequencyData(data2);
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

        // dB markings
        dBMarkingValues.forEach(value => {
            const yValueOnCanvas = this.getYValueOnCanvas(value, canvas.height);
            const yValueOnCanvasAfterMargin = ((canvas.height - canvasTopMargin)/canvas.height) * yValueOnCanvas + canvasTopMargin;
            //line
            context.beginPath();
            context.moveTo(0, yValueOnCanvasAfterMargin);
            context.lineTo(canvas.width, yValueOnCanvasAfterMargin);
            context.stroke();

            //text
            context.fillStyle = "white";
            context.fillText(value.toString(), 5, yValueOnCanvasAfterMargin);
        });
    }

    getYValueOnCanvas(value, canvasHeight){
        // values between -100 dB and 0 dB.
        const clampedValue = value < -100 ? -100 : value;
        return canvasHeight*(-clampedValue/100);
    }

    plotFreqGraph(data, canvas, color){
        if(canvas == null)
        return;

        const context = canvas.getContext('2d');
        const dataParm = [...data];      
              
        context.clearRect(0, 0, canvas.width, canvas.height);

        let region = new Path2D();
        dataParm.forEach((value, i) => {
            const x = this.calculateX(i, dataParm.length, context);
            // note: value is in dB from Web Audio API.
            const y = this.getYValueOnCanvas(value, canvas.height);

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
