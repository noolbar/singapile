import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';

export function Header ({args}) {
  const [login, setlogin] = useState( false )
  const his = useHistory()

  function handleLogin(e) {
    setlogin(!login)
    if(e.target.name == 'Logout') {
      his.push('/logout')
    }
  }

  return (
    <div className='header'>
      <a href={args.baseurl}><img src="./res/logo_200x100.png" alt='singapile'></img></a>
      <input type="button" className='button' name={ !login ? 'Login' : 'Logout' } onClick={handleLogin} value={ !login ? 'Login' : 'Logout' } />
    </div>
  )
}
