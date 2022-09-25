import React from "react";
import './Instructions.scss'

const Instructions = () => {
  return (
    <div className="instructionsContainer">
        <div className="title">How to
            <div class="title2">play</div>
        </div>
        <div className="containerText">
            <ul>
                <li>Take turns with your opponent to choose a card from the deck and start the battle.</li>
                <li>Fire melts snow, water extinguishes fire, and snow freezes water.</li>
                <li>The player who collects three cards of each element and of a different color, or three of the same element and of a different color is the one who wins the game.</li>
                <li>Some powerful cards have special powers and nullify some of the opponent's moves.</li>
            </ul>
        </div>
    </div>
  )
}

export default Instructions