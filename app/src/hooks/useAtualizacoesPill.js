import { useEffect, useState } from 'react'
import { escutarAtualizacoesPill } from '../services/posts.service'

export default function useAtualizacoesPill() {
    const [temAtualizacoes, setTemAtualizacoes] = useState(false)

    useEffect(() => {
        const controller = new AbortController()

        escutarAtualizacoesPill({
            signal: controller.signal,
            aoAtualizar: () => setTemAtualizacoes(true),
        }).catch((err) => {
            if (err.name !== 'AbortError') return
        })

        return () => controller.abort()
    }, [])

    return {
        temAtualizacoes,
        limparAtualizacoes: () => setTemAtualizacoes(false),
    }
}