import { useCallback, useSyncExternalStore } from 'react'

const CHAVE = 'tema'
const CLARO = 'claro'
const ESCURO = 'escuro'

/* ------------------------------------------------------------------
   Store externa em escopo de módulo.
   O tema é um estado global de verdade: o perfil o altera, o cabeçalho
   precisa reagir. Com useState em cada componente, cada um teria a sua
   cópia. Uma store única evita isso sem exigir um Provider em volta da
   árvore — o React se inscreve nela por useSyncExternalStore.
   ------------------------------------------------------------------ */

const consultaSistema = () =>
    typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null

function temaSalvo() {
    try {
        const guardado = localStorage.getItem(CHAVE)
        return guardado === CLARO || guardado === ESCURO ? guardado : null
    } catch {
        return null
    }
}

let tema = temaSalvo() ?? (consultaSistema()?.matches ? ESCURO : CLARO)

const ouvintes = new Set()

function aplicar(novo) {
    if (novo === tema) return
    tema = novo
    if (typeof document !== 'undefined') document.documentElement.dataset.tema = novo
    ouvintes.forEach((notificar) => notificar())
}

function subscrever(ouvinte) {
    ouvintes.add(ouvinte)
    return () => ouvintes.delete(ouvinte)
}

const ler = () => tema

/* Enquanto o usuário não escolher, o app acompanha o sistema em tempo real. */
consultaSistema()?.addEventListener('change', (e) => {
    if (temaSalvo()) return
    aplicar(e.matches ? ESCURO : CLARO)
})

/** Tema da aplicação, compartilhado por todos os componentes. */
export default function useTema() {
    const atual = useSyncExternalStore(subscrever, ler, ler)

    const alternar = useCallback(() => {
        const proximo = ler() === ESCURO ? CLARO : ESCURO
        try { localStorage.setItem(CHAVE, proximo) } catch { /* navegação privada */ }
        aplicar(proximo)
    }, [])

    return { tema: atual, escuro: atual === ESCURO, alternar }
}
