import { useEffect, useState } from 'react'
import Modal from './Modal'
import CampoCodigo, { TAMANHO_CODIGO } from '../verificacao/CampoCodigo'
import DangerIcon from '../../assets/icons/danger.svg?react'
import './ExcluirContaModal.css'

const PALAVRA = 'EXCLUIR'

const CONSEQUENCIAS = [
    'Seu perfil, seus blabs e seus comentários serão removidos.',
    'Suas conversas deixarão de aparecer para você.',
    'Seu @ ficará indisponível e não poderá ser recuperado.',
]

/**
 * Exclusão de conta em três etapas.
 *
 * A fricção é deliberada: a ação é irreversível, então o usuário precisa
 * demonstrar intenção — entender o efeito, provar que está de fato ali, e
 * digitar a palavra de confirmação. Nenhuma etapa pode ser pulada.
 *
 * A etapa do meio deixou de pedir e-mail e senha e passou a pedir um código
 * enviado por e-mail. O motivo: senha é algo que o navegador já preenche
 * sozinho e que fica salva em um computador deixado aberto — ela não
 * distingue o dono de quem se sentou na cadeira dele. O código exige acesso
 * à caixa de entrada no momento da ação.
 *
 * @param {(dados: {codigo: string}) => Promise<void>} aoConfirmar
 * @param {() => Promise<{email: string}>} aoPedirCodigo devolve o e-mail
 *   mascarado para exibição
 */
function ExcluirContaModal({ aberto, aoFechar, email, aoConfirmar, aoPedirCodigo }) {
    const [etapa, setEtapa] = useState(0)
    const [codigo, setCodigo] = useState('')
    const [palavra, setPalavra] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [pedindoCodigo, setPedindoCodigo] = useState(false)
    // E-mail mascarado devolvido pelo servidor (a*****@gmail.com).
    const [destino, setDestino] = useState('')
    const [erroCodigo, setErroCodigo] = useState(null)

    /* Tudo volta ao início quando o modal fecha. Sem isso, reabrir traria o
       código já digitado e a etapa em que se parou — estado antigo em uma
       ação irreversível é exatamente o que não se quer. */
    useEffect(() => {
        if (aberto) return
        setEtapa(0); setCodigo(''); setPalavra(''); setEnviando(false)
        setPedindoCodigo(false); setDestino(''); setErroCodigo(null)
    }, [aberto])

    const podeAvancar = etapa === 1 ? codigo.length === TAMANHO_CODIGO : true
    const podeExcluir = palavra === PALAVRA && !enviando

    /** Etapa 0 → 1: pede o código antes de mostrar o campo. */
    async function avancarParaCodigo() {
        if (pedindoCodigo) return
        setPedindoCodigo(true)
        setErroCodigo(null)
        try {
            const dados = await aoPedirCodigo?.()
            setDestino(dados?.email ?? '')
            setEtapa(1)
        } catch (err) {
            // O erro fica dentro do modal, e não em um toast atrás dele:
            // o usuário precisa vê-lo sem fechar o fluxo.
            setErroCodigo(err?.message || 'Não foi possível enviar o código.')
        } finally {
            setPedindoCodigo(false)
        }
    }

    async function excluir() {
        if (!podeExcluir) return
        setEnviando(true)
        try {
            await aoConfirmar?.({ codigo })
        } finally {
            setEnviando(false)
        }
    }

    return (
        <Modal aberto={aberto} aoFechar={aoFechar} rotulo="Excluir conta">
            <div className="excluir">
                <div className="excluir-cabecalho">
                    <span className="excluir-icone"><DangerIcon aria-hidden="true" /></span>
                    <div>
                        <h2>Excluir conta</h2>
                        <p className="excluir-passo">Etapa {etapa + 1} de 3</p>
                    </div>
                </div>

                {etapa === 0 && (
                    <>
                        <p className="excluir-texto">
                            Esta ação é <strong>permanente</strong> e não pode ser desfeita.
                        </p>
                        <ul className="excluir-lista">
                            {CONSEQUENCIAS.map((item) => <li key={item}>{item}</li>)}
                        </ul>

                        <p className="excluir-ajuda">
                            No próximo passo enviaremos um código para o e-mail da conta.
                        </p>

                        {erroCodigo && <p className="excluir-aviso" role="alert">{erroCodigo}</p>}
                    </>
                )}

                {etapa === 1 && (
                    <>
                        <p className="excluir-texto">
                            Enviamos um código de {TAMANHO_CODIGO} dígitos para{' '}
                            <strong>{destino || email}</strong>. Ele vale por 15 minutos.
                        </p>

                        <CampoCodigo
                            valor={codigo}
                            aoMudar={setCodigo}
                            desabilitado={enviando}
                            id="excluir-codigo"
                        />

                        <p className="excluir-ajuda">
                            Confira a caixa de spam se o código não aparecer.
                        </p>
                    </>
                )}

                {etapa === 2 && (
                    <>
                        <p className="excluir-texto">
                            Para concluir, digite <strong>{PALAVRA}</strong> no campo abaixo.
                        </p>

                        <label className="excluir-campo">
                            <span>Confirmação</span>
                            <input
                                type="text"
                                value={palavra}
                                onChange={(e) => setPalavra(e.target.value.toUpperCase())}
                                autoComplete="off"
                                placeholder={PALAVRA}
                                aria-describedby="excluir-ajuda"
                            />
                        </label>
                        <p id="excluir-ajuda" className="excluir-ajuda">
                            Digite exatamente {PALAVRA}, em maiúsculas.
                        </p>
                    </>
                )}

                <div className="excluir-acoes">
                    <button
                        type="button"
                        className="excluir-botao neutro"
                        onClick={etapa === 0 ? aoFechar : () => setEtapa((e) => e - 1)}
                    >
                        {etapa === 0 ? 'Cancelar' : 'Voltar'}
                    </button>

                    {etapa < 2 ? (
                        <button
                            type="button"
                            className="excluir-botao"
                            /* Da etapa 0 para a 1 o código precisa ser pedido
                               ao servidor antes; da 1 para a 2 basta avançar. */
                            onClick={etapa === 0 ? avancarParaCodigo : () => setEtapa((e) => e + 1)}
                            disabled={!podeAvancar || pedindoCodigo}
                        >
                            {pedindoCodigo ? 'Enviando código...' : 'Continuar'}
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="excluir-botao perigo"
                            onClick={excluir}
                            disabled={!podeExcluir}
                        >
                            {enviando ? 'Excluindo...' : 'Excluir minha conta'}
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default ExcluirContaModal
