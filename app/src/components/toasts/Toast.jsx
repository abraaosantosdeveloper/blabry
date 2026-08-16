import './Toast.css';
import InfoIcon from '../../assets/icons/info.svg?react'

function Toast({ mensagem, tipo, visible }) {
    return (
        <div className={`toast ${tipo}`}>
            <div className='toast-content-wrapper'>
                <InfoIcon />

                <span>{mensagem}</span>
            </div>
        </div>
    );
}

export default Toast