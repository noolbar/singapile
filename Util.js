function GetParam (urlParamStr) {
  let params = {}

  if (urlParamStr) {
    urlParamStr = urlParamStr.substring(1)

    urlParamStr.split('&').forEach( param => {
      const temp = param.split('=')
      params = {
        ...params,
        [temp[0]]: temp[1]
      }
    })
  }
  return params
}

function GetQuery (url) {
  return url.substring(url.search(/[?]/g), url.length)
}

function AddData (arr, data) {
  if (arr.some(d => d.id == data.id)){
    return arr
  }
  return [
      ...arr,
      data
    ]
}

function foldr(func){
  return (init) => {
    return (arr) => {
      if (arr.length == 0) {
        return init
      }
      return func(arr.pop())(foldr(func)(init)(arr))
    }
  }
}

export {GetParam, GetQuery, AddData, foldr}
