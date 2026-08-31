import { request, query } from './http'

/** GET /posts — feed paginado. */
export const listarPosts = ({ pagina = 1, limite = 10, signal } = {}) =>
    request(`/posts${query({ pagina, limite })}`, null, { auth: true, signal })

/** GET /posts?q= — busca no conteúdo das publicações. */
export const buscarPosts = ({ q, pagina = 1, limite = 8, signal } = {}) =>
    request(`/posts${query({ q, pagina, limite })}`, null, { auth: true, signal })

/** POST /posts — cria uma publicação. */
export const criarPost = (texto) =>
    request('/posts', { texto }, { auth: true })

/** DELETE /posts/:id */
export const excluirPost = (id) =>
    request(`/posts/${id}`, null, { metodo: 'DELETE', auth: true })

/** POST|DELETE /posts/:id/like — devolve { curtidas, curtido }. */
export const alternarCurtida = (id, curtido) =>
    request(`/posts/${id}/like`, null, { metodo: curtido ? 'DELETE' : 'POST', auth: true })

/** GET /posts/:id/comments — paginado. */
export const listarComentarios = (id, { pagina = 1, limite = 10, signal } = {}) =>
    request(`/posts/${id}/comments${query({ pagina, limite })}`, null, { auth: true, signal })

/** PATCH /posts/:postId/comments/:id — só o autor, nos primeiros 15 minutos. */
export const editarComentario = (postId, comentarioId, texto) =>
    request(`/posts/${postId}/comments/${comentarioId}`, { texto }, { metodo: 'PATCH', auth: true })

/** DELETE /posts/:postId/comments/:id */
export const excluirComentario = (postId, comentarioId) =>
    request(`/posts/${postId}/comments/${comentarioId}`, null, { metodo: 'DELETE', auth: true })

/** POST /posts/:id/comments */
export const comentar = (id, texto) =>
    request(`/posts/${id}/comments`, { texto }, { auth: true })

/** POST|DELETE /comments/:id/like */
export const alternarCurtidaComentario = (id, curtido) =>
    request(`/comments/${id}/like`, null, { metodo: curtido ? 'DELETE' : 'POST', auth: true })
