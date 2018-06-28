import {put, all, takeEvery } from 'redux-saga/effects'
import Web3 from 'web3'
import * as actions from '../actions'
import * as contract from '../contract'
//import blockchainAPI from '../services/blockchain'


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

export function* watchBlockchainRequest() {
  yield takeEvery(actions.CREATE_DEVICE, createDev)
}

export default function* rootSaga() {
  yield all([
    watchBlockchainRequest(),
  ])
}
