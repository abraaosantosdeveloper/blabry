import { useEffect, useRef, useState } from 'react'
import Avatar from '../common/Avatar'
import EmojiPicker from '../common/EmojiPicker'
import './PostComposer.css'

const LIMITE = 280

const EmojiIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8.5 14.5c.9 1.2 2.1 1.8 3.5 1.8s2.6-.6 3.5-1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="9" cy="10" r="1.1" fill="currentColor" />
        <circle cx="15" cy="10" r="1.1" fill="currentColor" />
    </svg>
)

/**
 * Campo de nova publicação. Usado inline no feed e dentro do modal do FAB.
 * @param {boolean} focoAutomatico foca ao montar (modal)
 */
function PostComposer({ autor, aoPublicar, focoAutomatico = false, aoErro }) {
    const [texto, setTexto] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [emojisAbertos, setEmojisAbertos] = useState(false)
    const campoRef = useRef(null)

    const restantes = LIMITE - texto.length
    const podePublicar = texto.trim().length > 0 && restantes >= 0 && !enviando

    useEffect(() => {
        if (focoAutomatico) campoRef.current?.focus()
    }, [focoAutomatico])

    function ajustarAltura(el) {
        el.style.height = 'auto'
        el.style.height = `${el.scrollHeight}px`
    }

    /** Insere o emoji na posição do cursor, não no fim do texto. */
    function inserirEmoji(emoji) {
        const campo = campoRef.current
        const inicio = campo?.selectionStart ?? texto.length
        const fim = campo?.selectionEnd ?? texto.length
        const novo = texto.slice(0, inicio) + emoji + texto.slice(fim)

        setTexto(novo)
        setEmojisAbertos(false)

        requestAnimationFrame(() => {
            campo?.focus()
            const posicao = inicio + emoji.length
            campo?.setSelectionRange(posicao, posicao)
            if (campo) ajustarAltura(campo)
        })
    }

    async function publicar(e) {
        e.preventDefault()
        if (!podePublicar) return
        setEnviando(true)
        try {
            await aoPublicar?.(texto.trim())
            setTexto('')
            if (campoRef.current) campoRef.current.style.height = 'auto'
        } catch (err) {
            aoErro?.(err)
        } finally {
            setEnviando(false)
        }
    }

    return (
        <form className="composer" onSubmit={publicar}>
            <Avatar src={autor?.fotoUrl} nome={autor?.nome} tamanho={40} />

            <div className="composer-corpo">
                <label htmlFor="novo-blab" className="sr-only">Nova publicação</label>
                <textarea
                    id="novo-blab"
                    ref={campoRef}
                    className="composer-campo"
                    placeholder="O que tem em mente?"
                    rows={1}
                    value={texto}
                    maxLength={LIMITE + 40}
                    onChange={(e) => {
                        setTexto(e.target.value)
                        ajustarAltura(e.target)
                    }}
                />

                <div className="composer-acoes">
                    <div className="composer-emoji-wrapper">
                        <button
                            type="button"
                            className="composer-emoji"
                            onClick={() => setEmojisAbertos((a) => !a)}
                            aria-label="Inserir emoji"
                            aria-expanded={emojisAbertos}
                        >
                            <EmojiIcon aria-hidden="true" />
                        </button>

                        {emojisAbertos && (
                            <EmojiPicker aoEscolher={inserirEmoji} aoFechar={() => setEmojisAbertos(false)} />
                        )}
                    </div>

                    <span className={`composer-contador ${restantes < 0 ? 'excedido' : ''}`}>
                        {texto.length > 0 && restantes}
                    </span>

                    <button type="submit" className="composer-publicar" disabled={!podePublicar}>
                        {enviando ? 'Publicando...' : 'Publicar'}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default PostComposer
