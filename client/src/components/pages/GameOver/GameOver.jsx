import React from "react";
import { useParams } from "react-router-dom";
import './GameOver.scss'

const GameOver = () => {
  const params = useParams()
  return(
    <div className="gameOverContainer">
      <div className="winnerTitle">{`The winner is ${params.winner}`}</div>
    </div>
  )
}

export default GameOver
