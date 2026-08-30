import { useEffect, useState } from 'react'
import './Toast.css'
import InfoIcon from '../../assets/icons/info.svg?react'
import DangerIcon from '../../assets/icons/danger.svg?react'

const DURACAO = 3000
const SAIDA = 300

function Toast({ mensagem, tipo, id }) {
    const [montado, setMontado] = useState(false)
    const [visivel, setVisivel] = useState(false)

    useEffect(() => {
        if (!id) return
        setMontado(true)
        const quadro = requestAnimationFrame(() => setVisivel(true))
        const timer = setTimeout(() => setVisivel(false), DURACAO)
        return () => {
            cancelAnimationFrame(quadro)
            clearTimeout(timer)
        }
    }, [id])

    useEffect(() => {
        if (visivel || !montado) return
        const timer = setTimeout(() => setMontado(false), SAIDA)
        return () => clearTimeout(timer)
    }, [visivel, montado])

    if (!montado) return null

    const Icone = tipo === 'erro' ? DangerIcon : InfoIcon

    return (
        <div className={`toast ${tipo} ${visivel ? 'show' : ''}`} role="status" aria-live="polite">
            <div className="toast-content-wrapper">
                <Icone />
                <span>{mensagem}</span>
            </div>
        </div>
    )
}

export default Toast
