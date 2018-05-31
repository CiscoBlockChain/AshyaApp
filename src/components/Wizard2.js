import React from 'react'

const Wizard2 = ({nextClick, prevClick, handleChange, contractLocation}) => (
    <div className="container">
      <div className="slider text-center">
        <br/>
        <br/>
        <h1>Where is this Device Located?</h1>
        <form className="form">
          <div className="form-group row">
            <input type="text" onChange={handleChange} className="form-control" id="contractLocation" value={contractLocation} />
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

export default Wizard2
