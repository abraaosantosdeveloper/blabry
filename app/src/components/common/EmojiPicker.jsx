import { useEffect, useRef } from 'react'
import './EmojiPicker.css'

const GRUPOS = [
    { nome: 'Sorrisos', emojis: ['😀', '😄', '😁', '😂', '🥹', '😊', '😉', '😍', '🥰', '😘', '😜', '🤩', '🥳', '😎', '🤔', '🫠', '😴', '🙃'] },
    { nome: 'Gestos', emojis: ['👍', '👎', '👏', '🙌', '🙏', '💪', '🤝', '👋', '✌️', '🤙', '👀', '🫶'] },
    { nome: 'Coração', emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💔', '💖', '✨', '🔥'] },
    { nome: 'Diversos', emojis: ['🚀', '🎉', '🎊', '☕', '🍕', '🌎', '🌙', '⭐', '💡', '📌', '🎧', '🐶'] },
]

/** Painel simples de emojis. Fecha no Esc e no clique fora. */
function EmojiPicker({ aoEscolher, aoFechar }) {
    const painelRef = useRef(null)

    useEffect(() => {
        const aoTeclar = (e) => { if (e.key === 'Escape') aoFechar() }
        const aoClicar = (e) => {
            if (!painelRef.current?.contains(e.target)) aoFechar()
        }
        document.addEventListener('keydown', aoTeclar)
        document.addEventListener('mousedown', aoClicar)
        return () => {
            document.removeEventListener('keydown', aoTeclar)
            document.removeEventListener('mousedown', aoClicar)
        }
    }, [aoFechar])

    return (
        <div className="emoji-painel" ref={painelRef} role="dialog" aria-label="Escolher emoji">
            {GRUPOS.map(({ nome, emojis }) => (
                <section key={nome} className="emoji-grupo">
                    <h4>{nome}</h4>
                    <div className="emoji-grade">
                        {emojis.map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                className="emoji-item"
                                onClick={() => aoEscolher(emoji)}
                                aria-label={`Inserir ${emoji}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    )
}

export default EmojiPicker
