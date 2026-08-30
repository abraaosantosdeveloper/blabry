import { useCallback, useState } from 'react'
import PostComposer from '../components/feed/PostComposer'
import PostCard from '../components/feed/PostCard'
import NovoPostModal from '../components/modals/NovoPostModal'
import EstadoLista from '../components/common/EstadoLista'
import Toast from '../components/toasts/Toast'
import useToast from '../hooks/useToast'
import usePaginado from '../hooks/usePaginado'
import useUsuarioAtual from '../hooks/useUsuarioAtual'
import { listarPosts, criarPost } from '../services/posts.service'
import { mensagemDeErro } from '../services/http'
import './Feed.css'

function Feed() {
    const { toast, mostrarToast } = useToast()
    const [modalAberto, setModalAberto] = useState(false)
    const usuario = useUsuarioAtual()

    const buscar = useCallback(({ pagina, signal }) => listarPosts({ pagina, signal }), [])

    const {
        itens: posts, setItens, carregando, erro,
        temMais, proxima, recarregar,
    } = usePaginado(buscar, { campo: 'posts', acumular: true })

    /** Aplica mudanças pontuais num post sem recarregar o feed inteiro. */
    const atualizarPost = useCallback((id, campos) => {
        setItens((atuais) => atuais.map((p) => (p.id === id ? { ...p, ...campos } : p)))
    }, [setItens])

    async function publicar(texto) {
        const novo = await criarPost(texto)
        setItens((atuais) => [novo, ...atuais])
        mostrarToast('Blab publicado!', 'sucesso')
    }

    return (
        <div className="feed">
            <Toast {...toast} />

            <h1 className="sr-only">Feed</h1>

            <PostComposer
                autor={usuario}
                aoPublicar={publicar}
                aoErro={(err) => mostrarToast(mensagemDeErro(err))}
            />

            <div className="feed-lista">
                {posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        autorAtual={usuario}
                        aoAtualizar={atualizarPost}
                        aoErro={mostrarToast}
                    />
                ))}
            </div>

            <EstadoLista
                carregando={carregando && posts.length === 0}
                erro={erro && posts.length === 0 ? erro : null}
                vazio={!carregando && !erro && posts.length === 0}
                mensagemVazio="Ainda não há publicações. Seja o primeiro a blabrar!"
                aoTentarDeNovo={recarregar}
            />

            {temMais && (
                <button type="button" className="feed-mais" onClick={proxima} disabled={carregando}>
                    {carregando ? 'Carregando...' : 'Carregar mais'}
                </button>
            )}

            <button
                type="button"
                className="feed-fab"
                onClick={() => setModalAberto(true)}
                aria-label="Novo blab"
            >
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
            </button>

            <NovoPostModal
                aberto={modalAberto}
                aoFechar={() => setModalAberto(false)}
                autor={usuario}
                aoPublicar={publicar}
                aoErro={(err) => mostrarToast(mensagemDeErro(err))}
            />
        </div>
    )
}

export default Feed
