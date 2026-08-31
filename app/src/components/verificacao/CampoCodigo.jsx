import { useEffect, useRef } from 'react'
import './CampoCodigo.css'

/** Quantidade de dígitos — espelha TAMANHO em utils/codigo_verificacao.js. */
export const TAMANHO_CODIGO = 6

/**
 * Campo de código de verificação.
 *
 * É UM input só, com `letter-spacing` largo, e não seis caixinhas separadas.
 * A escolha é deliberada: seis inputs quebram o autopreenchimento do código
 * pelo sistema operacional (iOS e Android oferecem o código lido do SMS ou
 * do e-mail para um campo `one-time-code`), atrapalham colar o código com um
 * Ctrl+V, e obrigam a gerenciar foco entre campos — três problemas em troca
 * de um efeito visual.
 *
 * @param {string} valor
 * @param {(valor: string) => void} aoMudar
 * @param {boolean} [erro] pinta a borda de vermelho
 * @param {boolean} [desabilitado]
 */
function CampoCodigo({ valor, aoMudar, erro = false, desabilitado = false, id = 'campo-codigo' }) {
    const refInput = useRef(null)

    /* Foco automático ao montar: quando este campo aparece, digitar o código
       é a única coisa que o usuário tem a fazer ali. */
    useEffect(() => {
        refInput.current?.focus()
    }, [])

    return (
        <div className={`campo-codigo ${erro ? 'com-erro' : ''}`}>
            <label htmlFor={id} className="sr-only">Código de verificação</label>
            <input
                ref={refInput}
                id={id}
                type="text"
                /* inputMode="numeric" abre o teclado numérico no celular sem
                   usar type="number", que traria setas de incremento e
                   permitiria sinais e notação científica. */
                inputMode="numeric"
                /* autoComplete="one-time-code" é o que faz o sistema oferecer
                   o código recém-recebido logo acima do teclado. */
                autoComplete="one-time-code"
                maxLength={TAMANHO_CODIGO}
                placeholder="000000"
                value={valor}
                disabled={desabilitado}
                onChange={(e) => {
                    /* Filtra tudo que não é dígito. Isso cobre o caso de colar
                       o código com espaços ou traços vindos do e-mail, sem
                       obrigar o usuário a limpar nada à mão. */
                    const somenteDigitos = e.target.value.replace(/\D/g, '').slice(0, TAMANHO_CODIGO)
                    aoMudar(somenteDigitos)
                }}
                aria-invalid={erro}
            />
        </div>
    )
}

export default CampoCodigo
