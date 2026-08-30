import { request, query } from './http'

/** GET /posts — feed paginado. */
export const listarPosts = ({ pagina = 1, limite = 10, signal } = {}) =>
    request(`/posts${query({ pagina, limite })}`, null, { auth: true, signal })

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

/** POST /posts/:id/comments */
export const comentar = (id, texto) =>
    request(`/posts/${id}/comments`, { texto }, { auth: true })

/** POST|DELETE /comments/:id/like */
export const alternarCurtidaComentario = (id, curtido) =>
    request(`/comments/${id}/like`, null, { metodo: curtido ? 'DELETE' : 'POST', auth: true })
