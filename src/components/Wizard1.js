import React from 'react'

const Wizard1 = ({nextClick, prevClick, handleChange, contractName}) => (
    <div className="container">
      <div className="slider text-center">
        <br/>
        <br/>
        <h1>What is the Device Name?</h1>
        <form className="form">
          <div className="form-group row">
            <input type="text" onChange={handleChange} className="form-control" id="contractName" value={contractName} />
          </div>
        </form> 
        <button className="btn btn-primary btn-lg float-left" onClick={prevClick}> 
          Back
        </button>
        <button className="btn btn-primary btn-lg float-left" onClick={nextClick}> 
          Next
        </button>
      </div>
    </div>
);

export default Wizard1
