import { useEffect, useState } from 'react'
import Modal from './Modal'
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
 * demonstrar intenção — entender o efeito, provar identidade e digitar a
 * palavra de confirmação. Nenhuma etapa pode ser pulada.
 */
function ExcluirContaModal({ aberto, aoFechar, email, aoConfirmar }) {
    const [etapa, setEtapa] = useState(0)
    const [senha, setSenha] = useState('')
    const [emailDigitado, setEmailDigitado] = useState('')
    const [palavra, setPalavra] = useState('')
    const [enviando, setEnviando] = useState(false)

    useEffect(() => {
        if (aberto) return
        setEtapa(0); setSenha(''); setEmailDigitado(''); setPalavra(''); setEnviando(false)
    }, [aberto])

    const emailConfere = emailDigitado.trim().toLowerCase() === String(email ?? '').toLowerCase()
    const podeAvancar = etapa === 1 ? emailConfere && senha.length > 0 : true
    const podeExcluir = palavra === PALAVRA && !enviando

    async function excluir() {
        if (!podeExcluir) return
        setEnviando(true)
        try {
            await aoConfirmar?.({ email: emailDigitado.trim(), senha })
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
                    </>
                )}

                {etapa === 1 && (
                    <>
                        <p className="excluir-texto">
                            Confirme que é você digitando o e-mail e a senha da conta.
                        </p>

                        <label className="excluir-campo">
                            <span>E-mail da conta</span>
                            <input
                                type="email"
                                value={emailDigitado}
                                onChange={(e) => setEmailDigitado(e.target.value)}
                                autoComplete="off"
                                placeholder="seu@email.com"
                            />
                        </label>

                        <label className="excluir-campo">
                            <span>Senha</span>
                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                autoComplete="current-password"
                                placeholder="Sua senha"
                            />
                        </label>

                        {emailDigitado && !emailConfere && (
                            <p className="excluir-aviso">O e-mail não confere com o da conta.</p>
                        )}
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
                            onClick={() => setEtapa((e) => e + 1)}
                            disabled={!podeAvancar}
                        >
                            Continuar
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
