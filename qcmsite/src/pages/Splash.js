import React from 'react'
import { Spinner } from 'reactstrap'
import logo from '../images/logo-v2-512.png'
function Splash() {

    
    return (
        <div className="splash">
            <img alt="VTC CITY FORMATIONS" src={logo}/>
            <Spinner  color="info"/>
        </div>
    )
}

export default Splash
