import { useEffect, useId, useRef, useState } from 'react'
import TripleDotIcon from '../../assets/icons/triple-dot.svg?react'
import './MenuContexto.css'

/**
 * Menu de ações acionado por um botão de três pontos.
 * Fecha no Esc, no clique fora e ao escolher um item.
 *
 * @param {{rotulo: string, Icone?: Function, perigo?: boolean, aoClicar: Function}[]} itens
 */
function MenuContexto({ itens, rotulo = 'Mais ações' }) {
    const [aberto, setAberto] = useState(false)
    const containerRef = useRef(null)
    const id = useId()

    useEffect(() => {
        if (!aberto) return

        const aoClicarFora = (e) => {
            if (!containerRef.current?.contains(e.target)) setAberto(false)
        }
        const aoTeclar = (e) => { if (e.key === 'Escape') setAberto(false) }

        document.addEventListener('mousedown', aoClicarFora)
        document.addEventListener('keydown', aoTeclar)
        return () => {
            document.removeEventListener('mousedown', aoClicarFora)
            document.removeEventListener('keydown', aoTeclar)
        }
    }, [aberto])

    return (
        <div className="menu-contexto" ref={containerRef}>
            <button
                type="button"
                className="menu-contexto-botao"
                onClick={() => setAberto((a) => !a)}
                aria-label={rotulo}
                aria-haspopup="menu"
                aria-expanded={aberto}
                aria-controls={id}
            >
                <TripleDotIcon aria-hidden="true" />
            </button>

            {aberto && (
                <div className="menu-contexto-lista" id={id} role="menu">
                    {itens.map(({ rotulo: text, Icone, perigo, aoClicar }) => (
                        <button
                            key={text}
                            type="button"
                            role="menuitem"
                            className={`menu-contexto-item ${perigo ? 'perigo' : ''}`}
                            onClick={() => { setAberto(false); aoClicar() }}
                        >
                            {Icone && <Icone aria-hidden="true" />}
                            {text}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MenuContexto
