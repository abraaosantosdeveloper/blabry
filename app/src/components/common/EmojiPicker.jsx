import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import useEmojis from '../../hooks/useEmojis'
import './EmojiPicker.css'

/** Ícone do botão que abre o painel. Exportado porque mais de um campo o usa. */
export const EmojiIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8.5 14.5c.9 1.2 2.1 1.8 3.5 1.8s2.6-.6 3.5-1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="9" cy="10" r="1.1" fill="currentColor" />
        <circle cx="15" cy="10" r="1.1" fill="currentColor" />
    </svg>
)

const MARGEM = 12

/* Altura confortável e piso mínimo. O piso garante busca + abas + três
   linhas de emoji; abaixo disso o painel deixa de ser útil. */
const ALTURA_IDEAL = 320
const ALTURA_MINIMA = 220

const LIMITE_BUSCA = 120

/** Remove acentos para que "coracao" encontre "coração". */
const semAcento = (texto) =>
    texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

/**
 * Painel de emojis.
 *
 * Renderiza uma categoria por vez — assim nunca há mais de ~200 botões no
 * DOM, mesmo com o conjunto Unicode completo (~1900). É a alternativa
 * simples à virtualização, e cai bem porque a navegação já é por abas.
 */
function EmojiPicker({ ancoraRef, aoEscolher, aoFechar }) {
    const painelRef = useRef(null)
    const [posicao, setPosicao] = useState(null)
    const [categoria, setCategoria] = useState(null)
    const [busca, setBusca] = useState('')

    const { grupos, carregando, erro } = useEmojis()

    useEffect(() => {
        if (grupos?.length && !categoria) setCategoria(grupos[0].id)
    }, [grupos, categoria])

    const termo = semAcento(busca.trim())

    const visiveis = useMemo(() => {
        if (!grupos?.length) return []

        if (termo.length >= 2) {
            const achados = []
            for (const grupo of grupos) {
                for (const emoji of grupo.emojis) {
                    if (semAcento(emoji.nome).includes(termo)) achados.push(emoji)
                    if (achados.length >= LIMITE_BUSCA) return achados
                }
            }
            return achados
        }

        return grupos.find((g) => g.id === categoria)?.emojis ?? []
    }, [grupos, categoria, termo])

    const posicionar = useCallback(() => {
        const ancora = ancoraRef?.current
        const painel = painelRef.current
        if (!ancora || !painel) return

        const r = ancora.getBoundingClientRect()
        const largura = painel.offsetWidth

        const espacoAcima = r.top - 8 - MARGEM
        const espacoAbaixo = window.innerHeight - r.bottom - 8 - MARGEM

        /* Abre para baixo por padrão. Só inverte quando não cabe o mínimo
           embaixo e há mais espaço em cima. A altura vem de constantes, não
           da medição do conteúdo: medir o painel para depois limitá-lo pelo
           resultado da medição criava um laço que o mantinha achatado. */
        const acima = espacoAbaixo < ALTURA_MINIMA && espacoAcima > espacoAbaixo

        const disponivel = acima ? espacoAcima : espacoAbaixo
        const altura = Math.min(
            Math.max(ALTURA_MINIMA, Math.min(ALTURA_IDEAL, disponivel)),
            window.innerHeight - MARGEM * 2
        )

        const top = acima
            ? Math.max(MARGEM, r.top - altura - 8)
            : Math.min(r.bottom + 8, window.innerHeight - altura - MARGEM)

        setPosicao({
            top,
            left: Math.max(MARGEM, Math.min(r.left, window.innerWidth - largura - MARGEM)),
            altura,
        })
    }, [ancoraRef])

    useLayoutEffect(posicionar, [posicionar])

    useEffect(() => {
        const aoTeclar = (e) => { if (e.key === 'Escape') aoFechar() }
        const aoClicar = (e) => {
            if (painelRef.current?.contains(e.target)) return
            if (ancoraRef?.current?.contains(e.target)) return
            aoFechar()
        }

        document.addEventListener('keydown', aoTeclar)
        document.addEventListener('mousedown', aoClicar)
        window.addEventListener('resize', posicionar)
        window.addEventListener('scroll', posicionar, true)

        return () => {
            document.removeEventListener('keydown', aoTeclar)
            document.removeEventListener('mousedown', aoClicar)
            window.removeEventListener('resize', posicionar)
            window.removeEventListener('scroll', posicionar, true)
        }
    }, [aoFechar, ancoraRef, posicionar])

    return (
        <div
            className="emoji-painel"
            ref={painelRef}
            role="dialog"
            aria-label="Escolher emoji"
            style={posicao
                ? { top: posicao.top, left: posicao.left, height: posicao.altura }
                : { visibility: 'hidden' }}
        >
            <div className="emoji-busca">
                <label htmlFor="emoji-busca" className="sr-only">Buscar emoji</label>
                <input
                    id="emoji-busca"
                    type="search"
                    placeholder="Buscar emoji..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    autoComplete="off"
                />
            </div>

            {grupos?.length > 0 && !termo && (
                <div className="emoji-categorias" role="tablist" aria-label="Categorias">
                    {grupos.map((g) => (
                        <button
                            key={g.id}
                            type="button"
                            role="tab"
                            aria-selected={categoria === g.id}
                            className={`emoji-categoria ${categoria === g.id ? 'ativa' : ''}`}
                            onClick={() => setCategoria(g.id)}
                            title={g.rotulo}
                            aria-label={g.rotulo}
                        >
                            <span aria-hidden="true">{g.icone}</span>
                        </button>
                    ))}
                </div>
            )}

            <div className="emoji-conteudo">
                {carregando && <p className="emoji-aviso">Carregando emojis...</p>}
                {erro && <p className="emoji-aviso">Não foi possível carregar os emojis.</p>}

                {!carregando && !erro && (
                    <>
                        {termo && (
                            <p className="emoji-titulo">
                                {visiveis.length ? 'Resultados' : 'Nenhum emoji encontrado'}
                            </p>
                        )}

                        <div className="emoji-grade">
                            {visiveis.map((e) => (
                                <button
                                    key={e.char}
                                    type="button"
                                    className="emoji-item"
                                    onClick={() => aoEscolher(e.char)}
                                    title={e.nome}
                                    aria-label={e.nome || 'Emoji'}
                                >
                                    {e.char}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default EmojiPicker
