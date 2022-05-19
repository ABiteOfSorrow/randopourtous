export default function searchRando(searchData = {}, action) {
  if (action.type === 'addData') {
    // console.log('reducer: ', action.dataAdd)
    return action.dataAdd
  } else {
    return searchData
  }
}
