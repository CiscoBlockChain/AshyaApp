import React from 'react'

const Welcome = ({nextClick, accounts, merror}) => (
    <div className="container">
      <div className="slider">
        <br/>
        <br/>
        <h1>Ashya Device</h1>
        { ! merror ? 
          <div className="alert alert-info">
              Connected the Blockchain Network.  Your account is: {accounts[0]} 
          </div>
          :
          <div className="alert alert-danger">
            <b>{merror}</b>  Metamask info here: <a href="https://metamask.io/">here</a>
          </div>
        }
        <p className="lead">
          Welcome to the Ashya Device Setup Wizard!  Let's get your IOT device ready to rent out and unleash amazingness upon the world!
        </p>
        <button className="btn btn-primary btn-lg float-left" onClick={nextClick}> 
          Get Started!
        </button>
      </div>
    </div>
);

export default Welcome
