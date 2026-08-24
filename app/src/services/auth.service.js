const API = import.meta.env.VITE_API_URL

export async function login({ email, senha }) {
    const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    })
    return res.json()
}

export async function cadastrar({ nome, apelido, email, senha, nascimento, nacionalidade }) {
    const res = await fetch(`${API}/auth/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, apelido, email, senha, nascimento, nacionalidade })
    })
    return res.json()
}
