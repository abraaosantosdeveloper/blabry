import { useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../common/Avatar'
import Comentarios from './Comentarios'
import { alternarCurtida } from '../../services/posts.service'
import { mensagemDeErro } from '../../services/http'
import './PostCard.css'

const CurtirIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12 20.5S3.5 15.2 3.5 9.6A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8.5 2.6c0 5.6-8.5 10.9-8.5 10.9Z"
            stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
)

const ComentarIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M20.5 11.7c0 4.2-3.8 7.6-8.5 7.6-1 0-2-.16-2.9-.45L4 20.5l1.4-3.9a7.2 7.2 0 0 1-1.9-4.9C3.5 7.4 7.3 4 12 4s8.5 3.4 8.5 7.7Z"
            stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
)

const quando = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    const minutos = Math.floor((Date.now() - d.getTime()) / 60000)
    if (minutos < 1) return 'agora'
    if (minutos < 60) return `${minutos}min`
    if (minutos < 1440) return `${Math.floor(minutos / 60)}h`
    if (minutos < 10080) return `${Math.floor(minutos / 1440)}d`
    return d.toLocaleDateString('pt-BR')
}

/**
 * Cartão de publicação. Curtidas e comentários vêm da API — os contadores
 * exibidos são os que o backend devolve, nunca calculados localmente,
 * exceto pela atualização otimista enquanto a requisição está em voo.
 */
function PostCard({ post, autorAtual, aoAtualizar, aoErro }) {
    const { id, autor, texto, criadoEm, curtidas = 0, comentarios = 0, curtido = false } = post
    const [ocupado, setOcupado] = useState(false)
    const [comentariosAbertos, setComentariosAbertos] = useState(false)

    async function curtir() {
        if (ocupado) return
        setOcupado(true)

        // Otimista: inverte na hora e reconcilia com a resposta do servidor.
        const anterior = { curtido, curtidas }
        aoAtualizar?.(id, { curtido: !curtido, curtidas: curtidas + (curtido ? -1 : 1) })

        try {
            const dados = await alternarCurtida(id, curtido)
            aoAtualizar?.(id, {
                curtido: dados.curtido ?? !anterior.curtido,
                curtidas: dados.curtidas ?? anterior.curtidas,
            })
        } catch (err) {
            aoAtualizar?.(id, anterior)
            aoErro?.(mensagemDeErro(err))
        } finally {
            setOcupado(false)
        }
    }

    return (
        <article className="post">
            <header className="post-cabecalho">
                <Link to={`/perfil/${autor.alias}`} className="post-avatar-link">
                    <Avatar src={autor.fotoUrl} nome={autor.nome} tamanho={44} />
                </Link>

                <div className="post-identificacao">
                    <Link to={`/perfil/${autor.alias}`} className="post-nome">{autor.nome}</Link>
                    <span className="post-alias">@{autor.alias}</span>
                </div>

                {criadoEm && <time className="post-quando" dateTime={criadoEm}>{quando(criadoEm)}</time>}
            </header>

            <p className="post-texto">{texto}</p>

            <footer className="post-acoes">
                <button
                    type="button"
                    className={`post-acao ${curtido ? 'ativa' : ''}`}
                    onClick={curtir}
                    disabled={ocupado}
                    aria-pressed={curtido}
                    aria-label={`${curtido ? 'Descurtir' : 'Curtir'} publicação de ${autor.nome}`}
                >
                    <CurtirIcon aria-hidden="true" />
                    {curtidas > 0 && <span>{curtidas}</span>}
                </button>

                <button
                    type="button"
                    className={`post-acao ${comentariosAbertos ? 'aberta' : ''}`}
                    onClick={() => setComentariosAbertos((a) => !a)}
                    aria-expanded={comentariosAbertos}
                    aria-label={`${comentariosAbertos ? 'Ocultar' : 'Ver'} comentários da publicação de ${autor.nome}`}
                >
                    <ComentarIcon aria-hidden="true" />
                    {comentarios > 0 && <span>{comentarios}</span>}
                </button>
            </footer>

            {comentariosAbertos && (
                <Comentarios
                    postId={id}
                    autorAtual={autorAtual}
                    aoContarMudar={(total) => aoAtualizar?.(id, { comentarios: total })}
                    aoErro={aoErro}
                />
            )}
        </article>
    )
}

export default PostCard
