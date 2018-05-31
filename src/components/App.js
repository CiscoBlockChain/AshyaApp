import React from 'react'
import NavBar from './NavBar'
import Wizard from '../containers/Wizard'
import Footer from './Footer'
import * as contract from '../contract'

const App = () => (
  <div>
    <NavBar contract={contract.address}/>
    <Wizard />
    <Footer />
  </div>
)

export default App
