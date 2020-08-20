import React, { Component } from 'react';
import { } from 'react-router-dom';
import './App.css';

class App extends Component {
    state = {
        isStreamAvailable: false,
        streamUrl: null,
        localStream: null
    }

    vidRef = React.createRef();

    mediaReqHandler = async (e) => {
        const stream = await window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        this.setState({ isStreamAvailable: true });
        this.vidRef.current.srcObject = stream;
    }

    mediaDisReqHandler = async (e) => {
        const stream = await window.navigator.mediaDevices.getDisplayMedia();
        this.setState({ isStreamAvailable: true });
        this.vidRef.current.srcObject = stream;
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>Hello World!</p>
                    <button onClick={this.mediaReqHandler}>Click To Capture Video</button>
                    <button onClick={this.mediaDisReqHandler}>Click To Capture Screen</button>
                    {this.state.isStreamAvailable &&
                        <video autoPlay ref={this.vidRef} muted></video>
                    }
                </header>
            </div>
        );
    }
}

export default App;
