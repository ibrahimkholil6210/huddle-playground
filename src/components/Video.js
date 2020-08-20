import React, { Component, createRef } from 'react';
import ioClient from 'socket.io-client';
import Peer from 'peerjs';
import './Video.css';

class Video extends Component {

    state = {
        roomid: null,
        peer: null,
        userid: null,
        localstream: null
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
                });
            });

            this.setState({ localstream: stream })

            io.on("user-connected", userid => {
                this.state.userid = userid;
                this.connectToNewUser(userid);
            });
        });
    }

    addVideoStream = (vidRef, stream) => {
        vidRef.current.srcObject = stream;
        vidRef.current.addEventListener("loadedmetadata", () => {
            vidRef.current.play();
        });
    }

    connectToNewUser = (userid) => {
        const call = this.state.peer.call(userid, this.state.localstream);
        call.on("stream", userVideoStream => {
            this.addVideoStream(this.remoteVideoRef, userVideoStream);
        });
        call.on("close", () => {
            this.remoteVideoRef.current.remove();
        })
    }

    getDisplayStream = async (e) => {
        const stream = await window.navigator.mediaDevices.getDisplayMedia();

        stream.oninactive = async () => {
            const camStream = await window.navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            this.addVideoStream(this.localVideoRef, camStream);
            this.state.peer.call(this.state.userid, camStream);
        }

        this.addVideoStream(this.localVideoRef, stream);
        this.setState((prev) => prev.localstream = stream);
        this.state.peer.call(this.state.userid, stream);
    }

    render() {
        return (
            <div className="video-container">
                <video muted ref={this.localVideoRef}></video>
                <video muted ref={this.remoteVideoRef}></video>
                <button onClick={this.getDisplayStream}>Share Screen</button>
            </div>
        );
    }
}

export default Video;