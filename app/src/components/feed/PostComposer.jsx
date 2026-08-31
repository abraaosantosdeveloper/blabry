import { useEffect, useRef, useState } from 'react'
import Avatar from '../common/Avatar'
import EmojiPicker, { EmojiIcon } from '../common/EmojiPicker'
import './PostComposer.css'

const LIMITE = 280

/**
 * Campo de nova publicação. Usado inline no feed e dentro do modal do FAB.
 * @param {boolean} focoAutomatico foca ao montar (modal)
 */
function PostComposer({ author, aoPublicar, focoAutomatico = false, aoErro }) {
    const [text, setTexto] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [emojisAbertos, setEmojisAbertos] = useState(false)
    const campoRef = useRef(null)
    const emojiBotaoRef = useRef(null)

    const restantes = LIMITE - text.length
    const podePublicar = text.trim().length > 0 && restantes >= 0 && !enviando

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
        const inicio = campo?.selectionStart ?? text.length
        const fim = campo?.selectionEnd ?? text.length
        const novo = text.slice(0, inicio) + emoji + text.slice(fim)

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
            await aoPublicar?.(text.trim())
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
            <Avatar src={author?.photoUrl} name={author?.name} tamanho={40} />

            <div className="composer-corpo">
                <label htmlFor="novo-blab" className="sr-only">Nova publicação</label>
                <textarea
                    id="novo-blab"
                    ref={campoRef}
                    className="composer-campo"
                    placeholder="O que tem em mente?"
                    rows={1}
                    value={text}
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
                            ref={emojiBotaoRef}
                            className="emoji-gatilho"
                            onClick={() => setEmojisAbertos((a) => !a)}
                            aria-label="Inserir emoji"
                            aria-expanded={emojisAbertos}
                        >
                            <EmojiIcon aria-hidden="true" />
                        </button>

                        {emojisAbertos && (
                            <EmojiPicker
                                ancoraRef={emojiBotaoRef}
                                aoEscolher={inserirEmoji}
                                aoFechar={() => setEmojisAbertos(false)}
                            />
                        )}
                    </div>

                    <span className={`composer-contador ${restantes < 0 ? 'excedido' : ''}`}>
                        {text.length > 0 && restantes}
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
