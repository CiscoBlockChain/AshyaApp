import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'
import { getContract, updateContract } from '../actions'
import Welcome from '../components/Welcome'
import Wizard1 from '../components/Wizard1'
import Wizard2 from '../components/Wizard2'
import Wizard3 from '../components/Wizard3'
import Wizard4 from '../components/Wizard4'
import Main from '../components/Main'
import Loading from '../components/Loading'
import CError from '../components/CError'
import * as contract from '../contract.js'
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
      contractStatus: "", // for tracking the state of the contract creation.
      error: this.props.error, // for errors connecting to ashya collector
      merror: "", // for metamask errors.
      pageForward: true,
      currentPage: 1,
      accounts: [],
      provider: "",
      gasPrice: "",  // price of gas 
      gasLimit: "",  // amount of gas willing to pay
      working: false,
      workingMessage: "Loading!"
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
    window.addEventListener('load', async () =>  {
      // support november 2nd update: 
      // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
      if (window.ethereum) {
        console.log("New ethereum")
        window.web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          t.validate(t)
        } catch (error) {
          t.setState({merror: "Metamask not enabled."})
        }
      }
      else if (typeof window.web3 !== 'undefined') {
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
      // set accounts
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

  // registers the contract with the Ashya Registry at Ashya.io

   registerContract = () => {
     let t = this
     t.setState({working: true})
     t.setState({workingMessage: "Use Metamask to complete transaction"})
     console.log("register contract with ", contract.registryAddress) 
     let deviceContract = new this.state.provider.eth.Contract(contract.abiArray, this.state.contract, { data: contract.bytecode });
     console.log(deviceContract)
     console.log(deviceContract.methods)
     deviceContract.methods.registerDevice(contract.registryAddress).estimateGas({from: this.state.accounts[0], value: 1000000000000000}, this.rc0)
     
   }
// // // // */
  // registerContract = () => {
  //  // let newContract = new this.state.provider.eth.Contract(deviceContract.abiArray, addr);
  //   let deviceContract = new this.state.provider.eth.Contract(contract.abiArray, this.state.contract, { data: contract.bytecode });
  //   deviceContract.methods.registerDevice(contract.registerDevice).estimateGas({from: this.state.accounts[0], value: 100000000000000000}, this.rc0)
    
  //   //  deviceContract.methods.registerDevice(contract.registryAddress).estimateGas({from: this.state.accounts[0], value: 100000000000000000}, this.rc0)
  // }

  rc0 = (err, gasEstimate) => {
    console.log("gas estimate: ", gasEstimate)
    if (err) {
      console.error("Got error with getting gas estimate")
      console.error(err);
      this.setState({merror: err})
      this.setState({working: false})
    }else {
      this.setState({workingMessage: "Gas estimate" + gasEstimate.toString()})
      console.log("Got gas Estimate: ", gasEstimate)
      this.setState({gasLimit: gasEstimate})
      this.state.provider.eth.getGasPrice(this.rc1)
    }
  }

  rc1 = (error, gasPrice) => {
    this.setState({gasPrice: gasPrice});
    if (error) {
      console.error(error);
      this.setState({working : false})
      return
    }
    let self = this
    let account = this.state.accounts[0]
    let deviceContract = new this.state.provider.eth.Contract(contract.abiArray, this.state.contract, { data: contract.bytecode });
    console.log("Registering the device")
    deviceContract.methods.registerDevice(contract.registryAddress).send({
         from: account,
         gas: this.state.gasLimit + 80000,
         gasPrice: this.state.gasPrice,
         value:  1000000000000000,
    }, function(error, transactionHash){
        self.setState({contractStatus: "Submitted contract with Transaction Hash: ", transactionHash})
       })
      .on('error', function(error) {
        console.error(error)
        this.setState({working : false})
        self.setState({contractStatus: "Error submitting contract: ", error})
      })
      .on('transactionHash', function(transactionHash) {
        self.setState({contractStatus: "Successfully submitted transaction hash: " +  transactionHash})
      })
      .on('receipt', function(receipt) {
        self.setState({contractStatus: "Contract Address: " + receipt.contractAddress})
        console.log("got receipt! address: ", receipt.contractAddress)
      })
      .on('confirmation', function(confirmationNumber, receipt) {
        self.setState({contractStatus: "Contract Address: "+ receipt.contractAddress + " Confirmation: " + confirmationNumber})
        //console.log("got confirmation: ", confirmationNumber)
      })
      .then(function(newContractInstance){
        console.log("Created New Contract Instance: ", newContractInstance.options.address);
        // store contract in Ashya Device. 
        self.props.updateContract(newContractInstance.options.address);
        this.setState({working : false})
      })
  }

  createContract = () => {
    // estimate gas
    this.state.provider.eth.estimateGas({ data: contract.bytecode }, this.cc0);
  }

  cc0 = (error, gasEstimate) => {
    this.setState({gasLimit: gasEstimate })
    this.state.provider.eth.getGasPrice(this.cc1)
  } 

  cc1 = (error, gasPrice) => {
    this.setState({gasPrice: gasPrice});
    
    if (error) {
      console.error(error);
      return;
    }
    // get the account
    let account = this.state.accounts[0]
    /* https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#new-contract */
    let self = this 
    let deviceContract = new this.state.provider.eth.Contract(contract.abiArray, null, { data: contract.bytecode });
    //var deviceContract = this.state.provider.eth.Contract(abiArray, null, );
    /* https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#contract-deploy */
    console.log("contract", deviceContract)
    console.log("gas price: ", this.state.gasPrice, " gas limit: ", this.state.gasLimit)
    deviceContract.deploy({
      data: contract.bytecode,
      arguments: [
        this.state.contractName,
        this.state.contractLocation,
        this.state.contractURL
     ]
    }).send({
         from: account,
         gas: parseInt(this.state.gasLimit,10) + 800000 ,
         gasPrice: this.state.gasPrice.toString(),
       }, function(error, transactionHash){
        self.setState({contractStatus: "Submitted contract with Transaction Hash: ", transactionHash})
       })
      .on('error', function(error) {
        console.error(error)
        self.setState({contractStatus: "Error submitting contract: " + error})
      })
      .on('transactionHash', function(transactionHash) {
        self.setState({contractStatus: "Successfully submitted transaction hash: " +  transactionHash})
      })
      .on('receipt', function(receipt) {
        self.setState({contractStatus: "Contract Address: " + receipt.contractAddress})
        console.log("got receipt! address: ", receipt.contractAddress)
      })
      .on('confirmation', function(confirmationNumber, receipt) {
        self.setState({contractStatus: "Contract Address: "+ receipt.contractAddress + " Confirmation: " + confirmationNumber})
        //console.log("got confirmation: ", confirmationNumber)
      })
      .then(function(newContractInstance){
        console.log("Created New Contract Instance: ", newContractInstance.options.address);
        // store contract in Ashya Device. 
        self.props.updateContract(newContractInstance.options.address);
      })

  } 


  deleteContract = () => {
    this.props.updateContract("")
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
    return(
      this.state.contract === "" ? 
      <div>
        <Loading working={this.state.working} workingMessage={this.state.workingMessage}/>
        <ReactCSSTransitionGroup
          transitionName={ this.state.pageForward ? "page" : "prev" }
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
        {this.renderPage()}
        </ReactCSSTransitionGroup>
        </div>
      :
        <Main address={this.state.contract} registerFunc={this.registerContract} deleteFunc={this.deleteContract}/> 
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
                contractStatus={this.state.contractStatus}
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
  getContract: () => dispatch(getContract()), // get the current contract. 
  updateContract: (address) => dispatch(updateContract(address)), // update contract with Ashya Device
})


export default connect(
  mapStateToProps,
  mapDispatchToProps)(Wizard) 
