import { useReducer, useEffect } from 'react'
import axios from 'axios'

const reducer = (state, action) => {
  switch (action.type) {
    case 'REQUESTS':
      return { ...state, loading: true };
    case 'SUCCESS':
      return { ...state, loading: false, data: action.data };
    case 'ERROR':
      return { ...state, loading: false, data: action.data, error: action.error };
    default:
      return state
  }
}


const Init = (url) => {

  const useGet = (resource, sufix = '.json') => {

    const [data, dispatch] = useReducer(reducer, { loading: true, data: {} })
    const carregar = async() => {
      dispatch({ type: 'REQUEST' })
      const res = await axios.get(url + resource +  sufix)
      dispatch({ type: 'SUCCESS', data: res.data })
    }
    useEffect(() => {
      carregar()
    }, [resource]);

    return {...data, refetch: carregar}
  }

  const usePost = (resource, sufix = '.json') => {

    const [data, dispatch] = useReducer(reducer, { loading: true, data: {} })

    const post = async(data) => {
      dispatch({ type: 'REQUESTS' })
      try{
      const res = await axios.post(url + resource + sufix, data)
        dispatch({ type: 'SUCCESS', data: res.data })
        return res.data
      }
      catch(e){
        dispatch({ type: 'ERROR', data:{}, error: e.response.data.error.message })
        return e.response.data
      }
    }
    return [data, post]
  }

  const useDelete = () => {

    const [data, dispatch] = useReducer(reducer, { loading: true, data: {} })
    const remove = async(resource) => {
      dispatch({ type: 'REQUEST' })
      const res = await axios.delete(url + resource + '.json')
      dispatch({ type: 'SUCCESS', data: res.data })
    }
    return [data,remove]
  }

  const usePatch = () => {

    const [data, dispatch] = useReducer(reducer, { loading: true, data: {} })
    const patch = async(resource, data) => {
      dispatch({ type: 'REQUEST' })
      const res = await axios.patch(url + resource + '.json',data)
      dispatch({ type: 'SUCCESS', data: res.data })
    }
    return [data,patch]
  }

  return { useGet, usePost, useDelete, usePatch}
}

export default Init
