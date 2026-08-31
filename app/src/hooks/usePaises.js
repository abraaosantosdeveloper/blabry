import { useCallback, useEffect, useState } from 'react'
import { listarPaises } from '../services/auth.service'

/* Aceita as formas mais prováveis de resposta do back-end:
   ['BRA', ...] | [{ country, name? }] | { paises: [...] } */
function normalizar(resposta) {
    const lista = Array.isArray(resposta) ? resposta : (resposta?.paises ?? resposta?.countries ?? [])
    return lista
        .map((item) => {
            const value = typeof item === 'string' ? item : (item.country ?? item.codigo ?? item.value)
            const name = typeof item === 'string' ? null : (item.name ?? item.name ?? item.label)
            return value ? { value, label: name ? `${name} (${value})` : value } : null
        })
        .filter(Boolean)
        .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'))
}

export default function usePaises() {
    const [paises, setPaises] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [falhou, setFalhou] = useState(false)

    const buscar = useCallback(async () => {
        setCarregando(true)
        setFalhou(false)
        try {
            setPaises(normalizar(await listarPaises()))
        } catch {
            setFalhou(true)
        } finally {
            setCarregando(false)
        }
    }, [])

    useEffect(() => { buscar() }, [buscar])

    return { paises, carregando, falhou, recarregar: buscar }
}
