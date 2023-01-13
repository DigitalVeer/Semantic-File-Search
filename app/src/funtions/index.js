import { store } from '../redux/store/store'

// window.localStorage.setItem('batches')

export const getSavedBatches = () => {
  let batches = JSON.parse(window.localStorage.getItem('batches'))
  if (batches) return batches
  else return []
}

export const saveBatch = (files, title) => {
  let batches = JSON.parse(window.localStorage.getItem('batches'))
  if (!batches) batches = []
  batches.unshift({ title, files, date: new Date().toDateString() })

  console.log(batches)

  if (batches.length > 3) batches.pop()
  console.log(batches)

  window.localStorage.setItem('batches', JSON.stringify(batches))
  return batches
}

export const getEndPoint = () => {
  let endPoint = window.localStorage.getItem('endPoint')
  let fullAddress
  if (endPoint) {
    endPoint = JSON.parse(endPoint)
    fullAddress = 'http://' + endPoint.ip + ':' + endPoint.port
  }
  return fullAddress
}
