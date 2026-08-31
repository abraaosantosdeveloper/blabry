import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PostCard from '../components/feed/PostCard'
import Avatar from '../components/common/Avatar'
import EstadoLista from '../components/common/EstadoLista'
import Toast from '../components/toasts/Toast'
import useToast from '../hooks/useToast'
import useUsuarioAtual from '../hooks/useUsuarioAtual'
import { buscarPost, editarPost, excluirPost } from '../services/posts.service'
import { mensagemDeErro } from '../services/http'
import GoBackIcon from '../assets/icons/go-back.svg?react'
import './Post.css'

/** Data por extenso — na página dedicada há espaço para a data completa. */
const dataPorExtenso = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
}

/**
 * Página dedicada de uma publicação.
 *
 * Existe por três motivos que o cartão no feed não resolve: dar um endereço
 * próprio à publicação (compartilhável, recarregável, indexável), abrir os
 * comentários sem competir com o resto do feed, e apresentar o autor com
 * mais do que nome e @.
 */
function Post() {
    const { id } = useParams()
    const navigate = useNavigate()
    const usuarioAtual = useUsuarioAtual()
    const { toast, mostrarToast } = useToast()

    const [post, setPost] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)

    /* O AbortController cancela a requisição se a página for abandonada
       antes da resposta. Sem ele, o `.then` tentaria atualizar o estado de
       um componente já desmontado — e, pior, uma resposta antiga poderia
       sobrescrever uma nova ao trocar de post rapidamente. */
    const carregar = useCallback(() => {
        const controller = new AbortController()
        setCarregando(true)
        setErro(null)

        buscarPost(id, { signal: controller.signal })
            .then(setPost)
            .catch((err) => { if (err.name !== 'AbortError') setErro(err) })
            .finally(() => { if (!controller.signal.aborted) setCarregando(false) })

        return () => controller.abort()
    }, [id])

    // carregar já devolve a função de limpeza, então serve direto ao efeito.
    useEffect(carregar, [carregar])

    /** Mudanças pontuais vindas do cartão (curtida, contagem de comentários). */
    const atualizar = useCallback((_id, campos) => {
        setPost((atual) => (atual ? { ...atual, ...campos } : atual))
    }, [])

    async function editar(_id, text) {
        // O servidor devolve a publicação já normalizada — é ela que vira o
        // novo estado, e não o texto digitado: só assim `editadoEm` aparece.
        const atualizado = await editarPost(id, text)
        setPost(atualizado)
        mostrarToast('Blab atualizado.', 'sucesso')
    }

    async function excluir() {
        await excluirPost(id)
        // Não há mais o que mostrar nesta página: o recurso deixou de
        // existir. `replace` para que o botão "voltar" do navegador não
        // traga o usuário de volta a um 404.
        navigate('/feed', { replace: true })
    }

    const author = post?.author

    return (
        <div className="pagina-post">
            <Toast {...toast} />

            <header className="pagina-post-topo">
                {/* navigate(-1) devolve à origem real — feed, perfil ou busca.
                    Um link fixo para /feed mandaria de volta para o lugar
                    errado quem chegou pelo perfil de alguém. */}
                <button
                    type="button"
                    className="pagina-post-voltar"
                    onClick={() => navigate(-1)}
                    aria-label="Voltar"
                >
                    <GoBackIcon aria-hidden="true" />
                </button>
                <h1>Publicação</h1>
            </header>

            {(carregando || erro) && (
                <EstadoLista carregando={carregando} erro={erro} aoTentarDeNovo={carregar} />
            )}

            {post && (
                <>
                    {/* ---- Cartão do autor ----
                        Acima do post, e não abaixo: quem abre um link de
                        publicação de fora do app costuma não conhecer o
                        author, e saber quem escreveu muda como se lê o text. */}
                    <Link to={`/perfil/${author.alias}`} className="pagina-post-autor">
                        <Avatar src={author.photoUrl} name={author.name} tamanho={52} />
                        <span className="pagina-post-autor-textos">
                            <strong>{author.name}</strong>
                            <small>@{author.alias}</small>
                            {/* A bio só é renderizada se existir — um espaço
                                vazio anuncia que falta alguma coisa ali. */}
                            {author.bio && <span className="pagina-post-autor-bio">{author.bio}</span>}
                        </span>
                    </Link>

                    <PostCard
                        post={post}
                        autorAtual={usuarioAtual}
                        aoAtualizar={atualizar}
                        aoEditar={editar}
                        aoExcluir={excluir}
                        aoErro={mostrarToast}
                        // Já estamos na página do post: o horário não deve
                        // linkar para ela mesma.
                        linkParaPost={false}
                        // Os comentários são metade do motivo desta página
                        // existir, então chegam abertos.
                        comentariosIniciaisAbertos
                    />

                    <p className="pagina-post-data">
                        <time dateTime={post.createdAt}>{dataPorExtenso(post.createdAt)}</time>
                        {post.editedAt && (
                            <> · editado em <time dateTime={post.editedAt}>{dataPorExtenso(post.editedAt)}</time></>
                        )}
                    </p>
                </>
            )}
        </div>
    )
}

export default Post
