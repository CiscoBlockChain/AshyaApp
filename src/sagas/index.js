import {put, all, call, takeEvery } from 'redux-saga/effects'
import Web3 from 'web3'
import * as actions from '../actions'
import * as contract from '../contract'
import collectorAPI from '../services/collector'


export function* createDev(action) {
  //var w3 = new Web3(new Web3.providers.HttpProvider('https://kovan.infura.io/1r0bIX2eewb5e9m2WAug'));
  var w3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'));
  if(!w3.isConnected()) {
    return yield put(actions.gotError("not connected to blockchain"))
  } 
  let account = w3.eth.accounts[0];
  w3.personal.unlockAccount(account, 'password');
  let gasEstimate = w3.eth.estimateGas({ data: contract.bytecode });
   
  // get this from etherscane
  var abiArray = contract.abiArray;
  //var MyContract = w3.eth.contract(abiArray);
  let deviceContract = w3.eth.contract(abiArray);

  /* https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#new-contract */
  deviceContract.new({ from: account,
                       data: contract.bytecode, 
                       gas: gasEstimate, 
                       arguments: [action.name, action.location, action.url] 
                    }, function(err, devContract){
    if(!err) {
      if(!deviceContract.address) {
        console.log("Hash: ", deviceContract.transactionHash);
      }else {
        console.log("Address: ", deviceContract.address);
      }
    }else {
      console.log(err)
    }

  });
    //return yield put(actions.createdDevice(results))
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
  //TODO: figure out what to return here.  What does the URL return? 
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
