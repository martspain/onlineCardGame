import React, { useEffect, useState } from 'react'
import chatIcon from '../../../assets/images/icons/chatIcon.png'
import './Chatbox.scss'

const Chatbox = () => {
  
  const [openState, setOpenState] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')
  const [messageLog, setMessageLog] = useState([
    {
      from: '1234-ABCD',
      fromName: 'Martin',
      message: 'Hola que tal? quiero ver como se ve un string largo y un mensaje aqui',
      sentAt: new Date().toLocaleTimeString()
    }
  ])

  const sendMessage = () => {
    let copyCurrent = currentMessage
    copyCurrent = copyCurrent.replace(/ +/, '')

    if (copyCurrent !== '' && copyCurrent !== ' '){
      setMessageLog([
        ...messageLog,
        {
          from: '4321-DCBA',
          fromName: 'You',
          message: currentMessage,
          sentAt: new Date().toLocaleTimeString(),
        }
      ])
    }
    else{
      alert('Cannot send empty message.')
    }

    setCurrentMessage('')
    updateChatScroll()
  }

  const updateChatScroll = () => {
    const element = document.getElementById('messageChatBox')
    element.scrollTop = element.scrollHeight
  }
  
  return (
    <>
      {
        openState ?
        <div className='openChatContainer'>
          <div className='closeChatButton' onClick={() => {setOpenState(false)}}>
            Close
          </div>
          <div className='chatContentsContainer'>
            <div className='chatBox'>
              {
                messageLog.map((mess, ind) => {
                  return(
                    <div id='messageChatBox' className='messageContainer' key={`${mess.from} - ${ind}`}>
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