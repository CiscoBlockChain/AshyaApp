import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'
import { createDevice, getContract, updateContract } from '../actions'
import Welcome from '../components/Welcome'
import Wizard1 from '../components/Wizard1'
import Wizard2 from '../components/Wizard2'
import Wizard3 from '../components/Wizard3'
import Wizard4 from '../components/Wizard4'
import Main from '../components/Main'
import CError from '../components/CError'
import * as contract from '../contract'
import web3 from 'web3';
import  Web3 from 'web3'
import Web3 from 'web3';
import * as contract from '../contract'

class Wizard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contractName: this.props.contractName || "myRaspberryPi",
      contractLocation: this.props.contractLocation || "Berlin, Germany",
      contractURL: this.props.contractURL || "https://example.com",
      fetching: this.props.fetching,
      contract: this.props.contract,
      error: this.props.error,
      pageForward: true,
      currentPage: 1,
    }
    this.provider = "";
    this.renderPage = this.renderPage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.createContract = this.createContract.bind(this);
    this.validate = this.validate.bind(this);
  }
 

  //addWeb3() 
  componentDidMount() {
    var self = this;
    window.addEventListener('load', function() {
      if (typeof window.web3 !== 'undefined') {
        self.setState({isConnected: true})
        self.provider = new Web3(window.web3.currentProvider)
        console.log(self.provider)
      }else {
        console.log("no web3 provided.")
      }
    })
    this.props.getContract()
  }
  
  componentWillReceiveProps(nextProps) {
    var address = nextProps.contract || ""
    var err = nextProps.error || ""
    console.log("next props received: " + nextProps.contract)
    console.log("error? " + nextProps.error)
    this.setState({
      contract: address,
      error: err,
    })
  }


  /* changing form values */
  handleChange = (event) => {
    const s = this.state
    switch(event.target.id) {
      case "contractName":
        s.contractName = event.target.value;
        break;
      case "contractLocation":
        s.contractLocation = event.target.value;
        break;
      case "contractURL":
        s.contractURL = event.target.value;
        break;
      default:
    }
    this.forceUpdate();
  }

  createContract = () => {
    // get the account
    let account = this.provider.eth.accounts[0]
    // estimate gas
    let gasEstimate = this.provider.eth.estimateGas({ data: contract.bytecode });
    // get this from etherscane
    var abiArray = contract.abiArray;
    //var MyContract = w3.eth.contract(abiArray);
    let deviceContract = this.provider.eth.contract(abiArray);

    /* https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#new-contract */
    deviceContract.new({ from: account,
                       data: contract.bytecode,
                       gas: gasEstimate,
                       arguments: [this.state.contractName, this.state.contractLocation, this.state.contractUrl]
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

  }

  validate = () => {
    var tokenInst;
    var transactionApproval;
    var selectedPlanCost;
    var requestApproval;
    if (typeof web3 !== 'undefined'){
      console.log('MetaMask is installed')
      web3.eth.getAccounts(function(err, accounts){
        if (err != null) {
          console.log(err)
        }
        else if (accounts.length === 0) {
          console.log('MetaMask is locked')
        }
        else {
          console.log('MetaMask is unlocked')
        
          tokenInst.balanceOf(
            web3.eth.accounts[0], 
            function (error, result) {
       
            if (!error && result) {
              var balance = result.c[0];
              if (balance < selectedPlanCost * (100000000)) {
                console.log('MetaMask has not balance')
                return false;
              }
              console.log('MetaMask has balance')
              if (transactionApproval === true ){
                requestApproval();
                transactionApproval = false;
              }
            }
            else {
              console.error(error);
            }
            return false;
          });
        }
      });
    } 
    else{
      console.log('MetaMask is not installed')
    }

  }

  deleteContract = () => {
    this.props.updateContract("foo")
  }

  /* for changing pages in the form */
  nextPage = (pageId) => {
    const s = this.state
    /* see if we go backwards or forward */
    if( pageId < this.state.currentPage ){
      s.pageForward = false
    }else {
      s.pageForward = true
    }
    s.currentPage = pageId
    this.forceUpdate();
  }

  render() {
    if(this.state.error){
      return (
        <CError err={this.state.error}/>
      )
    }
    return (
      this.state.contract === "" ? 
        <ReactCSSTransitionGroup
          transitionName={ this.state.pageForward ? "page" : "prev" }
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
        {this.renderPage()}
        </ReactCSSTransitionGroup>
      :
        <Main address={this.state.contract} deleteFunc={this.deleteContract}/> 
    )
  }


  /* render the pages of the form using transition groups */
  renderPage() {
    switch (this.state.currentPage) {
      case 1:
        return (<Welcome key={1} nextClick={() => this.nextPage(2)} w3={this.provider}/>);
      case 2:
        return (<Wizard1 key={2} 
                contractName={this.state.contractName} 
                handleChange={this.handleChange} 
                prevClick={() => this.nextPage(1)}
                nextClick={() => this.nextPage(3)}/>);
      case 3:
        return (<Wizard2 key={3}
                contractLocation={this.state.contractLocation} 
                handleChange={this.handleChange} 
                prevClick={() => this.nextPage(2)}
                nextClick={() => this.nextPage(4)}/>);
      case 4:
        return (<Wizard3 key={4}
                contractURL={this.state.contractURL} 
                handleChange={this.handleChange} 
                prevClick={() => this.nextPage(3)}
                nextClick={() => this.nextPage(5)}/>);
      case 5:
        return (<Wizard4 key={5}
                contractName={this.state.contractName} 
                contractLocation={this.state.contractLocation} 
                contractURL={this.state.contractURL} 
                prevClick={() => this.nextPage(4)}
                createContract={this.createContract}/>);
    
      default:
        return (<Welcome nextClick={() => this.setState({currentPage: 2})}/>)
    }
  }  
}

const mapStateToProps = (state, ownProps) => ({
  contractName: state.blockchain.name,
  contractLocation: state.blockchain.location,
  contractURL: state.blockchain.url,
  fetching: state.blockchain.fetching,
  contract: state.blockchain.contract,
  error: state.blockchain.error
})

const mapDispatchToProps = (dispatch) => ({
  createDevice: (name, loc, url) => dispatch(createDevice(name, loc, url)),
  getContract: () => dispatch(getContract()),
  updateContract: (address) => dispatch(updateContract(address)),
})


export default connect(
  mapStateToProps,
  mapDispatchToProps)(Wizard) 
