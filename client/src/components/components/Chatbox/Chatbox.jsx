import React, { useEffect, useState } from 'react'
import socket from '../../../../connection/connection'
import chatIcon from '../../../assets/images/icons/chatIcon.png'
import './Chatbox.scss'

const Chatbox = () => {
  
  const [openState, setOpenState] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')
  const [messageLog, setMessageLog] = useState([])

  const sendMessage = () => {
    let copyCurrent = currentMessage
    copyCurrent = copyCurrent.replace(/ +/, '')

    if (copyCurrent !== '' && copyCurrent !== ' '){
      setMessageLog([
        ...messageLog,
        {
          from: socket.id, // Current user Unique ID
          fromName: 'You', // This is to show 'you' to user
          message: currentMessage, // This is the current message
          sentAt: new Date().toLocaleTimeString(), // This is the time
          session: '1234' // This is the number of the session used
        }
      ])
      const messToSend = {
        from: socket.id,
        fromName: 'User X',
        message: currentMessage,
        sentAt: new Date().toLocaleTimeString(),
        session: '1234'
      }
      socket.emit('message', messToSend)
      console.log(socket.id)
    }
    else{
      alert('Cannot send empty message.')
    }

    setCurrentMessage('')
    updateChatScroll()
  }

  const updateChatLog = (incomingMessage) => {
    setMessageLog([
      ...messageLog,
      incomingMessage
    ])
  }

  const updateChatScroll = () => {
    const element = document.getElementById('messageChatBox')
    element.scrollTop = element.scrollHeight
  }

  useEffect(() => {
    socket.on('message', (data) => updateChatLog(data))
  }, [])
  
  return (
    <>
      {
        openState ?
        <div className='openChatContainer'>
          <div className='closeChatButton' onClick={() => {setOpenState(false)}}>
            Close
          </div>
          <div className='chatContentsContainer'>
            <div className='chatBox' id='messageChatBox'>
              {
                messageLog.map((mess, ind) => {
                  return(
                    <div className='messageContainer' key={`${mess.from} - ${ind}`}>
                      <p className='messageTime'>{mess.sentAt}</p>
                      -
                      <p className='messageBody'><b>{`${mess.fromName}: `}</b>{mess.message}</p>
                    </div>
                  )
                })
              }
            </div>
            <div className='chatFooter'>
              <input className='chatInput' value={currentMessage} placeholder='Type your message...' onChange={(ev) => setCurrentMessage(ev.target.value)} />
              <div className='chatSendButton' onClick={() => sendMessage()}>Send</div>
            </div>
          </div>
        </div>
        :
        <div className='closedChatContainer' onClick={() => {setOpenState(true)}}>
          <img src={chatIcon} alt='Chat' className='chatImage' />
        </div>

      }
    </>
  )
}

export default Chatbox