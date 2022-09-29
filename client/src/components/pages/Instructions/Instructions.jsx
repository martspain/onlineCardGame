import React from "react";
import './Instructions.scss'
import snowWater from '../../../assets/images/icons/snowVsWater.png'
import fireSnow from '../../../assets/images/icons/fireVsSnow.png'
import waterFire from '../../../assets/images/icons/waterVsFire.png'

const Instructions = () => {
  return (
    <div className="instructionsContainer">
        <div className="title">How to
            <div class="title2">play</div>
        </div>
        <div className="instructionsText">
          <li> Create a new server, or join using the server creator code.</li>
          <li> Start the game when all players are ready (games can be 2 - 4 people)</li>
          <li> Chat with your friends by pressing the penguins button.</li>
          <li> Each player must choose one of the 5 cards available to them.</li>
          <li> Fire melts snow, water extinguishes fire, and snow freezes water.</li>
          <div className="iconsContainerInstruc">
            <img src={fireSnow}  className="imgVs" id="picture1" alt="FireVsSnow"  />
            <img src={waterFire} className="imgVs" id="picture1" alt="WaterVsFire"  />
            <img src={snowWater} className="imgVs" id="picture1" alt="SnowVsWater"  />
          </div>
          <li> The player who collects three cards of each element wins the game.</li>

        </div>
    </div>
  )
}

export default Instructions