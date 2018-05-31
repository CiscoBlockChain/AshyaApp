import React from 'react'

const Welcome = ({nextClick}) => (
    <div className="container">
      <div className="slider">
        <br/>
        <br/>
        <h1>Ashya Device</h1>
        <p className="lead">
          Welcome to the Ashya Device Setup Wizard!  Let's get your IOT device ready to rent out and unleash its amazingness upon the world!
        </p>
        <button className="btn btn-primary btn-lg float-left" onClick={nextClick}> 
          Get Started!
        </button>
      </div>
    </div>
);

export default Welcome
