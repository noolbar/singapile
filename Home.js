import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom';

export function Home () {
  const [] = useState('home')

  return (
    <Fragment>
      <div className='home'>
        <p>QRコードを用いて文書やフォルダなどの関係性をまとめて、管理対象がどこに含まれてるか確認するソフトウェア</p>
      </div>
      <Link to='scan' style={{'font-size': '30px'}}> とにかく始める🎉 </Link>

      <br />
      <br />
      <p>Qiitaに解説記事を書きました。</p>
      <a href='https://qiita.com/noolbar/private/093d7e71e69c23c74c57' >https://qiita.com/noolbar/private/093d7e71e69c23c74c57</a>
      <p>ソースコードは、GitHubに挙げています。</p>
      <a href='https://github.com/noolbar/singapile' >https://github.com/noolbar/singapile</a>
    </Fragment>
  );
}
