import { useCallback } from 'react'
import PostCard from '../feed/PostCard'
import EstadoLista from '../common/EstadoLista'
import usePaginado from '../../hooks/usePaginado'
import { listarPostsDoUsuario, editarPost, excluirPost } from '../../services/posts.service'
import './PostsDoPerfil.css'

/**
 * Seção de publicações de um perfil.
 *
 * Um único componente serve o próprio perfil e o de terceiros: a API
 * devolve a mesma coisa nos dois casos, e o que muda — poder editar ou
 * excluir — já é decidido dentro do PostCard, comparando o autor da
 * publicação com o usuário autenticado. Duplicar o componente só para
 * repetir essa comparação criaria duas telas para manter em sincronia.
 *
 * @param {string} alias   @ do dono do perfil (sem a arroba)
 * @param {object} autorAtual usuário autenticado — decide o que é editável
 * @param {(mensagem: string) => void} [aoErro] repassa avisos ao Toast da página
 */
function PostsDoPerfil({ alias, autorAtual, aoErro }) {
    /* useCallback com `alias` na dependência: sem ele, a função mudaria de
       identidade a cada render e o usePaginado recarregaria em laço. Com
       ele, trocar de perfil (e só isso) dispara nova busca. */
    const buscar = useCallback(
        ({ page, signal }) => listarPostsDoUsuario(alias, { page, signal }),
        [alias]
    )

    const {
        itens: posts, setItens, carregando, erro,
        temMais, proxima, recarregar, total,
    } = usePaginado(buscar, {
        campo: 'posts',
        // `acumular` porque a seção usa "carregar mais", como o feed: o
        // usuário está lendo uma lista contínua, não navegando por páginas.
        acumular: true,
        // `ativo` só quando há alias. No primeiro render de /profile/me o
        // alias ainda não chegou, e buscar "/users/undefined/posts" daria
        // um 404 que apareceria como erro na tela.
        ativo: Boolean(alias),
        deps: [alias],
    })

    /** Aplica mudanças pontuais (curtida, contagem de comentários) sem recarregar. */
    const atualizarPost = useCallback((id, campos) => {
        setItens((atuais) => atuais.map((p) => (p.id === id ? { ...p, ...campos } : p)))
    }, [setItens])

    /* Editar e excluir vivem aqui, e não no PostCard, porque quem conhece a
       lista é esta seção: o cartão avisa o que aconteceu, a lista decide
       como se reorganizar. */
    async function editar(id, text) {
        const atualizado = await editarPost(id, text)
        setItens((atuais) => atuais.map((p) => (p.id === id ? atualizado : p)))
    }

    async function excluir(id) {
        await excluirPost(id)
        setItens((atuais) => atuais.filter((p) => p.id !== id))
    }

    return (
        <section className="perfil-posts" aria-labelledby="perfil-posts-titulo">
            <h2 id="perfil-posts-titulo" className="perfil-posts-titulo">
                Publicações
                {/* A contagem só aparece depois da primeira resposta: mostrar
                    "0" enquanto carrega afirma algo que ainda não se sabe. */}
                {!carregando && posts.length > 0 && (
                    <span className="perfil-posts-total">{total}</span>
                )}
            </h2>

            <div className="perfil-posts-lista">
                {posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        autorAtual={autorAtual}
                        aoAtualizar={atualizarPost}
                        aoEditar={editar}
                        aoExcluir={excluir}
                        aoErro={aoErro}
                    />
                ))}
            </div>

            {/* Os estados de carregando/erro/vazio só aparecem quando não há
                nada em tela: durante o "carregar mais" a lista já visível é
                a melhor indicação de que algo está acontecendo. */}
            <EstadoLista
                carregando={carregando && posts.length === 0}
                erro={erro && posts.length === 0 ? erro : null}
                vazio={!carregando && !erro && posts.length === 0}
                mensagemVazio="Nenhuma publicação por aqui ainda."
                aoTentarDeNovo={recarregar}
            />

            {temMais && (
                <button
                    type="button"
                    className="perfil-posts-mais"
                    onClick={proxima}
                    disabled={carregando}
                >
                    {carregando ? 'Carregando...' : 'Carregar mais'}
                </button>
            )}
        </section>
    )
}

export default PostsDoPerfil
