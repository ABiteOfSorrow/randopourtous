export default function searchRando(searchData = {}, action) {
  if (action.type === 'addData') {
    console.log(action.data)
    return action.data
  } else {
    return searchData
  }
}
