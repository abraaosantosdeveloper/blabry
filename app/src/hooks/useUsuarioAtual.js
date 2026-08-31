import { useEffect, useState } from 'react'
import { meuPerfil } from '../services/users.service'

/**
 * Dados do usuário autenticado.
 * Começa pelo que há no localStorage (render imediato) e substitui pelo
 * perfil da API assim que ele chega.
 */
export default function useUsuarioAtual() {
    const [usuario, setUsuario] = useState(() => ({
        name: localStorage.getItem('name') || '',
        alias: localStorage.getItem('alias') || '',
        photoUrl: localStorage.getItem('photoUrl') || null,
    }))

    useEffect(() => {
        const controller = new AbortController()

        meuPerfil({ signal: controller.signal })
            .then((dados) => {
                setUsuario(dados)
                if (dados.name) localStorage.setItem('name', dados.name)
                if (dados.alias) localStorage.setItem('alias', dados.alias)
                if (dados.photoUrl) localStorage.setItem('photoUrl', dados.photoUrl)
            })
            .catch(() => { /* mantém o que veio do localStorage */ })

        return () => controller.abort()
    }, [])

    return usuario
}
