import React from 'react';

class Clip extends React.Component{
    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount(){    
    }

    componentDidUpdate(){
        this.draw();  
    }

    draw(){
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');;
        context.fillStyle = "#0f0f0f";    
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = this.props.colour;
        const audioBuffer = this.props.audioBuffer;
        if(audioBuffer === null)
            return;



        const heightOfChannel = canvas.height / audioBuffer.numberOfChannels;
        const widthFactor = canvas.width / audioBuffer.length ;
        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
            const channelBuffer = audioBuffer.getChannelData(channel);
            for (let i = 0; i < audioBuffer.length; i += 1024) {
                if(i === 0)
                    context.moveTo(widthFactor * i, (heightOfChannel/2) * (1 - channelBuffer[i]) + channel * heightOfChannel);          
                else
                    context.lineTo(widthFactor * i, (heightOfChannel/2) * (1 - channelBuffer[i]) + channel * heightOfChannel);                  
            }
        }

        context.stroke();
    }

    render(){
        return(
            <div>
                <canvas ref={this.canvasRef} width="640" height="150"/>
            </div>
        );        
    }
}

export default Clip;