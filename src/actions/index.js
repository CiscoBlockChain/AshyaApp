export const CREATE_DEVICE = 'CREATE_DEVICE'
export const BLOCKCHAIN_ERROR = 'BLOCKCHAIN ERROR'

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
