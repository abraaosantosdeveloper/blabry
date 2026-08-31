import { request, query } from './http'

/** GET /users/me — perfil do usuário autenticado. */
export const meuPerfil = ({ signal } = {}) =>
    request('/users/me', null, { auth: true, signal })

/** GET /users/:alias — perfil público. */
export const perfilPorAlias = (alias, { signal } = {}) =>
    request(`/users/${encodeURIComponent(alias)}`, null, { auth: true, signal })

/** GET /users?q= — busca paginada por nome ou @. */
export const buscarUsuarios = ({ q, pagina = 1, limite = 8, signal } = {}) =>
    request(`/users${query({ q, pagina, limite })}`, null, { auth: true, signal })

/** PATCH /users/me — atualiza campos do próprio perfil. */
export const atualizarPerfil = (campos) =>
    request('/users/me', campos, { metodo: 'PATCH', auth: true, mantemSessao: true })

/** POST|DELETE /users/:alias/follow */
export const alternarSeguir = (alias, seguindo) =>
    request(`/users/${encodeURIComponent(alias)}/follow`, null, {
        metodo: seguindo ? 'DELETE' : 'POST',
        auth: true,
    })

/** POST /users/photo — multipart com o campo `foto`. */
export function enviarFoto(blob) {
    const form = new FormData()
    form.append('foto', blob, 'perfil.jpg')
    return request('/users/photo', form, { formData: true, auth: true })
}

/**
 * POST /users/me/exclusao/codigo — envia o código que autoriza a exclusão.
 *
 * Devolve o e-mail mascarado (`a*****@gmail.com`) para a interface confirmar
 * o destino sem escrever o endereço inteiro na tela.
 */
export const solicitarCodigoExclusao = () =>
    request('/users/me/exclusao/codigo', null, { auth: true })

/**
 * DELETE /users/me — exclui a conta autenticada.
 *
 * O código vai na query, e não no corpo: `fetch` com `DELETE` e corpo é
 * aceito pelo servidor, mas alguns intermediários descartam o corpo de um
 * DELETE. A query atravessa qualquer um deles.
 */
export const excluirConta = (codigo) =>
    request(`/users/me?codigo=${encodeURIComponent(codigo)}`, null, {
        metodo: 'DELETE',
        auth: true,
    })
