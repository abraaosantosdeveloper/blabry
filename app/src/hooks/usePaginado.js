import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Consome uma rota paginada da API.
 *
 * @param {(args:{pagina:number, signal:AbortSignal}) => Promise<object>} buscar
 * @param {{campo: string, ativo?: boolean, acumular?: boolean, deps?: any[]}} opcoes
 *   campo    → nome do array dentro da resposta (ex.: 'posts')
 *   acumular → true concatena páginas (feed); false substitui (busca)
 */
export default function usePaginado(buscar, { campo, ativo = true, acumular = false, deps = [] }) {
    const [itens, setItens] = useState([])
    const [pagina, setPagina] = useState(1)
    const [totalPaginas, setTotalPaginas] = useState(1)
    const [total, setTotal] = useState(0)
    const [carregando, setCarregando] = useState(ativo)
    const [erro, setErro] = useState(null)

    const abortRef = useRef(null)

    const carregar = useCallback(async (numeroPagina) => {
        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller

        setCarregando(true)
        setErro(null)
        try {
            const dados = await buscar({ pagina: numeroPagina, signal: controller.signal })
            const lista = dados?.[campo] ?? []
            setItens((atuais) => (acumular && numeroPagina > 1 ? [...atuais, ...lista] : lista))
            setTotalPaginas(dados?.totalPaginas ?? 1)
            setTotal(dados?.total ?? lista.length)
            setPagina(numeroPagina)
        } catch (err) {
            if (err.name === 'AbortError') return
            setErro(err)
        } finally {
            if (!controller.signal.aborted) setCarregando(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campo, acumular, ...deps])

    useEffect(() => {
        if (!ativo) {
            setItens([])
            setCarregando(false)
            return
        }
        carregar(1)
        return () => abortRef.current?.abort()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ativo, carregar])

    return {
        itens,
        setItens,
        pagina,
        totalPaginas,
        total,
        carregando,
        erro,
        temMais: pagina < totalPaginas,
        irPara: carregar,
        proxima: () => carregar(pagina + 1),
        anterior: () => carregar(Math.max(1, pagina - 1)),
        recarregar: () => carregar(1),
    }
}
