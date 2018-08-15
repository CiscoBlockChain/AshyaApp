export const CREATE_DEVICE = 'CREATE_DEVICE'
export const BLOCKCHAIN_ERROR = 'BLOCKCHAIN ERROR'
export const GET_CONTRACT = 'GET CONTRACT'
export const GOT_CONTRACT = 'GOT CONTRACT'
export const UPDATE_CONTRACT = 'UPDATE CONTRACT'


export const createDevice = (n, l, u) => ({
  type: CREATE_DEVICE,
  name: n,
  location: l,
  url: u
})

export const gotError = (error) => ({
  type: BLOCKCHAIN_ERROR,
  error
})

export const getContract = () => ({
  type: GET_CONTRACT
})

export const gotContract = (contract) => ({
  type: GOT_CONTRACT,
  contract
})

export const updateContract = (contract) => ({
  type: UPDATE_CONTRACT,
  contract,
})
