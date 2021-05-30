import React, { useState, useEffect } from 'react';
import useNonInitialEffect from 'hooks/useNonInitialEffect';
import { BrowserRouter as Router, Switch, Route, Link, useHistory, useLocation, Redirect } from 'react-router-dom';
import { HelpOutlineOutlined } from '@material-ui/icons';

import Auth from 'components/Auth/Auth';

function Test() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(`count ${count}`);
    return () => {
      console.log('regular did mount');
    };
  }, [count]);
  useNonInitialEffect(() => {
    console.log(`non initial count ${count}`);
    return () => {
      console.log('non initial - did mount');
    };
  }, [count]);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}></button>
    </div>
  );
}
function Index() {
  return <Redirect to="/dashboard" />;
}
export default Index;
