import React, { useEffect } from 'react';
import ioClient from 'socket.io-client';

const Video = (props) => {

    useEffect(() => {
        const io = ioClient('http://127.0.0.1:1337');
        io.on("helloFromApi", (data) => console.log(data))
    }, [])

    return (
        <div>
            Channel Created! ready for action
        </div>
    );
}

export default Video;