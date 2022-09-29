import React from "react";
import { useParams, Link } from "react-router-dom";
import './GameOver.scss'

const GameOver = () => {
  const params = useParams()
  return(
    <div className="gameOverContainer">
      <div className="winnerTitle">The winner is
        <div className="userWinner">
          {`${params.winner}`}
        </div>
      </div>
      <div className="retunToMenu">  
          <Link to={'/'}>
            <h1>Back to menu</h1>
          </Link>
        </div>
    </div>
  )
}

export default GameOver
