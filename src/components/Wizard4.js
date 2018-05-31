import React from 'react'

const Wizard4 = ({prevClick, handleChange, createContract,
                  contractName, contractLocation, contractURL}) => (
    <div className="container">
      <div className="slider text-center">
        <br/>
        <br/>
        <h1>Does this look correct?</h1>
        <p>Device name: {contractName} </p>
        <p>Device Location: {contractLocation} </p>
        <p>Device URL: {contractURL} </p>
        <button className="btn btn-secondary btn-lg float-left" onClick={prevClick}>
          No, Go Back
        </button>
        &nbsp;
        <button className="btn btn-primary btn-lg" onClick={createContract}>
          Yes, create the contract
        </button>
      </div>
    </div>
);

export default Wizard4
