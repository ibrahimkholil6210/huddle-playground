import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CreateRoom from './components/CreateRoom';
import Video from './components/Video';
import './App.css';

const App = (props) => {
  return (
    <>
      <Switch>
        <Route path="/" exact component={CreateRoom} />
        <Route path="/:roomid" component={Video} />
      </Switch>
    </>
  );
}

export default App;
