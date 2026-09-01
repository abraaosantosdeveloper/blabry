import { useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../common/Avatar'
import Comentarios from './Comentarios'
import MenuContexto from '../common/MenuContexto'
import ConfirmarModal from '../modals/ConfirmarModal'
import EditIcon from '../../assets/icons/edit.svg?react'
import TrashIcon from '../../assets/icons/trash.svg?react'
import { dentroDaJanela } from '../../utils/janelaEdicao'
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
/**
 * @param {boolean} [linkParaPost=true] quando falso, o horário deixa de ser
 *   link. É o caso da própria página do post: um link que aponta para a
 *   página onde já se está não leva a lugar nenhum e confunde a navegação.
 * @param {boolean} [comentariosIniciaisAbertos=false] a página dedicada
 *   abre os comentários de saída, porque eles são metade do motivo de ela
 *   existir; no feed continuam recolhidos, para caber mais posts na tela.
 */
function PostCard({
    post, autorAtual, aoAtualizar, aoEditar, aoExcluir, aoErro,
    linkParaPost = true, comentariosIniciaisAbertos = false,
}) {
    const { id, author, text, createdAt, editedAt, likes = 0, comments = 0, liked = false } = post
    const [ocupado, setOcupado] = useState(false)
    const [comentariosAbertos, setComentariosAbertos] = useState(comentariosIniciaisAbertos)
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)
    const [editando, setEditando] = useState(false)
    const [rascunho, setRascunho] = useState(text)
    const [salvando, setSalvando] = useState(false)
    const [erroEdicao, setErroEdicao] = useState(null)

    /* O alias é único, então comparar com o do usuário autenticado basta.
       Se o @ um dia virar editável, troque por um campo vindo do servidor. */
    const souAutor = Boolean(autorAtual?.alias) && autorAtual.alias === author.alias

    /* Reavaliado a cada render: some quando o prazo expira com a tela aberta. */
    const podeEditar = souAutor && dentroDaJanela(createdAt)

    function abrirEdicao() {
        setRascunho(text)
        setErroEdicao(null)
        setEditando(true)
    }

    async function salvarEdicao(e) {
        e.preventDefault()
        const conteudo = rascunho.trim()
        if (!conteudo || salvando) return
        if (conteudo === text) return setEditando(false)

        setSalvando(true)
        setErroEdicao(null)
        try {
            await aoEditar?.(id, conteudo)
            setEditando(false)
        } catch (err) {
            setErroEdicao(err?.message || 'Não foi possível salvar.')
        } finally {
            setSalvando(false)
        }
    }

    async function curtir() {
        if (ocupado) return
        setOcupado(true)

        // Otimista: inverte na hora e reconcilia com a resposta do servidor.
        const anterior = { liked, likes }
        aoAtualizar?.(id, { liked: !liked, likes: likes + (liked ? -1 : 1) })

        try {
            const dados = await alternarCurtida(id, liked)
            aoAtualizar?.(id, {
                liked: dados.liked ?? !anterior.liked,
                likes: dados.likes ?? anterior.likes,
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
                <Link to={`/profile/${author.alias}`} className="post-avatar-link">
                    <Avatar src={author.photoUrl} name={author.name} tamanho={44} />
                </Link>

                <div className="post-identificacao">
                    <Link to={`/profile/${author.alias}`} className="post-nome">{author.name}</Link>
                    <span className="post-alias">@{author.alias}</span>
                </div>

                {createdAt && (
                    /* O horário é o ponto de entrada para a página do post.
                       É a convenção da categoria (Twitter, Threads, Mastodon
                       fazem assim), e evita transformar o cartão inteiro em
                       link — o que quebraria os links do author e os botões
                       de curtir e comentar aninhados dentro dele.

                       `title` completo porque o rótulo visível é relativo
                       ("3h") e perde o sentido depois de algum tempo. */
                    <time
                        className="post-quando"
                        dateTime={createdAt}
                        title={new Date(createdAt).toLocaleString('pt-BR')}
                    >
                        {linkParaPost
                            ? <Link to={`/post/${id}`} className="post-quando-link">{quando(createdAt)}</Link>
                            : quando(createdAt)}
                        {editedAt && (
                            <span
                                className="post-editado"
                                title={`Editado em ${new Date(editedAt).toLocaleString('pt-BR')}`}
                            >
                                {' · editado'}
                            </span>
                        )}
                    </time>
                )}

                {souAutor && !editando && (
                    <MenuContexto
                        rotulo="Ações da publicação"
                        itens={[
                            ...(podeEditar
                                ? [{ rotulo: 'Editar', Icone: EditIcon, aoClicar: abrirEdicao }]
                                : []),
                            {
                                rotulo: 'Excluir',
                                Icone: TrashIcon,
                                perigo: true,
                                aoClicar: () => setConfirmandoExclusao(true),
                            },
                        ]}
                    />
                )}
            </header>

            {editando ? (
                <form className="post-edicao" onSubmit={salvarEdicao}>
                    <textarea
                        value={rascunho}
                        maxLength={280}
                        rows={3}
                        autoFocus
                        onChange={(e) => setRascunho(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Escape') setEditando(false) }}
                        aria-label="Editar publicação"
                    />

                    {erroEdicao && <p className="post-edicao-erro" role="alert">{erroEdicao}</p>}

                    <div className="post-edicao-acoes">
                        <span className="post-edicao-contador">{280 - rascunho.length}</span>
                        <button type="button" className="neutro" onClick={() => setEditando(false)}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={!rascunho.trim() || salvando}>
                            {salvando ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            ) : (
                <p className="post-texto">{text}</p>
            )}

            <footer className="post-acoes">
                <button
                    type="button"
                    className={`post-acao ${liked ? 'ativa' : ''}`}
                    onClick={curtir}
                    disabled={ocupado}
                    aria-pressed={liked}
                    aria-label={`${liked ? 'Descurtir' : 'Curtir'} publicação de ${author.name}`}
                >
                    <CurtirIcon aria-hidden="true" />
                    {likes > 0 && <span>{likes}</span>}
                </button>

                <button
                    type="button"
                    className={`post-acao ${comentariosAbertos ? 'aberta' : ''}`}
                    onClick={() => setComentariosAbertos((a) => !a)}
                    aria-expanded={comentariosAbertos}
                    aria-label={`${comentariosAbertos ? 'Ocultar' : 'Ver'} comentários da publicação de ${author.name}`}
                >
                    <ComentarIcon aria-hidden="true" />
                    {comments > 0 && <span>{comments}</span>}
                </button>
            </footer>

            <ConfirmarModal
                aberto={confirmandoExclusao}
                aoFechar={() => setConfirmandoExclusao(false)}
                titulo="Excluir publicação"
                mensagem="Esta publicação, suas curtidas e seus comentários serão removidos. Não é possível desfazer."
                rotuloConfirmar="Excluir"
                aoConfirmar={async () => {
                    try {
                        await aoExcluir?.(id)
                        setConfirmandoExclusao(false)
                    } catch (err) {
                        setConfirmandoExclusao(false)
                        aoErro?.(mensagemDeErro(err))
                    }
                }}
            />

            {comentariosAbertos && (
                <Comentarios
                    postId={id}
                    autorAtual={autorAtual}
                    aoContarMudar={(total) => aoAtualizar?.(id, { comments: total })}
                    aoAvisar={aoErro}
                />
            )}
        </article>
    )
}

export default PostCard
