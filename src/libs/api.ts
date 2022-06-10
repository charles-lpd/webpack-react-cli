import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Book } from './types'
const validateStatus = function (status: number): boolean {
  return status >= 200 && status < 300 // default
}

const rConfig = {
  timeout: 5000,
  validateStatus,
  headers: {
    'Content-Type': 'application/json'
  }
}

export const sendRequest = async (
  config: AxiosRequestConfig
): Promise<AxiosResponse> => {
  return await new Promise((reslove, reject) => {
    axios({
      ...rConfig,
      ...config
    })
      .then((res: AxiosResponse) => {
        if (res.data !== undefined) {
          reslove(res)
        } else {
          reject(new Error(`${config.url ?? ''}: null response`))
        }
      })
      .catch((error) => {
        reject(new Error(error))
      })
  })
}

export const updateBook = async ():Promise<Book> => {
  const url = 'https://api.xygeng.cn/one'
  const result = await sendRequest({
    url,
    method: 'get'
  })
  return result.data.data
}
