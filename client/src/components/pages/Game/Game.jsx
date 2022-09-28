import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import swal from "sweetalert";
import Chatbox from "../../components/Chatbox/Chatbox";
import socket from "../../../../connection/connection";
import cardDeck from "./cardDeckUtils";
import './Game.scss'

const Game = () =>{
  const params = useParams()

  const [gameHasStarted, setGameHasStarted] = useState(false)
  const [isGameHost, setIsGameHost] = useState(false)
  const [connectedPlayers, setConnectedPlayers] = useState([])
  const [ownCards, setOwnCards] = useState([])
  const [isChoosingCard, setIsChoosingCard] = useState(true)
  const [pickCardTimer, setPickCardTimer] = useState(-1)
  const [cardsSelected, setCardsSelected] = useState([])

  const initPlayer = () => {
    socket.emit('getActiveSessions')
  }

  const startGame = () => {
    if (connectedPlayers.length > 1 && isGameHost) {
      socket.emit('startGame', { session: params.sessionid })
      setGameHasStarted(true)
      getRandomCards()
    } else if (!isGameHost) {
      setGameHasStarted(true)
      getRandomCards()
    } else {
      swal('Warning', `Can\'t start a game by your own. Invite your friends using code ${params.sessionid}`, 'warning')
    }
  }

  const getRandomCards = () => {
    const newHand = []
    let newIndex

    while (newHand.length < 5){
      newIndex = Math.round(Math.random() * (cardDeck.length - 1))
      if (newHand.length >= 1) {
        if (!newHand.includes(cardDeck[newIndex])) {
          newHand.push(cardDeck[newIndex])
        }
      } else {
        newHand.push(cardDeck[newIndex])
      }
    }
    setOwnCards(newHand)
    startPickTimer()
  }

  const startPickTimer = () => {
    let counter = 150
    const timer = setInterval(() => {
      setPickCardTimer(counter)
      counter -= 1

      if (counter === -1) {
        clearInterval(timer)
        setPickCardTimer(-1)
      }
    }, 1000)
  }

  const drawCard = (prevHand) => {
    let newIndex = Math.round(Math.random() * (cardDeck.length - 1))
    let newCard = cardDeck[newIndex]
    while (prevHand.includes(newCard) || ownCards.includes(newCard)) {
      newIndex = Math.round(Math.random() * (cardDeck.length - 1))
      newCard = cardDeck[newIndex]
    }
    if (prevHand.indexOf(undefined) >= 0) {
      prevHand.splice(prevHand.indexOf(undefined), 1)
    }
    setOwnCards([...prevHand, newCard])
    setIsChoosingCard(false)
  }

  const pickCard = (cardToUse) => {
    socket.emit('addGameTurn', {
      session: params.sessionid,
      player: socket.id,
      nickname: params.alias.replace(/_+/, ' '),
      card: cardToUse
    })
    const handCopy = ownCards
    const newHand = []
    handCopy.forEach((elem) => {
      if (elem !== cardToUse) newHand.push(elem)
    })
    drawCard(newHand)
  }

  const checkRoundWinner = () => {
    // Check which player won the round and assign corresponding points TODO
  }

  const updatePlayersConnected = (sessions) => {
    const currentSession = sessions.find((sess) => sess.id === params.sessionid)
    setConnectedPlayers(currentSession.players)
    console.log('Connected: ', currentSession.players)
    if (currentSession.host === socket.id) {
      setIsGameHost(true)
    }
  }

  const updatePickedCards = (gameTurns) => {
    cardsToSet = []
    gameTurns.forEach((elem) => {
      if (elem.session === params.sessionid){
        cardsToSet.push({ player: elem.nickname, card: elem.card })
      }
    })
    setCardsSelected(cardsToSet)

    // Check if turn is over
    if (cardsToSet.length === connectedPlayers.length) checkRoundWinner()
  }

  const validateGameStart = (gameID) => {
    if (gameID.session === params.sessionid) {
      startGame()
    }
  }

  useEffect(()=>{
    initPlayer()
  }, [])

  useEffect(()=>{
    socket.on('session', (activeSessions) => updatePlayersConnected(activeSessions))
    socket.on('gameTurn', (gameTurns) => updatePickedCards(gameTurns))
    socket.on('startGame', (gameInfo) => validateGameStart(gameInfo))
  }, [])

  return(
    <div className="gameContainer">
      {!gameHasStarted ?
          isGameHost ?
            <div className="startGamePopup">
              <div className="joinedPlayersContainer">
                <div className="joinedPlayersCode"><b>
                  {`Share the code: ${params.sessionid}`}
                </b></div>
                <div className="joinedPlayersTitle"><b>
                  Players in Session
                </b></div>
                <div className="joinedPlayersList">
                  {connectedPlayers.map((player) => {
                    return(
                      <div key={`${player.userId}-${player.alias}`} className="joinedPlayerContainer">
                        <div className="joinedPlayerIcon"></div>
                        <div className="joinedPlayerName">{player.alias}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="startGameButton" onClick={() => startGame()}>
                Start game
              </div>
            </div>
          :
            <div className="waitForHostPopup">
              <div className="joinedPlayersContainer">
                <div className="joinedPlayersTitle"><b>
                  Players in Session
                </b></div>
                <div className="joinedPlayersList">
                  {connectedPlayers.map((player) => {
                    return(
                      <div className="joinedPlayerContainer">
                        <div className="joinedPlayerIcon"></div>
                        <div className="joinedPlayerName">{player.alias}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="waitStartGameButton">
                Waiting for Host to start the game...
              </div>
            </div>
        :
        <div className="gameContainer">
          {isChoosingCard ?
              <div>
                <div className="pickCardTitle">Pick your card!</div>
                {pickCardTimer >= 0 && 
                  <div className="pickCardTimer"><b>{pickCardTimer}</b></div>
                }
                <div className="ownCardsContainer">
                  {ownCards.map((handCard) => {
                    return(
                      <div key={`${handCard.cardNumber}-${handCard.cardImage}`} className="cardContainer" onClick={() => pickCard(handCard)}>
                        <img className="cardImage" src={handCard.cardImage} alt={`${handCard.cardNumber} - ${handCard.cardType}`}/>
                      </div>
                    )
                  })}
                </div>
              </div>
            :
              pickCardTimer >= 0 ?
                <div className="waitingPickContainer">
                  <div>Waiting for other players to selecte their cards...</div>
                  {pickCardTimer >= 0 && 
                    <div className="pickCardTimer"><b>{pickCardTimer}</b></div>
                  }
                </div>
              :
                <div>

                </div>
          }
        </div>
      }
      <Chatbox nickname={params.alias.replace(/_+/, ' ')}/>
    </div>
  )
}

export default Game
