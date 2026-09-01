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

/**
 * Lista e formulário de comentários de uma publicação.
 *
 * @param {(mensagem: string, tipo?: 'erro'|'sucesso') => void} [aoAvisar]
 *   Fala com o Toast da página. É o mesmo `mostrarToast` que o feed usa para
 *   as publicações — por isso o segundo argumento é o tipo, e por isso
 *   comentar avisa igual a blabrar. Sem esse retorno, a ação some sem
 *   confirmação e só resta conferir na lista se deu certo.
 */
function Comentarios({ postId, autorAtual, aoContarMudar, aoAvisar }) {
    const [text, setTexto] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [excluindo, setExcluindo] = useState(null)
    const [emojisAbertos, setEmojisAbertos] = useState(false)
    const campoRef = useRef(null)
    const emojiBotaoRef = useRef(null)

    /** Insere na posição do cursor, não no fim do texto. */
    function inserirEmoji(emoji) {
        const campo = campoRef.current
        const inicio = campo?.selectionStart ?? text.length
        const fim = campo?.selectionEnd ?? text.length

        setTexto(text.slice(0, inicio) + emoji + text.slice(fim))
        setEmojisAbertos(false)

        requestAnimationFrame(() => {
            campo?.focus()
            const posicao = inicio + emoji.length
            campo?.setSelectionRange(posicao, posicao)
        })
    }

    const buscar = useCallback(
        ({ page, signal }) => listarComentarios(postId, { page, signal }),
        [postId]
    )

    const {
        itens: comments, setItens, carregando, erro,
        temMais, proxima, recarregar, total,
    } = usePaginado(buscar, { campo: 'comments', acumular: true, deps: [postId] })

    async function enviar(e) {
        e.preventDefault()
        const conteudo = text.trim()
        if (!conteudo || enviando) return

        setEnviando(true)
        try {
            const novo = await comentar(postId, conteudo)
            setItens((atuais) => [...atuais, novo])
            aoContarMudar?.(total + 1)
            setTexto('')
            aoAvisar?.('Comentário publicado!', 'sucesso')
        } catch (err) {
            aoAvisar?.(mensagemDeErro(err))
        } finally {
            setEnviando(false)
        }
    }

    /**
     * Substitui o comentário pelo que o servidor devolveu já normalizado.
     *
     * Sem try/catch de propósito: quem chama é o próprio `Comentario`, que
     * captura a falha e a mostra dentro do formulário, mantendo-o aberto com
     * o texto digitado. Engolir o erro aqui fecharia o formulário como se
     * tivesse salvo.
     */
    async function editar(comentarioId, text) {
        const atualizado = await editarComentario(postId, comentarioId, text)
        setItens((atuais) => atuais.map((c) => (c.id === comentarioId ? atualizado : c)))
        aoAvisar?.('Comentário atualizado.', 'sucesso')
    }

    async function excluir(comentarioId) {
        try {
            await excluirComentario(postId, comentarioId)
            setItens((atuais) => atuais.filter((c) => c.id !== comentarioId))
            aoContarMudar?.(Math.max(0, total - 1))
            aoAvisar?.('Comentário excluído.', 'sucesso')
        } catch (err) {
            aoAvisar?.(mensagemDeErro(err))
        } finally {
            setExcluindo(null)
        }
    }

    const souAutor = (c) => Boolean(autorAtual?.alias) && autorAtual.alias === c.author.alias

    return (
        <section className="comments">
            <EstadoLista
                carregando={carregando && comments.length === 0}
                erro={erro}
                vazio={!carregando && !erro && comments.length === 0}
                mensagemVazio="Nenhum comentário ainda. Seja o primeiro!"
                aoTentarDeNovo={recarregar}
            />

            {comments.length > 0 && (
                <ul className="comentarios-lista">
                    {comments.map((c) => (
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
                <Avatar src={autorAtual?.photoUrl} name={autorAtual?.name} tamanho={30} />
                <label htmlFor={`comentar-${postId}`} className="sr-only">Escrever comentário</label>
                <input
                    id={`comentar-${postId}`}
                    ref={campoRef}
                    type="text"
                    placeholder="Escreva um comentário..."
                    value={text}
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

                <button type="submit" disabled={!text.trim() || enviando}>
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
