import axios from 'axios'
import { getEndPoint } from '.'

console.log(axios.defaults.baseURL)

export const uploadFiles = (files, batchId) => {
  let endPoint = getEndPoint()
  return axios.post(`${endPoint}/data_upload/`, {
    data: files,
    batch_id: batchId,
  })
}

export const searchFiles = (batchId, query) => {
  let endPoint = getEndPoint()
  return axios.get(`${endPoint}/search/`, {
    params: {
      "batch_id": batchId,
      "query": query,
    },
  })
}
