import { useState, useEffect } from 'react';
import './Toast.css';
import InfoIcon from '../../assets/icons/info.svg?react'

function Toast({ mensagem, tipo, visible }) {
    const [renderizar, setRenderizar] = useState(false);
    const [mostrando, setMostrando] = useState(false);

    useEffect(() => {
        let timerA;
        if (visible) {
            setRenderizar(true);
            requestAnimationFrame(() => {
                setMostrando(true);
            });
            timerA = setTimeout(() => {
                setMostrando(false);
            }, 3000);
        }
        return () => clearTimeout(timerA);
    }, [visible]);

    useEffect(() => {
        let timerB;
        if (!mostrando && renderizar) {
            timerB = setTimeout(() => {
                setRenderizar(false);
            }, 300);
        }
        return () => clearTimeout(timerB);
    }, [mostrando]);

    if (!renderizar) return null;

    return (
        <div className={`toast ${tipo} ${mostrando ? 'show' : ''}`}>
            <div className='toast-content-wrapper'>
                <InfoIcon />
                <span>{mensagem}</span>
            </div>
        </div>
    );
}

export default Toast