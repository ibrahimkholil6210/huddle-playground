import React, { useState, useEffect } from 'react';
import shortid from 'shortid';

const CreateRoom = (props) => {

    const [roomid, setRoomid] = useState(shortid.generate())

    useEffect(() => {
        setTimeout(() => {
            props.history.push(`/${roomid}`)
        }, 3000);
    }, [])

    return (
        <div>{roomid}</div>
    );
}

export default CreateRoom;