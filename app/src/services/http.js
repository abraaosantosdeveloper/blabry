const API = import.meta.env.VITE_API_URL

const MENSAGENS = {
    0: 'Sem conexão com o servidor. Tente novamente.',
    400: 'Preencha todos os campos corretamente.',
    401: 'E-mail ou senha incorretos.',
    403: 'Você não tem permissão para isso.',
    404: 'Não encontramos o que você procura.',
    409: 'Este e-mail ou @ já está em uso.',
    413: 'Imagem muito grande. Escolha uma menor.',
    415: 'Formato de imagem não suportado. Envie JPEG, PNG ou WebP.',
    429: 'Muitas tentativas. Aguarde um instante.',
}

/* Mensagens de reserva por status, para quando o servidor não explicar o
   motivo — ou quando nem chegamos a falar com ele. */

/**
 * Texto a exibir para um erro.
 *
 * A mensagem da API tem prioridade: ela conhece o contexto ("Você não pode
 * seguir a si mesmo", "A edição só é possível nos primeiros 15 minutos") e o
 * mapa por status, não. O mapa entra quando a resposta não trouxe motivo —
 * falha de rede, ou um erro sem corpo.
 */
export const mensagemDeErro = (err) => {
    const daApi = err?.message

    // 'Erro' e 'Falha de rede' são os textos que o próprio request inventa
    // quando não recebeu explicação nenhuma; não servem ao usuário.
    const generica = !daApi || daApi === 'Erro' || daApi === 'Falha de rede'

    if (!generica) return daApi

    return MENSAGENS[err?.status] ?? 'Algo deu errado. Tente novamente.'
}

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
 * @param {{metodo?: string, formData?: boolean, auth?: boolean, signal?: AbortSignal, mantemSessao?: boolean}} opcoes
 */
export async function request(rota, corpo, { metodo, formData = false, auth = false, signal, mantemSessao = false } = {}) {
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

    /* 401 normalmente significa token expirado — daí a limpeza da sessão.
       Mas há rotas em que 401 é uma reautenticação pontual ("informe a senha
       atual"): ali o token continua válido e derrubar a sessão seria errado. */
    if (res.status === 401 && auth && !mantemSessao) {
        localStorage.removeItem('token')
        localStorage.removeItem('name')
    }

    const dados = await res.json().catch(() => ({}))
    if (!res.ok) throw Object.assign(new Error(dados.error || 'Erro'), { status: res.status })
    return dados
}
