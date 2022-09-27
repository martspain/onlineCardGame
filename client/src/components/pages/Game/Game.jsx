import React from "react";
import { useParams } from "react-router-dom";
import Chatbox from "../../components/Chatbox/Chatbox";
import './Game.scss'

const Game = () =>{
  const params = useParams()

  return(
    <div className="gameContainer">
      <h1>Game</h1>
      <Chatbox nickname={params.alias.replace(/_+/, ' ')}/>
    </div>
  )
}

export default Game
