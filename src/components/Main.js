import React from 'react'

const Main = ({address, registerFunc, deleteFunc}) => (
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
        <hr/>
        <div>
          <h2 >Device Registration</h2>
          <p className="lead">
            You can register your device to make it viewable on <a href="https://ashya.io">Ashya.io</a>.
            This way people can subscribe to your device. 
            The cost for registration is 0.001 Ether.  You pay no other fees and people will subscribe to you directly. 
          </p>
          <button className="btn btn-info btn-lg" onClick={registerFunc}>
            Register Device
          </button>
        </div>
    </div>
);

export default Main
