import { useEffect, useRef } from 'react'
import './Modal.css'

/**
 * Modal genérico: overlay, fecha no Esc, no clique fora e no botão X.
 * Trava o scroll do fundo enquanto aberto.
 */
function Modal({ aberto, aoFechar, titulo, icone: Icone, children, rotulo }) {
    const caixaRef = useRef(null)

    /* Guarda o callback mais recente sem colocá-lo nas dependências do efeito.
       Como quem usa o modal costuma passar uma arrow function inline, sua
       identidade muda a cada render — e o efeito rodaria de novo a cada tecla
       digitada, roubando o foco do campo (no mobile, fechando o teclado). */
    const aoFecharRef = useRef(aoFechar)
    useEffect(() => { aoFecharRef.current = aoFechar })

    useEffect(() => {
        if (!aberto) return

        const aoTeclar = (e) => { if (e.key === 'Escape') aoFecharRef.current() }
        document.addEventListener('keydown', aoTeclar)

        const overflowAnterior = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        // Só move o foco se nada dentro do modal já estiver focado —
        // preserva o autoFocus de campos internos.
        const caixa = caixaRef.current
        if (caixa && !caixa.contains(document.activeElement)) caixa.focus()

        return () => {
            document.removeEventListener('keydown', aoTeclar)
            document.body.style.overflow = overflowAnterior
        }
    }, [aberto])

    if (!aberto) return null

    return (
        <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && aoFecharRef.current()}>
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
