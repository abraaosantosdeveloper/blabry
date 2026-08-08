import styles from './ChatLog.module.css';

function Message({ autor, texto }) {
    const isPO = autor === 'po';
    return (
        <div className={isPO ? styles.messageLeft : styles.messageRight}>
            <div className={isPO ? styles.bubbleLeft : styles.bubbleRight}>
                <span className={styles.autor}>{isPO ? 'P.O' : 'Dev'}</span>
                <p className={styles.texto}>{texto}</p>
            </div>
        </div>
    );
}

function ChatLog({ messages }) {
    return (
        <div className={styles.chatLog}>
            {messages.map((msg, index) => (
                <Message key={index} autor={msg.autor} texto={msg.texto} />
            ))}
        </div>
    );
}

export default ChatLog;