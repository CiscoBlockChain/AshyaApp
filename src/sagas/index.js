import {put, all, takeEvery } from 'redux-saga/effects'
import Web3 from 'web3'
import * as actions from '../actions'
import * as contract from '../contract'
//import blockchainAPI from '../services/blockchain'


export function* get_addresses() {
  var w3 = new Web3(new Web3.providers.HttpProvider('https://kovan.infura.io/1r0bIX2eewb5e9m2WAug'));
  if(!w3.isConnected()) {
    return yield put(actions.gotError("not connected to blockchain"))
  } 
  // get this from etherscane
  var abiArray = contract.abiArray;
  var MyContract = w3.eth.contract(abiArray);
  var contractAddress = contract.address;
  var registry = MyContract.at(contractAddress);
  const numOfElements = registry.getItemCount();
  console.log("number of elements = " + numOfElements)
  const results  = [];
  for (let i = 0; i < numOfElements; i++) {
    const addr = registry.getItemAtIndex(i);
    console.log(addr);
    const item = registry.getItem(addr)
    console.log(item);
    results.push(item);
    console.log(results);
  }
  return yield put(actions.gotAddresses(results))
} 

export function* watchBlockchainRequest() {
  yield takeEvery(actions.GET_ADDRESSES, get_addresses)
}

export default function* rootSaga() {
  yield all([
    watchBlockchainRequest(),
  ])
}
