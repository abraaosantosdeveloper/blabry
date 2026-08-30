import { useEffect, useRef } from 'react'
import './Modal.css'

/**
 * Modal genérico: overlay, fecha no Esc, no clique fora e no botão X.
 * Trava o scroll do fundo enquanto aberto.
 */
function Modal({ aberto, aoFechar, titulo, icone: Icone, children, rotulo }) {
    const caixaRef = useRef(null)

    useEffect(() => {
        if (!aberto) return

        const aoTeclar = (e) => { if (e.key === 'Escape') aoFechar() }
        document.addEventListener('keydown', aoTeclar)

        const overflowAnterior = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        caixaRef.current?.focus()

        return () => {
            document.removeEventListener('keydown', aoTeclar)
            document.body.style.overflow = overflowAnterior
        }
    }, [aberto, aoFechar])

    if (!aberto) return null

    return (
        <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && aoFechar()}>
            <div
                className={`modal-caixa ${titulo ? "" : "sem-titulo"}`}
                role="dialog"
                aria-modal="true"
                aria-label={rotulo ?? titulo}
                tabIndex={-1}
                ref={caixaRef}
            >
                <button type="button" className="modal-fechar" onClick={aoFechar} aria-label="Fechar">
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                {titulo && (
                    <h2 className="modal-titulo">
                        {Icone && <Icone className="modal-titulo-icone" aria-hidden="true" />}
                        {titulo}
                    </h2>
                )}

                <div className="modal-conteudo">{children}</div>
            </div>
        </div>
    )
}

export default Modal
