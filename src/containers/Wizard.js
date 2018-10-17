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
import Web3 from 'web3';

class Wizard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contractName: this.props.contractName || "myRaspberryPi",
      contractLocation: this.props.contractLocation || "Berlin, Germany",
      contractURL: this.props.contractURL || "https://example.com",
      fetching: this.props.fetching,
      contract: this.props.contract,
      error: this.props.error, // for errors connecting to ashya collector
      merror: "", // for metamask errors.
      pageForward: true,
      currentPage: 1,
      accounts: [],
      provider: "",
    }
    this.renderPage = this.renderPage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.createContract = this.createContract.bind(this);
    this.validate = this.validate.bind(this);
  }
 

  //addWeb3() 
  componentDidMount() {
    var t = this;
    window.addEventListener('load', function() {
      if (typeof window.web3 !== 'undefined') {
        t.validate(t)
      }else {
        console.log("no web3 provided.")
      }
    })
    this.props.getContract()
  }

  validate = (t) => {
    t.setState({isConnected: true})
    var p = new Web3(window.web3.currentProvider)
    t.setState({provider : p})
    console.log('MetaMask is installed')
    p.eth.getAccounts(function(err, acc) {
      if (err) {
        console.error(err)
        t.setState({merror: err})
        return
      }
      if (acc.length === 0) {
        console.log('MetaMask is locked')
        t.setState({merror: "Metamask is locked"})
        return
      }
      t.setState({merror : ""})
      t.setState({accounts: acc});
    }) 
  }




  
  
  componentWillReceiveProps(nextProps) {
    var address = nextProps.contract || ""
    var err = nextProps.error || ""
    //console.log("next props received: " + nextProps.contract)
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
    // estimate gas
    this.state.provider.eth.estimateGas({ data: contract.bytecode }, this.cc1);
  }

  cc1 = (error, gasEstimate) => {

    if (error) {
      console.error(error);
      return;
    }
    console.log(gasEstimate)
    // get the account
    let account = this.state.provider.eth.accounts[0]
    // get this from etherscane
    var abiArray = contract.abiArray;
    //var MyContract = w3.eth.contract(abiArray);
    /* https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#new-contract */
    
    //let deviceContract = new this.state.provider.eth.Contract(abiArray, null, { data: contract.bytecode });
    var deviceContract = this.state.provider.eth.contract(abiArray);
    /* https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#contract-deploy */
    console.log("contract", deviceContract)
    this.createContract({
      data: contract.bytecode,
      arguments: [
        this.state.contractName,
        this.state.contractLocation,
        this.state.contractURL
      ]})
      console.log("finished deployment")
    }
      
      // }).send({
      //   from: account,
      //   gas: gasEstimate
      // },
  //     function(error, transactionHash){
  //       console.log("sent: error: ", error, " hash: ", transactionHash)
  //     })
  //     .on('error', function(error) {
  //       console.error(error)
  //     })
  //     .on('transactionHash', function(transactionHash) {
  //       console.log("successful transaction hash: ", transactionHash)
  //     })
  //     .on('receipt', function(receipt) {
  //       console.log("got receipt! address: ", receipt.contractAddress)
  //     })
  //     .on('confirmation', function(confirmationNumber, receipt) {
  //       console.log("got confirmation: ", confirmationNumber)
  //     })
  //     .then(function(newContractInstance){
  //       console.log("new contract instance: ", newContractInstance.options.address);
  //     })

  // }
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
        return (<Welcome key={1} nextClick={() => this.nextPage(2)} accounts={this.state.accounts} merror={this.state.merror} />);
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
