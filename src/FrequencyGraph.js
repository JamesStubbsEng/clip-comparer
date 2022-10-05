import React from 'react';

class FrequencyGraph extends React.Component{
    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount(){        
        requestAnimationFrame(() => this.loopingFunction());
    }

    componentDidUpdate(){
        console.log(this.props);
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

        const x = (i/length)*(99.5);
        const logOfX = 0.499 * Math.log10(x + 1);
        return logOfX * context.canvas.width;
    }

    draw(){
        const data = new Uint8Array(this.props.analyser.frequencyBinCount);
        this.props.analyser.getByteFrequencyData(data);
        const canvas = this.canvasRef.current;

        if(canvas == null)
            return;
    
        const context = canvas.getContext('2d');
        const dataParm = [...data];      
        
        context.fillStyle = "#050c03";    
        context.fillRect(0, 0, canvas.width, canvas.height)      
        
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
        //context.fillStyle = "green";
        context.fillStyle = "#808081";
        context.fill(region);
    }

    render(){
        return(
            <div>
                <p>Marvelous frequency graph!</p>
                <canvas ref={this.canvasRef} width="640" height="250"/>
            </div>
        );        
    }
}

export default FrequencyGraph;
