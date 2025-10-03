import axios, {
    AxiosResponse,
    AxiosError
  } from "axios"
import { Endpoints } from "./Api.data"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ASYNC_STORAGES } from "./Storage"
import { getBaseUrl } from "../Appsetting"

interface AxiosOptions {
    query?: object
    headers?: object
    timeout?: number
    token?: string
    language?: string
    version?: string
  }

  const defaultHeaders = {
    'Content-Type': 'application/json;charset=utf-8'
  }
  
  const TAG = "API::"
  function baseAxios(options: AxiosOptions, isAuthRequired: boolean) {
    const token = `Bearer ${options.token}`
    // console.log(TAG, 'Base url: ', getBaseUrl())
    return axios.create({
      timeout: options.timeout || 300000,
      headers: isAuthRequired ? { ...defaultHeaders } : defaultHeaders,
      // headers: isAuthRequired ? { ...defaultHeaders, Authorization: token } : defaultHeaders,
      baseURL: getBaseUrl()
    })
  }
  
  type METHODS = 'get' | 'post' | 'put' | 'delete' | 'patch'
  
  async function executeRequest(
    method: METHODS,
    endpoint: Endpoints | string,
    data: string | null | object | undefined,
    options: AxiosOptions
  ): Promise<AxiosResponse> {
  
    const body = method === 'get' || !data ? {} : { data }
  
    const reqObj: Object = {
      method,
      url: endpoint,
      params: options.query,
      headers: {
        ...options.headers,
        Accept: options.version ? options.version : 'application/json; version=1.0',
        language: options.language,
        Source: 'MOBILE_APP'
      },
      ...body
    }
  
    //console.log(TAG, 'reqObj = ', reqObj);
  
    const baseAxiosRequest = baseAxios(options, false)
  
    baseAxiosRequest.interceptors.response.use(
      (response: AxiosResponse) => {
       // console.log(TAG, endpoint, response?.status)
        return response
      },
      (error: AxiosError) => {
        switch (error.response?.status) {
          case 400:
            //console.log(TAG, endpoint, "400", " Bad Request")
            break;
          case 401:
            //console.log(TAG, endpoint, "401", " Unauthorized")
            // if (!INTERCEPT_BLACKLIST.includes(endpoint)) {
            //   _navigate(RouteNames.force)
            //   _goBackNavigator()
            //   forceLogout()
            // }
            break;
          case 403:
            //some some things went wrong
            //(TAG, endpoint, "403", endpoint, "400", " Forbidden")
            break;
          case 404:
            //(TAG, endpoint, "404", " Not Found")
            break;
          case 429:
            console.log(TAG, endpoint, "429", " Too Many Requests")
            break;
          case 500:
            console.log(TAG, endpoint, "500", " Internal Server Error")
            break;
          case 501:
            console.log(TAG, endpoint, "501", " Not Implemented")
            break;
          case 502:
            console.log(TAG, endpoint, "502", " Bad Gateway")
            break;
          case 503:
            console.log(TAG, endpoint, "503", " Service Unavailable")
            break;
          case 504:
            console.log(TAG, endpoint, "504", " Gateway Timed Out")
            break;
          case 510:
            // _navigateParams(RouteNames.systemMaintenance, { error: error.response.data })
            break
          default: console.log(TAG, endpoint, "default", "Nothing to do here")
        }
        
        return Promise.reject(error)
      }
    )
  
    const isInternetConnected = await AsyncStorage.getItem(ASYNC_STORAGES.IsInternetConnected)
    const isInternetReachable = await AsyncStorage.getItem(ASYNC_STORAGES.IsInternetReachable)
  
    if (isInternetConnected === 'true' && isInternetReachable === 'true') {
      return new Promise(async (resolve, reject) => {
        return baseAxiosRequest.request(reqObj).then(
          (res: AxiosResponse) => {
            console.log(TAG, `${endpoint} Axios Resolve: `, res)
            resolve(res)
          },
          (rej: AxiosError) => {
            console.log(TAG, `${endpoint} Axios Reject: `, rej?.response?.status)
            reject(rej.response)
          }
        ).catch((rej: AxiosError) => {
          console.log(TAG, `${endpoint} Axios Reject: `, rej?.response?.status)
          reject(rej.response)
        })
      })
    }
    else {
      return new Promise(async (resolve, reject) => {
        return baseAxiosRequest.request(reqObj).then(
          (res: AxiosResponse) => {
            console.log(TAG, `${endpoint} Axios Reject no internet response : `, res)
            resolve(res)
          },
          (rej: AxiosError) => {
            console.log(TAG, `${endpoint} Axios Reject no internet error : `, rej.response)
            reject({
              isFullScreenError: false, //method === 'get' ? true : false
              data: rej.response ? rej.response.data ? rej.response.data : { "message": "Please open the internet" } : { "message": "Please open the internet" },
              status: rej.response ? rej.response.status ? rej.response.status : 0 : 0
            })
          }
        ).
          catch((rej: AxiosError) => {
            console.log(TAG, `${endpoint} Axios Reject: `, rej.response?.status)
            reject(rej.response)
          })
      })
    }
  }

export default {
    get(
      endpoint: Endpoints | string,
      options: AxiosOptions
    ): Promise<AxiosResponse> {
      return executeRequest('get', endpoint, null, options)
    },
  
    post(
      endpoint: Endpoints | string,
      data: object,
      options: AxiosOptions,
      convertDataToString: boolean = true,
    ): Promise<AxiosResponse> {
      return executeRequest('post', endpoint, convertDataToString ? JSON.stringify(data) : data, options)
    },
  
    put(
      endpoint: Endpoints | string,
      data: object,
      options: AxiosOptions
    ): Promise<AxiosResponse> {
      console.log(TAG, 'Axios put url: ', endpoint)
      console.log(TAG, 'Axios put data: ', data)
      console.log(TAG, 'Axios put options: ', options)
      return executeRequest('put', endpoint, JSON.stringify(data), options)
    },
  
    delete(
      endpoint: Endpoints | string,
      data: object,
      options: AxiosOptions
    ): Promise<AxiosResponse> {
      console.log(TAG, 'Axios delete url: ', endpoint)
      console.log(TAG, 'Axios delete data: ', data)
      console.log(TAG, 'Axios delete options: ', options)
      return executeRequest('delete', endpoint, JSON.stringify(data), options)
    },
  
    patch(
      endpoint: Endpoints | string,
      data: object,
      options: AxiosOptions,
      convertDataToString: boolean = true,
    ): Promise<AxiosResponse> {
      console.log(TAG, 'Axios patch url: ', endpoint)
      console.log(TAG, 'Axios patch data: ', data)
      console.log(TAG, 'Axios patch options: ', options)
      return executeRequest('patch', endpoint, convertDataToString ? JSON.stringify(data) : data, options)
    },
  
    all(promises: Array<Promise<any>>) {
      return axios.all(promises)
    }
  }