import React from 'react'

const CError = ({err}) => (
    <div className="container alert alert-danger" role="alert">
        <br/>
        <br/>
        <h1>Connection Error</h1>
        <p className="lead">
          There seems to be an error connecting to the Ashya Collector Service. 
        </p>
        
        <p className="lead">
          <a href="https://github.com/CiscoBlockChain/AshyaApp/blob/master/README.md">See instructions For help</a>
        </p>
    </div>
);

export default CError
