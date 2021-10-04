import React, { Component } from 'react'
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import face from './face.png';
export class Logo extends Component {
    render() {
        return (
            <div className =' ma4 mt0'>
              <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 200, width: 200 }} >
                    <div className="Tilt-inner pa4"><img style={{paddingTop: '5px'}} alt='logo' src= {face}></img> </div>
                </Tilt>

            </div>
        )
    }
}

export default Logo
