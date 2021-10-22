import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import styles from './styles.module.scss';

import { api } from '../../services/api';

import logoImage from '../../assets/logo.svg';

interface IUser {
  name: string;
  avatar_url: string;
}

interface IMessage {
  id: string;
  text: string;
  user: IUser;
  created_at: Date;
}

const messagesQueue: IMessage[] = [];

const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: IMessage) => {
  messagesQueue.push(newMessage);
})

export function MessageList() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages(prevState => [
          messagesQueue[0],
          prevState[0],
          prevState[1]
        ].filter(Boolean))

        messagesQueue.shift();
      }
    }, 3000)
  }, [])

  useEffect(() => {
    api.get<IMessage[]>('messages/latest').then(response => {
      setMessages(response.data);
    })
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImage} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        { messages.map(message => (
          <li key={message.id} className={styles.message}>
            <p className={styles.messageContent}>
              {message.text}
            </p>
            <div className={styles.messageUser}>
              <div className={styles.userImage}>
                <img src={message.user.avatar_url} alt={message.user.name} />
              </div>
              <span>{message.user.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}