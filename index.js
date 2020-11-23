import React, { Fragment, useState, useEffect } from 'react'
import ReactDOM from "react-dom";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import {Container} from './Container.js'
import {GetParam} from  './Util.js'
import './index.css';


let firebaseConfig = {
  apiKey: "AIzaSyBJBJoyiBdfAQkMFPTmdrArduJli-upA2g",
  authDomain: "singapile.firebaseapp.com",
  databaseURL: "https://singapile.firebaseio.com",
  projectId: "singapile",
  storageBucket: "singapile.appspot.com",
  messagingSenderId: "57727040401",
  appId: "1:57727040401:web:25a1d5660d701cd032b830",
  measurementId: "G-E6MX1WHLMJ"
}
firebase.initializeApp(firebaseConfig)

let args = GetParam(window.location.search);
args = {
  baseurl: "https://singapile.web.app/",
  endpoint: "https://jsonplaceholder.typicode.com/posts",
  firebase: firebase,
  ...args
}

let elm = (
    <Container args={args}/>
  );

const app = document.getElementById('app');
ReactDOM.render(elm, app);
