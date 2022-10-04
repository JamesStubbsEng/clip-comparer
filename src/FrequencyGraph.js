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

    draw(){
        const data = new Uint8Array(this.props.analyser.frequencyBinCount);
        this.props.analyser.getByteFrequencyData(data);
        const canvas = this.canvasRef.current;

        if(canvas == null){
            console.log("canvas is null");
            return;
        }
            
        const context = canvas.getContext('2d');
        const dataParm = [...data];      
        
        context.fillStyle = "#050c03";    
        context.fillRect(0, 0, canvas.width, canvas.height)              
        context.lineWidth = 2; 
        context.strokeStyle = '#d5d4d5'; 
        const space = context.canvas.width / dataParm.length;

        dataParm.forEach((value, i) => {
            context.beginPath();
            context.moveTo(space * i, context.canvas.height); 
            context.lineTo(space * i, context.canvas.height*(1 - value/255)); 
            context.stroke();
        });         
    }

    render(){
        return(
            <div>
                <p>Marvelous frequency graph!</p>
                <canvas ref={this.canvasRef} width="540"/>
            </div>
        );        
    }
}

export default FrequencyGraph;
