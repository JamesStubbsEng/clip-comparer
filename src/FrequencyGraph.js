import React from 'react';

class FrequencyGraph extends React.Component{
    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
    }
    componentDidMount(){        
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        context.fillStyle = '#00a00f'
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    }
    componentDidUpdate(){
        console.log(this.props);
    }
    render(){
        return(
            <div>
                <p>Hi there</p>
                <canvas ref={this.canvasRef}/>
            </div>
        );        
    }
}

export default FrequencyGraph;
