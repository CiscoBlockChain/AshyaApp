import {
  CREATE_DEVICE,
  BLOCKCHAIN_ERROR
} from '../actions'

const blockchain = (state = {
  error: "",
  name: "", 
  location: "", 
  url: ""
  }, action) => {
  switch (action.type) {
    case CREATE_DEVICE:
      return Object.assign({}, state, {
        name: action.name,
        location: action.location,
        url: action.url
      })
    case BLOCKCHAIN_ERROR: 
      return Object.assign({}, state, {
        error: action.error
      })
    default:
      return state
  }
}
export default blockchain
