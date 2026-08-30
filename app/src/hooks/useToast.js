import { useCallback, useState } from 'react'

export default function useToast() {
    const [toast, setToast] = useState({ mensagem: '', tipo: '', id: 0 })

    const mostrarToast = useCallback(
        (mensagem, tipo = 'erro') => setToast({ mensagem, tipo, id: Date.now() }),
        []
    )

    return { toast, mostrarToast }
}
