import { request, query } from './http'

/** GET /posts — feed paginado. */
export const listarPosts = ({ page = 1, limit = 10, signal } = {}) =>
    request(`/posts${query({ page, limit })}`, null, { auth: true, signal })

/** GET /posts?q= — busca no conteúdo das publicações. */
export const buscarPosts = ({ q, page = 1, limit = 8, signal } = {}) =>
    request(`/posts${query({ q, page, limit })}`, null, { auth: true, signal })

/**
 * GET /posts/:id — uma publicação específica, para a página dedicada.
 *
 * Aceita `signal` porque a página pode ser abandonada antes da resposta
 * chegar; sem ele, o React tentaria atualizar um componente desmontado.
 */
export const buscarPost = (id, { signal } = {}) =>
    request(`/posts/${id}`, null, { auth: true, signal })

/**
 * GET /users/:alias/posts — publicações de um autor, paginadas.
 *
 * Alimenta a seção de publicações do perfil. O mesmo endpoint serve o
 * próprio perfil e o de terceiros: publicação é conteúdo público, então
 * não há duas respostas diferentes a distinguir aqui.
 */
export const listarPostsDoUsuario = (alias, { page = 1, limit = 10, signal } = {}) =>
    request(`/users/${alias}/posts${query({ page, limit })}`, null, { auth: true, signal })

/** POST /posts — cria uma publicação. */
export const criarPost = (text) =>
    request('/posts', { text }, { auth: true })

/** PATCH /posts/:id — só o autor, nos primeiros 15 minutos. */
export const editarPost = (id, text) =>
    request(`/posts/${id}`, { text }, { metodo: 'PATCH', auth: true })

/** DELETE /posts/:id */
export const excluirPost = (id) =>
    request(`/posts/${id}`, null, { metodo: 'DELETE', auth: true })

/** POST|DELETE /posts/:id/like — devolve { curtidas, curtido }. */
export const alternarCurtida = (id, liked) =>
    request(`/posts/${id}/like`, null, { metodo: liked ? 'DELETE' : 'POST', auth: true })

/** GET /posts/:id/comments — paginado. */
export const listarComentarios = (id, { page = 1, limit = 10, signal } = {}) =>
    request(`/posts/${id}/comments${query({ page, limit })}`, null, { auth: true, signal })

/** PATCH /posts/:postId/comments/:id — só o autor, nos primeiros 15 minutos. */
export const editarComentario = (postId, commentId, text) =>
    request(`/posts/${postId}/comments/${commentId}`, { text }, { metodo: 'PATCH', auth: true })

/** DELETE /posts/:postId/comments/:id */
export const excluirComentario = (postId, commentId) =>
    request(`/posts/${postId}/comments/${commentId}`, null, { metodo: 'DELETE', auth: true })

/** POST /posts/:id/comments */
export const comentar = (id, text) =>
    request(`/posts/${id}/comments`, { text }, { auth: true })

/** POST|DELETE /comments/:id/like */
export const alternarCurtidaComentario = (id, liked) =>
    request(`/comments/${id}/like`, null, { metodo: liked ? 'DELETE' : 'POST', auth: true })
