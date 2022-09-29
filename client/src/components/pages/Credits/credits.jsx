import React from "react";
import './credits.scss'
import hi from '../../../assets/images/icons/hi.png'

const Credits = () => {
    return(
        <div className="creditsContainer">
            <div className="title">Cre
                <div class="title2">dits</div>
            </div>
            <div className="containerDivision">
                <div className="divisionLeft">
                    <div className="containerText">
                        <div className="category">Developers
                            <div className="line" />
                        </div>
                        <li>Laura Tamath</li>
                        <li>Martín España</li>
                        <li>Sofia Rueda</li>
                    </div>
                    <div className="containerText">
                        <div className="category">Inspiration
                            <div className="line" />
                        </div>
                        <li>Club Penguin™</li>
                    </div>
                </div>
                <div className="divisionRight">
                    <img src={hi}  className="hi" alt="SayHi"  />
                </div>
            </div>
        </div>
    )
}

export default Credits