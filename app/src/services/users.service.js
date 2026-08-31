import { request, query } from './http'

/** GET /users/me — perfil do usuário autenticado. */
export const meuPerfil = ({ signal } = {}) =>
    request('/users/me', null, { auth: true, signal })

/** GET /users/:alias — perfil público. */
export const perfilPorAlias = (alias, { signal } = {}) =>
    request(`/users/${encodeURIComponent(alias)}`, null, { auth: true, signal })

/** GET /users?q= — busca paginada por nome ou @. */
export const buscarUsuarios = ({ q, page = 1, limit = 8, signal } = {}) =>
    request(`/users${query({ q, page, limit })}`, null, { auth: true, signal })

/** PATCH /users/me — atualiza campos do próprio perfil. */
export const atualizarPerfil = (campos) =>
    request('/users/me', campos, { metodo: 'PATCH', auth: true, mantemSessao: true })

/** POST|DELETE /users/:alias/follow */
export const alternarSeguir = (alias, following) =>
    request(`/users/${encodeURIComponent(alias)}/follow`, null, {
        metodo: following ? 'DELETE' : 'POST',
        auth: true,
    })

/** POST /users/photo — multipart com o campo `photo`. */
export function enviarFoto(blob) {
    const form = new FormData()
    form.append('photo', blob, 'perfil.jpg')
    return request('/users/photo', form, { formData: true, auth: true })
}

/**
 * POST /users/me/deletion/code — envia o código que autoriza a exclusão.
 *
 * Devolve o e-mail mascarado (`a*****@gmail.com`) para a interface confirmar
 * o destino sem escrever o endereço inteiro na tela.
 */
export const solicitarCodigoExclusao = () =>
    /* `metodo: 'POST'` é obrigatório aqui. O `request` infere o verbo pelo
       corpo — `metodo ?? (corpo ? 'POST' : 'GET')` — e esta rota não tem
       corpo: a identidade vem do token e o e-mail de destino é lido do
       banco, nada precisa ser enviado. Sem o verbo explícito sairia um GET
       para uma rota que só aceita POST, e o 404 apareceria na interface
       como "não foi possível enviar o código". */
    request('/users/me/deletion/code', null, { metodo: 'POST', auth: true })

/**
 * DELETE /users/me — exclui a conta autenticada.
 *
 * O código vai na query, e não no corpo: `fetch` com `DELETE` e corpo é
 * aceito pelo servidor, mas alguns intermediários descartam o corpo de um
 * DELETE. A query atravessa qualquer um deles.
 */
export const excluirConta = (code) =>
    request(`/users/me?code=${encodeURIComponent(code)}`, null, {
        metodo: 'DELETE',
        auth: true,
    })
