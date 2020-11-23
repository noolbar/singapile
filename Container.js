import React, { useState } from 'react'
import { Scan } from './Scan.js'
import { Home } from './Home.js'
import { Logout } from './Logout.js'
import { BrowserRouter, Route, Switch, Link, useHistory } from 'react-router-dom';
import { Header } from './Header.js';

export function Container ({args}) {
  const [pwd, setpwd] = useState( 'home' )

  return (
    <BrowserRouter>
      <Header args={args}/>
      <div className='content'>

      <Switch>
        <Route path={['/', '/home']} exact children={<Home />} />
        <Route path='/scan' children={<Scan args={args} setpwd={setpwd} />} />
        <Route path='/logout' children={<Logout args={args} />} />
      </Switch>

      </div>
      <div className='footer'>
        <Link to='home'>Home </Link>
        <Link to='scan'>Getting Start </Link>
      </div>
    </BrowserRouter>
  );
}
