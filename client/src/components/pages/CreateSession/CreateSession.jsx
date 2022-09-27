import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import './CreateSession.scss'

const CreateSession = () => {
  const navigation = useNavigate()

  const [currentName, setCurrentName] = useState('USER')
  const [currentCreateSessionID, setCurrentCreateSessionID] = useState('AAAA')
  const [currentJoinSessionID, setCurrentJoinSessionID] = useState('')
  const [isJoinServerActive, setIsJoinServerActive] = useState(false)

  const sessionCharacters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
  const sessionIDLength = 4 // Length of the session ID

  const generateNewSessionID = () => {
    let newSessionID = ''

    for (let i = 0; i < sessionIDLength; i++) {
      let newIndex = Math.round((Math.random() * sessionCharacters.length))
      newIndex = newIndex < sessionCharacters.length ? newIndex : newIndex - 1
      newSessionID += sessionCharacters[newIndex]
    }

    setCurrentCreateSessionID(newSessionID)
  }

  const navigateToSession = (createSession) => {
    if (createSession && currentName !== '') {
      navigation(`/play/${currentCreateSessionID}/${currentName.replace(/ +/, '_')}`)
    } else if (!createSession && currentJoinSessionID.length === sessionIDLength && currentJoinSessionID !== '' && currentName !== ''){
      navigation(`/play/${currentJoinSessionID}/${currentName.replace(/ +/, '_')}`)
    } else if (!createSession && (currentJoinSessionID.length !== sessionIDLength || currentJoinSessionID !== '')) {
      alert('Session ID is not correct.')
    } else if (currentName === '') {
      alert('Your name is empty. Please write your name.')
    }
  }

  useEffect(()=>{
    generateNewSessionID()
  }, [])

  return (
    <div className="createSessionContainer">
      <div className="createSessionTitle">{`New Match - ${currentName}`}</div>
      <div className="createSessionOptionsContainer">
        <div className="createSessionNameContainer">
          <div className="nameTitle">Write your name:</div>
          <input className="nameInput" value={currentName} onChange={(e) => setCurrentName(e.target.value.toLocaleUpperCase())}
          maxLength={10}
          ></input>
        </div>
        <div className="createSessionButton" onClick={() => navigateToSession(true)}>{`Create new server - ID: ${currentCreateSessionID}`}</div>
        {!isJoinServerActive ?
          <div className="joinServerButton" onClick={() => setIsJoinServerActive(true)}>Join server</div>
          :
          <input className="joinSessionInput" value={currentJoinSessionID} onChange={(e) => setCurrentJoinSessionID(e.target.value.toLocaleUpperCase())}
          placeholder={'Insert the session ID...'}
          ></input>
        }
        {isJoinServerActive &&
          <div className="joinServerConfirmButton" onClick={() => navigateToSession(false)}>Join!</div>
        }
      </div>
    </div>
  )
}

export default CreateSession