import React, { Fragment, useState } from 'react'
import { useHistory } from 'react-router-dom';

export function Logout () {
  const [] = useState('home')
  const his = useHistory()

  return (
    <Fragment>
      <div className='logout'>
        <p>ログアウトしました</p>
      </div>
      <input type="button" onClick={()=>his.push('/home')} value="Home" />
    </Fragment>
  );
}
