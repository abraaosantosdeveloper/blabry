import { request } from './http'

export { mensagemDeErro } from './http'

export const login = (dados) => request('/auth/login', dados)
export const cadastrar = (dados) => request('/auth/cadastro', dados)
export const listarPaises = () => request('/countries')
