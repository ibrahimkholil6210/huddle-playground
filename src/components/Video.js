import React, { Component, createRef } from 'react';
import ioClient from 'socket.io-client';
import Peer from 'peerjs';
import './Video.css';

class Video extends Component {

    state = {
        roomid: null,
        peer: null
    }

    localVideoRef = createRef();
    remoteVideoRef = createRef();

    componentDidMount() {
        const io = ioClient('http://127.0.0.1:1337');
        const { roomid } = this.props.match.params;
        this.setState({ roomid })


        const myPeer = new Peer(undefined, {
            host: "/",
            port: '3001'
        });

        this.setState({ peer: myPeer })

        myPeer.on('open', id => {
            io.emit("join-room", roomid, id);
        });

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            this.addVideoStream(this.localVideoRef, stream);
            myPeer.on("call", call => {
                call.answer(stream);
                call.on("stream", userVideoStream => {
                    this.addVideoStream(this.remoteVideoRef, userVideoStream);
                })
            })
            io.on("user-connected", userid => {
                this.connectToNewUser(userid, stream);
            });
        })
    }

    addVideoStream = (vidRef, stream) => {
        vidRef.current.srcObject = stream;
        vidRef.current.addEventListener("loadedmetadata", () => {
            vidRef.current.play();
        });
    }

    connectToNewUser = (userid, stream) => {
        const call = this.state.peer.call(userid, stream);
        console.log(this.state)
        call.on("stream", userVideoStream => {
            this.addVideoStream(this.remoteVideoRef, userVideoStream);
        });
        call.on("close", () => {
            this.remoteVideoRef.current.remove();
        })
    }

    render() {
        return (
            <div className="video-container">
                <video muted ref={this.localVideoRef}></video>
                <video ref={this.remoteVideoRef}></video>
            </div>
        );
    }
}

export default Video;