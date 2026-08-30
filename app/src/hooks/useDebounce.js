import { useEffect, useState } from 'react'

/** Devolve `valor` só depois de `atraso` ms sem mudanças. */
export default function useDebounce(valor, atraso = 400) {
    const [atrasado, setAtrasado] = useState(valor)

    useEffect(() => {
        const timer = setTimeout(() => setAtrasado(valor), atraso)
        return () => clearTimeout(timer)
    }, [valor, atraso])

    return atrasado
}
