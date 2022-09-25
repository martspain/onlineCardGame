import React from "react";
import './credits.scss'

const Credits = () => {
    return(
        <div className="creditsContainer">
            <div className="title">Cre
                <div class="title2">dits</div>
            </div>
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
    )
}

export default Credits