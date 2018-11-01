import {
  CREATE_DEVICE,
  BLOCKCHAIN_ERROR,
  UPDATE_CONTRACT,
  GOT_CONTRACT,
  GET_CONTRACT
} from '../actions'

const blockchain = (state = {
  error: "",
  name: "", 
  location: "", 
  url: "",
  fetching: false,
  contract: ""
  }, action) => {
  switch (action.type) {
    case UPDATE_CONTRACT:
      return Object.assign({}, state, {
        contract: action.contract,
        fetching: true
      })
    case GET_CONTRACT: 
      return Object.assign({}, state, {
        fetching: true
      })
    case GOT_CONTRACT:
      return Object.assign({}, state, {
        fetching: false,
        contract: action.contract
      })
    case CREATE_DEVICE:
      return Object.assign({}, state, {
        name: action.name,
        location: action.location,
        url: action.url,
        featching: true
      })
    case BLOCKCHAIN_ERROR: 
      console.log("blockchaing error: ", action.error)
      return Object.assign({}, state, {
        error: action.error,
        fetching: false
      })
    default:
      return state
  }
}
export default blockchain
