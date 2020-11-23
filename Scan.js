import React, { Fragment, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import QrReader from 'react-qr-reader'
import { GetParam, GetQuery } from './Util.js'

export function Scan ({args, setpwd}) {
  const {register, handleSubmit, errors} = useForm()
  const [delay, setdelay] = useState(500)
  const [result, setresult] = useState(args.p != null ? args.p : 'No result')
  const [facingMode, setfacingMode] = useState('environment')
  const [data, setData] = useState([])
  const [target, settarget] = useState([])
  const [st, setSt] = useState('scan')
  const [hiddenf, sethiddenf] = useState([])

  function handleScan(result) {
    if(result) {
      let param = GetParam(GetQuery(result))
      setresult(param.p)
    }
  }
  function changeState(exists) {
    if (st ==  'scan' || st == 'waitCreate' || st == 'waitMove'){
      if(exists) {
        setSt('waitMove')
      } else {
        setSt('waitCreate')
      }
    }

    if ((st ==  'create' || st ==  'move') && exists){setSt('waitSave')}
  }
  function handleError(err) {
    console.error(err)
  }
  function handleCameraToggle (event) {
    if (facingMode == 'user') {
      setfacingMode('environment')
    }
    if (facingMode == 'environment') {
      setfacingMode('user')
    }
  }
  function handleTarget (e) {
    setSt(e.target.name)
    settarget(result)
  }
  const previewStyle = {
    height: 320,
    width: 320,
  }
  function resetMode(){
    setresult('No result')
    setData([])
    settarget([])
    setSt('scan')
    sethiddenf([])
  }

  useEffect( () => {
    // const data = { title, body }
    // const requestOptions = {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   // body: JSON.stringify(data)
    // }
    //  fetch(args.endpoint, requestOptions)
    //   .then(response => response.json())
    //   .then(res => {
    //     console.log(res)
    //     setData(res)
    //   })
    const fetchData = (d) => {
      return (idstr) => {
        return (callback) => {
          let db = args.firebase.firestore()
          db.collection("things")
            // .where("uid", "==", idstr)
            .doc(idstr)
            .get()
            .then((doc) => {
              changeState(doc.exists)
              if (doc.exists) {
                console.log(doc.id, " => ", doc.data())
                callback(d.concat({
                  uid: doc.id,
                  ...doc.data()
                }))
              } else {
                console.log('doc is not exist')
              }
            })
            .catch(function(error) {
              console.error("Error: ", error)
            })
        }
      }
    }

    const getRecurse = (things) => {
      if(things[things.length -1].ref != '/') {
        return fetchData(things)(things[things.length -1].ref)(getRecurse)
      }
      sethiddenf(hiddenf.concat(things[0].uid))
      // setData(data.concat([things.reverse()]))
      setData([].concat([things.reverse()]))
      console.log('getRecurse data => ', data)
      }

    setData([])
    if(result != 'No result'){
      fetchData([])(result)((ds) => {
        getRecurse(ds)
      })
    }
  }, [result])

  function SaveRelation (fm, e) {
    const save = (uid, docs) => {
      console.log('save', uid, result, `${Date()}`)
      let db = args.firebase.firestore()
      db.collection("things")
      .doc(uid)
      .set(docs)
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef)
        setData([])
      })
      .catch(function(error) {
        console.error("Error adding document: ", error)
      })
    }

    if (e.target.name == 'trunk'){
      const docs = {
        ref: '/',
        datetime: args.firebase.firestore.Timestamp.fromDate(new Date()),
        dai: fm.dai,
        tyuu: fm.tyuu,
        syou: fm.syou,
      }
      save(result, docs)
    } else {
      const docs = {
        ref: result,
        datetime: args.firebase.firestore.Timestamp.fromDate(new Date())
      }
      save(target, docs)
    }

    resetMode()
  }

  function showlist(e) {
    if(hiddenf.some( hf => hf == e.target.name)){
      return sethiddenf(hiddenf.filter(hf => hf != e.target.name))
    } else {
      return sethiddenf(hiddenf.concat(e.target.name))
    }
  }

  const CreateElem = (() => {
    if (st == 'waitCreate') {
      return(
        <Fragment>
          <input type="button" name='create'  onClick={handleTarget} value="Create" />
          <form name='trunk' onSubmit={handleSubmit(SaveRelation)} style={{display: 'inline-block'}}>
            <input name="dai"  placeholder="大分類" ref={register({ required: true})} /><br />
            <input name="tyuu" placeholder="中分類" ref={register({ required: true})} /><br />
            <input name="syou" placeholder="小分類" ref={register({ required: true})} /><br />
            <input type="submit" value='Trunk' />
          </form>
        </Fragment>
      )
    }
    if (st == 'waitMove') {
      return(
        <Fragment>
          <input type="button" name='move' onClick={handleTarget} value="Move" />
        </Fragment>
      )
    }
    return false;
  })
  const SaveElem = (() => {
    if (st == 'waitSave') {
      return(
        <Fragment>
          <input type="button" name={result} onClick={(e) => SaveRelation({}, e)} value="Save"/>
        </Fragment>
      )
    }
    return false;
  })

  const ReadThings = (() => {
    if (data.length != 0) {
      return (
        <Fragment>
        <ul>
        {data.map((p) => {
          return (
            <li key={p[p.length-1].uid} className='docmentlist'>
              <a name={p[p.length-1].uid} onClick={showlist}>大分類：{p[0].dai} 中分類：{p[0].tyuu} 小分類：{p[0].syou}</a>
              <ul hidden={hiddenf.some( hf => hf == p[p.length-1].uid)}><li>uid:{p[0].uid}</li></ul>
            </li>
          )
        })}
        </ul>
        </Fragment>
      )
    }
    return false;
  })

  return (
    <Fragment>
      <input type="button" name="cameraToggle" onClick={handleCameraToggle} value="toggle" />
      <input type="button" name='reset' onClick={resetMode} value="Reset"/>
      <QrReader
        delay={delay}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
        facingMode={facingMode}
        />
      <p>{result}</p>


      <ReadThings />


      <CreateElem />
      <SaveElem />
    </Fragment>
  )
  }


