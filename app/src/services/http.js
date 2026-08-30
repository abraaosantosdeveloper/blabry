const API = import.meta.env.VITE_API_URL

const MENSAGENS = {
    0: 'Sem conexão com o servidor. Tente novamente.',
    400: 'Preencha todos os campos corretamente.',
    401: 'Email ou senha incorretos.',
    403: 'Você não tem permissão para isso.',
    404: 'Não encontramos o que você procura.',
    409: 'Este email ou @ já está em uso.',
    413: 'Imagem muito grande. Escolha uma menor.',
    415: 'Formato de imagem não suportado. Envie JPEG, PNG ou WebP.',
    429: 'Muitas tentativas. Aguarde um instante.',
}

export const mensagemDeErro = (err) =>
    MENSAGENS[err?.status] ?? err?.message ?? 'Algo deu errado. Tente novamente.'

/** Monta uma query string ignorando valores vazios. */
export function query(params = {}) {
    const busca = new URLSearchParams()
    Object.entries(params).forEach(([chave, valor]) => {
        if (valor !== undefined && valor !== null && valor !== '') busca.set(chave, valor)
    })
    const s = busca.toString()
    return s ? `?${s}` : ''
}

/**
 * Requisição única da aplicação.
 * @param {string} rota caminho a partir da raiz da API
 * @param {object} corpo JSON ou FormData
 * @param {{metodo?: string, formData?: boolean, auth?: boolean, signal?: AbortSignal}} opcoes
 */
export async function request(rota, corpo, { metodo, formData = false, auth = false, signal } = {}) {
    const headers = {}
    if (corpo && !formData) headers['Content-Type'] = 'application/json'
    if (auth) headers.Authorization = `Bearer ${localStorage.getItem('token')}`

    let res
    try {
        res = await fetch(`${API}${rota}`, {
            method: metodo ?? (corpo ? 'POST' : 'GET'),
            headers,
            body: corpo ? (formData ? corpo : JSON.stringify(corpo)) : undefined,
            signal,
        })
    } catch (err) {
        if (err.name === 'AbortError') throw err
        throw Object.assign(new Error('Falha de rede'), { status: 0 })
    }

    if (res.status === 401 && auth) {
        localStorage.removeItem('token')
        localStorage.removeItem('nome')
    }

    const dados = await res.json().catch(() => ({}))
    if (!res.ok) throw Object.assign(new Error(dados.erro || 'Erro'), { status: res.status })
    return dados
}
