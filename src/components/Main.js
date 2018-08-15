import React from 'react'

const Main = ({address, deleteFunc}) => (
    <div className="container">
        <br/>
        <br/>
        <h1>Device Information</h1>
        <p className="lead">
          <a href={"https://kovan.etherscan.io/address/" + address}>
            {address}
          </a>
        </p>
        <button className="btn btn-danger btn-lg" onClick={deleteFunc}>
          Delete
        </button>
    </div>
);

export default Main
