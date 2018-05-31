import React from 'react'

const Wizard3 = ({nextClick, prevClick, handleChange, contractURL}) => (
    <div className="container">
      <div className="slider text-center col-width-12">
        <br/>
        <br/>
        <h1>Device URL</h1>
        <form className="form">
          Where can people find more information about this device? 
          <div className="form-group row">
            <input type="text" onChange={handleChange} className="form-control" id="contractURL" value={contractURL} />
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

export default Wizard3
