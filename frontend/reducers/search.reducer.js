export default function searchRando(searchData = {}, action) {
  if (action.type === 'addData') {
    return action.dataAdd
  } else {
    return searchData
  }
}
