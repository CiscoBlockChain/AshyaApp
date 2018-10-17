import {put, all, call, takeEvery } from 'redux-saga/effects'
import * as actions from '../actions'
import collectorAPI from '../services/collector'


export function* createDev(action) {
} 

export function* getContract(){
  let response = yield call(collectorAPI.getContract)
  if (response instanceof Error) {
    return yield put (actions.gotError(response))
  } 
  if (response.error) {
    return yield put (actions.gotError(response.error))
  }
  // returns:  { "address": "0x0d...." } we get the address
  // by yanking it out of the response.  
  yield put (actions.gotContract(response.address))
}

export function* updateContract(action){
  let response = yield call(collectorAPI.updateContract, { address : action.contract })
  if (response.error) {
    return yield put (actions.gotError(response.error))
  } 
  yield put (actions.getContract())
}

export function* watchBlockchainRequest() {
  yield takeEvery(actions.CREATE_DEVICE, createDev)
  yield takeEvery(actions.GET_CONTRACT, getContract)
  yield takeEvery(actions.UPDATE_CONTRACT, updateContract)
}

export default function* rootSaga() {
  yield all([
    watchBlockchainRequest(),
  ])
}
