import { useEffect, useState } from 'react'
import { meuPerfil } from '../services/usuarios.service'

/**
 * Dados do usuário autenticado.
 * Começa pelo que há no localStorage (render imediato) e substitui pelo
 * perfil da API assim que ele chega.
 */
export default function useUsuarioAtual() {
    const [usuario, setUsuario] = useState(() => ({
        nome: localStorage.getItem('nome') || '',
        alias: localStorage.getItem('alias') || '',
        fotoUrl: localStorage.getItem('fotoUrl') || null,
    }))

    useEffect(() => {
        const controller = new AbortController()

        meuPerfil({ signal: controller.signal })
            .then((dados) => {
                setUsuario(dados)
                if (dados.nome) localStorage.setItem('nome', dados.nome)
                if (dados.alias) localStorage.setItem('alias', dados.alias)
                if (dados.fotoUrl) localStorage.setItem('fotoUrl', dados.fotoUrl)
            })
            .catch(() => { /* mantém o que veio do localStorage */ })

        return () => controller.abort()
    }, [])

    return usuario
}
