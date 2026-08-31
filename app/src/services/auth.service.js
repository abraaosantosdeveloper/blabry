import { request } from './http'

export { mensagemDeErro } from './http'

/**
 * POST /auth/login
 *
 * Responde 403 quando o e-mail ainda não foi confirmado — distinto do 401
 * de credencial errada. É esse status que permite à interface levar o
 * usuário à tela de código em vez de dizer "senha errada".
 */
export const login = (dados) => request('/auth/login', dados)

/**
 * POST /auth/cadastro
 *
 * Não devolve mais token: a conta nasce pendente de confirmação. A resposta
 * traz `{ usuario, verificacaoPendente: true }`, e o próximo passo é a tela
 * de código.
 */
export const cadastrar = (dados) => request('/auth/cadastro', dados)

export const listarPaises = () => request('/countries')

/* ------------------------------------------------------------------
   Verificação por código enviado ao e-mail
   ------------------------------------------------------------------ */

/**
 * POST /auth/verificar-email/reenviar — pede um novo código de confirmação.
 *
 * Responde 200 mesmo para e-mail sem conta: a API não revela quem está
 * cadastrado. A interface, por isso, nunca deve prometer "enviamos" com
 * certeza — a mensagem correta é "se houver conta, o código chegou".
 */
export const reenviarCodigoCadastro = (email) =>
    request('/auth/verificar-email/reenviar', { email })

/** POST /auth/verificar-email — confirma a conta e devolve o token. */
export const confirmarEmail = ({ email, codigo }) =>
    request('/auth/verificar-email', { email, codigo })

/** POST /auth/senha/codigo — envia o código de troca de senha. */
export const solicitarCodigoSenha = (email) =>
    request('/auth/senha/codigo', { email })

/** POST /auth/senha — define a nova senha mediante código. */
export const trocarSenha = ({ email, codigo, novaSenha }) =>
    request('/auth/senha', { email, codigo, novaSenha })
