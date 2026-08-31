import { useCallback, useRef, useState } from 'react'
import Avatar from '../common/Avatar'
import EstadoLista from '../common/EstadoLista'
import EmojiPicker, { EmojiIcon } from '../common/EmojiPicker'
import ConfirmarModal from '../modals/ConfirmarModal'
import Comentario from './Comentario'
import usePaginado from '../../hooks/usePaginado'
import { listarComentarios, comentar, editarComentario, excluirComentario } from '../../services/posts.service'
import { mensagemDeErro } from '../../services/http'
import './Comentarios.css'

const LIMITE = 280

function Comentarios({ postId, autorAtual, aoContarMudar, aoErro }) {
    const [texto, setTexto] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [excluindo, setExcluindo] = useState(null)
    const [emojisAbertos, setEmojisAbertos] = useState(false)
    const campoRef = useRef(null)
    const emojiBotaoRef = useRef(null)

    /** Insere na posição do cursor, não no fim do texto. */
    function inserirEmoji(emoji) {
        const campo = campoRef.current
        const inicio = campo?.selectionStart ?? texto.length
        const fim = campo?.selectionEnd ?? texto.length

        setTexto(texto.slice(0, inicio) + emoji + texto.slice(fim))
        setEmojisAbertos(false)

        requestAnimationFrame(() => {
            campo?.focus()
            const posicao = inicio + emoji.length
            campo?.setSelectionRange(posicao, posicao)
        })
    }

    const buscar = useCallback(
        ({ pagina, signal }) => listarComentarios(postId, { pagina, signal }),
        [postId]
    )

    const {
        itens: comentarios, setItens, carregando, erro,
        temMais, proxima, recarregar, total,
    } = usePaginado(buscar, { campo: 'comentarios', acumular: true, deps: [postId] })

    async function enviar(e) {
        e.preventDefault()
        const conteudo = texto.trim()
        if (!conteudo || enviando) return

        setEnviando(true)
        try {
            const novo = await comentar(postId, conteudo)
            setItens((atuais) => [...atuais, novo])
            aoContarMudar?.(total + 1)
            setTexto('')
        } catch (err) {
            aoErro?.(mensagemDeErro(err))
        } finally {
            setEnviando(false)
        }
    }

    /** Substitui o comentário pelo que o servidor devolveu já normalizado. */
    async function editar(comentarioId, texto) {
        const atualizado = await editarComentario(postId, comentarioId, texto)
        setItens((atuais) => atuais.map((c) => (c.id === comentarioId ? atualizado : c)))
    }

    async function excluir(comentarioId) {
        try {
            await excluirComentario(postId, comentarioId)
            setItens((atuais) => atuais.filter((c) => c.id !== comentarioId))
            aoContarMudar?.(Math.max(0, total - 1))
        } catch (err) {
            aoErro?.(mensagemDeErro(err))
        } finally {
            setExcluindo(null)
        }
    }

    const souAutor = (c) => Boolean(autorAtual?.alias) && autorAtual.alias === c.autor.alias

    return (
        <section className="comentarios">
            <EstadoLista
                carregando={carregando && comentarios.length === 0}
                erro={erro}
                vazio={!carregando && !erro && comentarios.length === 0}
                mensagemVazio="Nenhum comentário ainda. Seja o primeiro!"
                aoTentarDeNovo={recarregar}
            />

            {comentarios.length > 0 && (
                <ul className="comentarios-lista">
                    {comentarios.map((c) => (
                        <Comentario
                            key={c.id}
                            comentario={c}
                            souAutor={souAutor(c)}
                            aoEditar={editar}
                            aoExcluir={setExcluindo}
                        />
                    ))}
                </ul>
            )}

            {temMais && (
                <button type="button" className="comentarios-mais" onClick={proxima} disabled={carregando}>
                    {carregando ? 'Carregando...' : 'Ver mais comentários'}
                </button>
            )}

            <form className="comentario-form" onSubmit={enviar}>
                <Avatar src={autorAtual?.fotoUrl} nome={autorAtual?.nome} tamanho={30} />
                <label htmlFor={`comentar-${postId}`} className="sr-only">Escrever comentário</label>
                <input
                    id={`comentar-${postId}`}
                    ref={campoRef}
                    type="text"
                    placeholder="Escreva um comentário..."
                    value={texto}
                    maxLength={LIMITE}
                    onChange={(e) => setTexto(e.target.value)}
                />

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

                <button type="submit" disabled={!texto.trim() || enviando}>
                    {enviando ? '...' : 'Enviar'}
                </button>
            </form>

            <ConfirmarModal
                aberto={Boolean(excluindo)}
                aoFechar={() => setExcluindo(null)}
                titulo="Excluir comentário"
                mensagem="Este comentário será removido permanentemente."
                rotuloConfirmar="Excluir"
                aoConfirmar={() => excluir(excluindo)}
            />
        </section>
    )
}

export default Comentarios
