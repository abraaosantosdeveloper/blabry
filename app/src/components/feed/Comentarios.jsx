import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../common/Avatar'
import EstadoLista from '../common/EstadoLista'
import usePaginado from '../../hooks/usePaginado'
import { listarComentarios, comentar } from '../../services/posts.service'
import { mensagemDeErro } from '../../services/http'
import './Comentarios.css'

const LIMITE = 280

function Comentarios({ postId, autorAtual, aoContarMudar, aoErro }) {
    const [texto, setTexto] = useState('')
    const [enviando, setEnviando] = useState(false)

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

    return (
        <section className="comentarios">
            <EstadoLista
                carregando={carregando && comentarios.length === 0}
                erro={erro}
                vazio={!carregando && !erro && comentarios.length === 0}
                mensagemVazio="Seja o primeiro a comentar."
                aoTentarDeNovo={recarregar}
            />

            {comentarios.length > 0 && (
                <ul className="comentarios-lista">
                    {comentarios.map((c) => (
                        <li key={c.id} className="comentario">
                            <Link to={`/perfil/${c.autor.alias}`}>
                                <Avatar src={c.autor.fotoUrl} nome={c.autor.nome} tamanho={30} />
                            </Link>
                            <div className="comentario-corpo">
                                <p className="comentario-cabecalho">
                                    <Link to={`/perfil/${c.autor.alias}`}>{c.autor.nome}</Link>
                                    <span>@{c.autor.alias}</span>
                                </p>
                                <p className="comentario-texto">{c.texto}</p>
                            </div>
                        </li>
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
                    type="text"
                    placeholder="Escreva um comentário..."
                    value={texto}
                    maxLength={LIMITE}
                    onChange={(e) => setTexto(e.target.value)}
                />
                <button type="submit" disabled={!texto.trim() || enviando}>
                    {enviando ? '...' : 'Enviar'}
                </button>
            </form>
        </section>
    )
}

export default Comentarios
