import { useEffect, useState } from 'react'

/* Ordem, rótulo e ícone de cada categoria. A chave é o nome do grupo do
   pacote, normalizado — assim pequenas variações de grafia entre versões
   ("Smileys & Emotion", "smileys_emotion") caem no mesmo lugar. */
const CATEGORIAS = {
    smileysemotion: { ordem: 1, rotulo: 'Sorrisos', icone: '😀' },
    peoplebody: { ordem: 2, rotulo: 'Pessoas', icone: '🧑' },
    animalsnature: { ordem: 3, rotulo: 'Natureza', icone: '🐶' },
    fooddrink: { ordem: 4, rotulo: 'Comida', icone: '🍕' },
    travelplaces: { ordem: 5, rotulo: 'Viagem', icone: '✈️' },
    activities: { ordem: 6, rotulo: 'Atividades', icone: '⚽' },
    objects: { ordem: 7, rotulo: 'Objetos', icone: '💡' },
    symbols: { ordem: 8, rotulo: 'Símbolos', icone: '🔣' },
    flags: { ordem: 9, rotulo: 'Bandeiras', icone: '🏳️' },
}

const chave = (name) => String(name).toLowerCase().replace(/[^a-z]/g, '')

/**
 * Normaliza o formato do pacote para o que a interface precisa.
 * O `data-by-group` já veio como array de grupos e como objeto indexado
 * por nome em versões diferentes — os dois casos são tratados aqui, para
 * que uma atualização do pacote não quebre o componente.
 */
function normalizar(dados) {
    const bruto = Array.isArray(dados)
        ? dados.map((g) => [g.name ?? g.slug, g.emojis ?? []])
        : Object.entries(dados)

    return bruto
        .map(([name, lista]) => {
            const categoria = CATEGORIAS[chave(name)]
            if (!categoria) return null   // descarta "Component" (tons de pele)

            return {
                id: chave(name),
                ...categoria,
                emojis: (lista ?? [])
                    .map((e) => ({
                        char: typeof e === 'string' ? e : e.emoji,
                        name: typeof e === 'string' ? '' : (e.name ?? e.slug ?? ''),
                    }))
                    .filter((e) => e.char),
            }
        })
        .filter((g) => g && g.emojis.length)
        .sort((a, b) => a.ordem - b.ordem)
}

/* Cache em escopo de módulo: o JSON é carregado uma vez por sessão, mesmo
   que o painel abra e feche várias vezes. */
let cache = null
let carregamento = null

/** Carrega a lista completa de emojis sob demanda. */
export default function useEmojis() {
    const [grupos, setGrupos] = useState(cache)
    const [erro, setErro] = useState(null)

    useEffect(() => {
        if (cache) return
        let ativo = true

        carregamento ??= import('unicode-emoji-json/data-by-group.json')
            .then((modulo) => normalizar(modulo.default ?? modulo))

        carregamento
            .then((dados) => {
                cache = dados
                if (ativo) setGrupos(dados)
            })
            .catch((err) => {
                carregamento = null           // permite nova tentativa
                if (ativo) setErro(err)
            })

        return () => { ativo = false }
    }, [])

    return { grupos, carregando: !grupos && !erro, erro }
}
