import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import Chatbox from "../../components/Chatbox/Chatbox";
import socket from "../../../../connection/connection";
import cardDeck from "./cardDeckUtils";
import iceIcon from '../../../assets/images/icons/ice.png'
import fireIcon from '../../../assets/images/icons/fire.png'
import waterIcon from '../../../assets/images/icons/water.png'
import './Game.scss'

const Game = () =>{
  const params = useParams()
  const navigate = useNavigate()

  const [gameHasStarted, setGameHasStarted] = useState(false)
  const [isGameHost, setIsGameHost] = useState(false)
  const [connectedPlayers, setConnectedPlayers] = useState([])
  const [ownCards, setOwnCards] = useState([])
  const [isChoosingCard, setIsChoosingCard] = useState(true)
  const [pickCardTimer, setPickCardTimer] = useState(-1)
  const [cardsSelected, setCardsSelected] = useState([])
  const [elementPoints, setElementPoints] = useState([0,0,0]) // fire, snow, water
  const [gameOver, setGameOver] = useState({state: false, winner: ''})
  const [waitNextTurnTimer, setWaitNextTurnTimer] = useState(-1)
  const [turnStatus, setTurnStatus] = useState('')
  const [sessionBadges, setSessionBadges] = useState([])

  let playerCount = 0
  let gameHasFinished = false
  let badgesHaveUpdated = false

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
          if (cardDeck[newIndex] !== undefined) newHand.push(cardDeck[newIndex])
        }
      } else {
        if (cardDeck[newIndex] !== undefined) newHand.push(cardDeck[newIndex])
      }
    }
    setOwnCards(newHand)
    startPickTimer()
  }

  const startPickTimer = () => {
    setIsChoosingCard(true)
    setTurnStatus('')
    let counter = 10
    const timer = setInterval(() => {
      setPickCardTimer(counter)
      counter -= 1

      if (counter === -1) {
        clearInterval(timer)
        setPickCardTimer(-1)
        waitForNextTurn()
      }
    }, 1000)
  }

  const drawCard = (prevHand) => {
    let newIndex = Math.round(Math.random() * (cardDeck.length - 1))
    let newCard = cardDeck[newIndex]
    while (prevHand.includes(newCard) || ownCards.includes(newCard) || newCard === undefined) {
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

  const checkRoundWinner = (allCards) => {
    // Check which player won the round and assign corresponding points TODO
    const ownCard = allCards.find((elem) => elem.playerID === socket.id)
    // console.log('Carta: ', ownCard, ' Cartas: ', allCards)
    allCards.splice(allCards.indexOf(ownCard), 1)

    let points = 0
    let currentElement = 0

    allCards.forEach((opponent) => {
      if (opponent.card.cardType !== ownCard.card.cardType) { // Element is different
        if (ownCard.card.cardType === 'fire' && opponent.card.cardType === 'snow') {
          currentElement = 0 // fire
          points += 1
        } else if (ownCard.card.cardType === 'snow' && opponent.card.cardType === 'water') {
          currentElement = 1 // snow
          points += 1
        }
        else if (ownCard.card.cardType === 'water' && opponent.card.cardType === 'fire') { // Water
          currentElement = 2 // water
          points += 1
        }
      } else {  // Same element, highest number wins
        if (ownCard.card.cardNumber > opponent.card.cardNumber) {
          points += 1
        }
      }
    })

    const pointsCopy = elementPoints
    // Set element points
    if (playerCount === 4) {
      if (points >= 2) {
        pointsCopy[currentElement] = 1
        setTurnStatus(`You have earned a badge for ${ownCard.card.cardType} element.`)
        setElementPoints(pointsCopy)
        socket.emit('badgeEarned', {
          session: params.sessionid,
          playerID: socket.id,
          player: params.alias.replace(/_+/, ' '),
          badges: pointsCopy,
        })
      }
    } else if (playerCount === 3 || playerCount === 2) {
      if (points >= 1) {
        pointsCopy[currentElement] = 1
        setTurnStatus(`You have earned a badge for ${ownCard.card.cardType} element.`)
        setElementPoints(pointsCopy)
        socket.emit('badgeEarned', {
          session: params.sessionid,
          playerID: socket.id,
          player: params.alias.replace(/_+/, ' '),
          badges: pointsCopy,
        })
      }
    }
    
    const userHasWon = pointsCopy[0] === 1 && pointsCopy[1] === 1 && pointsCopy[2] === 1
    console.log('Fire, Snow, Water = ', pointsCopy)

    if (userHasWon) {
      setGameOver({state: true, winner: params.alias.replace(/_+/, ' ')})
      setTurnStatus('You won!')
      gameHasFinished = true
      socket.emit('gameOver', {session: params.sessionid, winner: params.alias.replace(/_+/, ' ')})
      navigate(`/gameOver/${params.alias}`)
    }

    // socket.emit('cleanTurn', { session: params.sessionid }) // Do cleanup after round validation
    // setCardsSelected([])
  }

  const waitForNextTurn = () => {
    let counter = 10
    const timer = setInterval(() => {
      setWaitNextTurnTimer(counter)
      counter -= 1

      if (counter === -1) {
        clearInterval(timer)
        setWaitNextTurnTimer(-1)
        if (!gameHasFinished){
          socket.emit('cleanTurn', { session: params.sessionid }) // Do cleanup after round validation
          startPickTimer()
        }
      }
    }, 1000)
  }

  const updatePlayersConnected = (sessions) => {
    const currentSession = sessions.find((sess) => sess.id === params.sessionid)
    setConnectedPlayers(currentSession.players)
    if (currentSession.host === socket.id) {
      setIsGameHost(true)
    }
    playerCount = currentSession.players.length
  }

  const updatePickedCards = (gameTurns) => {
    let cardsToSet = []
    gameTurns.forEach((elem) => {
      if (elem.session === params.sessionid){
        cardsToSet.push({ player: elem.nickname, card: elem.card, playerID: elem.player })
      }
    })

    setCardsSelected(cardsToSet)
    
    // Check if turn is over
    if (cardsToSet.length === playerCount) {
      checkRoundWinner(cardsToSet)
    }
  }

  const validateGameStart = (gameID) => {
    if (gameID.session === params.sessionid) {
      startGame()
    }
  }

  const showGameOver = (info) => {
    setGameOver({state: true, winner: info.winner})
    navigate(`/gameOver/${info.winner}`)
  }

  const updateBadges = (badgesData) => {
    let badgesToSet = []
    badgesData.forEach((elem) => {
      if (elem.session === params.sessionid) {
        if (!badgesToSet.includes(elem) && elem.playerID !== socket.id) badgesToSet.push(elem)
      }
    })

    badgesToSet.forEach((badgi, indOne) => {
      badgesToSet.forEach((badgo, indTwo) => {
        if (badgi.playerID === badgo.playerID && indOne !== indTwo) {
          badgesToSet.splice(badgesToSet.find((elem) => elem.playerID === badgi.playerID), 1)
        }
      })
    })

    if (!badgesHaveUpdated) {
      setSessionBadges(badgesToSet)
      badgesHaveUpdated = true
    } else {
      badgesHaveUpdated = false
    }

  }

  useEffect(()=>{
    initPlayer()
  }, [])

  useEffect(()=>{
    socket.on('session', (activeSessions) => updatePlayersConnected(activeSessions))
  }, [])

  useEffect(()=>{
    socket.on('gameTurn', (gameTurns) => updatePickedCards(gameTurns))
  }, [])

  useEffect(()=>{
    socket.on('startGame', (gameInfo) => validateGameStart(gameInfo))
  }, [])

  useEffect(()=>{
    socket.on('gameOver', (gameInfo) => showGameOver(gameInfo))
  }, [])
  
  useEffect(()=>{
    socket.on('badgeEarned', (badgeInfo) => updateBadges(badgeInfo))
  }, [])

  return(
    <div className="gameContainer">
      <h1>{`Players connected: ${connectedPlayers.length}`}</h1>
      <div className="badgeShowContainer">
        <div className="badgesContainer">
          {elementPoints[0] === 1 && <img className="badgeImage" src={fireIcon} alt='Fire earned' /> }
          {elementPoints[1] === 1 && <img className="badgeImage" src={iceIcon} alt='Snow earned'/> }
          {elementPoints[2] === 1 && <img className="badgeImage" src={waterIcon} alt='Water earned' /> }
        </div>
        {sessionBadges.length > 0 &&
          <>
            {sessionBadges.map((badge, index) => {
              return(
                <div badge={badge} key={index} className="opponentsBadgeContainer">
                  <div className="opponentsName">{badge.player}</div>
                  {badge.badges[0] === 1 && <img className="opponentsBadgeImage" src={fireIcon} alt="Fire earned" />}
                  {badge.badges[1] === 1 && <img className="opponentsBadgeImage" src={iceIcon} alt="Fire earned" />}
                  {badge.badges[2] === 1 && <img className="opponentsBadgeImage" src={waterIcon} alt="Fire earned" />}
                </div>
              )
            })}
          </>
        }
      </div>
      {!gameHasStarted ?
          isGameHost ?
            <div className="startGamePopup">
              <div className="joinedPlayersContainer">
                <div className="joinedPlayersCode"><b>
                  Share the code: 
                  <div className="yellow">
                    {`${params.sessionid}`}
                  </div>
                </b></div>
                <div className="joinedPlayersTitle"><b>
                  Players in Session
                </b></div>
                <div className="joinedPlayersList">
                  {connectedPlayers.map((player, index) => {
                    return(
                      <div player={player} key={index} className="joinedPlayerContainer">
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
                  {connectedPlayers.map((player, index) => {
                    return(
                      <div player={player} key={index} className="joinedPlayerContainer">
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
                  {ownCards.length > 0 ?
                    <>
                      {ownCards.map((handCard, index) => {
                        return(
                          <div handCard={handCard} key={index} className="cardContainer" onClick={() => pickCard(handCard)}>
                            <img className="cardImage" src={handCard.cardImage} alt={`${handCard.cardNumber} - ${handCard.cardType}`}/>
                          </div>
                        )
                      })}
                    </>
                  : null
                  }
                </div>
              </div>
            :
              pickCardTimer >= 0 ?
                <div className="waitingPickContainer">
                  <div>Waiting for other players to select their cards...</div>
                  {pickCardTimer >= 0 && 
                    <div className="pickCardTimer"><b>{pickCardTimer}</b></div>
                  }
                  <div className="ownCardsContainer seecards">
                    {cardsSelected.length > 0 ?
                      <>
                        {cardsSelected.map((elem, index) => {
                          return(
                            <div elem={elem} key={index} className="turnCardContainer">
                              <h1>{elem.player}</h1>
                              <img className="cardImage" src={elem.card.cardImage} alt={`${elem.card.cardNumber} - ${elem.card.cardType}`} />
                            </div>
                          )
                        })}
                      </>
                    : null
                    }
                  </div>
                </div>
              :
                <div>
                  <h1>{turnStatus}</h1>
                  {waitNextTurnTimer >= 0 &&
                    <h2>{waitNextTurnTimer}</h2>
                  }
                </div>
          }
        </div>
      }
      <Chatbox nickname={params.alias.replace(/_+/, ' ')}/>
    </div>
  )
}

export default Game
