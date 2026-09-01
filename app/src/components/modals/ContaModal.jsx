import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Modal from './Modal'
import EditarCampoForm, { CAMPOS } from './EditarCampoForm'
import AvatarIcon from '../../assets/icons/avatar.svg?react'
import AccountInfoIcon from '../../assets/icons/account_info.svg?react'
import LockIcon from '../../assets/icons/lock.svg?react'
import InfoIcon from '../../assets/icons/info.svg?react'
import LogoffIcon from '../../assets/icons/logoff.svg?react'
import DangerIcon from '../../assets/icons/danger.svg?react'
import TrashIcon from '../../assets/icons/trash.svg?react'
import EditIcon from '../../assets/icons/edit.svg?react'
import './ContaModal.css'

const Chevron = (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const VoltarIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

/* Data de calendário formatada a partir da string, sem passar por Date.
   `new Date('2004-01-20')` seria lido como meia-noite UTC e, em fusos
   negativos, exibiria o dia anterior. */
const dataBR = (valor) => {
    if (!valor) return '—'
    const [ano, mes, dia] = String(valor).slice(0, 10).split('-')
    return ano && mes && dia ? `${dia}/${mes}/${ano}` : '—'
}

/** Os três campos que saíram da grade do perfil e vivem aqui. */
const DADOS_PESSOAIS = [
    { campo: 'email', rotulo: 'E-mail', valor: (u) => u?.email },
    { campo: 'birthDate', rotulo: 'Nascimento', valor: (u) => dataBR(u?.birthDate) },
    { campo: 'nationality', rotulo: 'Nacionalidade', valor: (u) => u?.nationality },
]

/**
 * Opções da conta, em três vistas dentro da mesma janela.
 *
 *   menu   → lista de ações
 *   dados  → informações pessoais, com o valor de cada campo
 *   editar → formulário de um campo
 *
 * São vistas e não modais empilhados de propósito. Modal sobre modal
 * confunde o que o Esc fecha, duplica overlay e, no celular, empilha duas
 * caixas roláveis. Aqui a janela é uma só e o conteúdo desliza, que é como
 * ajustes funcionam em aplicativo nativo.
 *
 * @param {object} usuario perfil atual — alimenta os valores exibidos
 * @param {(corpo: object) => Promise<void>} aoSalvarCampo executa o PATCH
 */
function ContaModal({ aberto, aoFechar, aoAlterarSenha, aoExcluirConta, usuario, aoSalvarCampo }) {
    const navigate = useNavigate()

    const [vista, setVista] = useState('menu')
    const [campoEditando, setCampoEditando] = useState(null)
    /* Direção do deslize. Guardada em estado, e não deduzida da vista, porque
       ir de 'dados' para 'menu' e voltar usa as mesmas duas vistas — o que
       muda é o sentido. */
    const [direcao, setDirecao] = useState('frente')

    /* Ao fechar, tudo volta ao início. Sem isso, reabrir a janela mostraria a
       vista onde se parou, o que surpreende: quem clica em "Conta" espera o
       menu, não o formulário que abandonou. */
    useEffect(() => {
        if (aberto) return
        setVista('menu')
        setCampoEditando(null)
        setDirecao('frente')
    }, [aberto])

    const avancar = (destino) => { setDirecao('frente'); setVista(destino) }
    const voltar = (destino) => { setDirecao('tras'); setVista(destino) }

    function abrirEdicao(campo) {
        setCampoEditando(campo)
        avancar('editar')
    }

    function sair() {
        localStorage.removeItem('token')
        localStorage.removeItem('name')
        localStorage.removeItem('alias')
        localStorage.removeItem('photoUrl')
        navigate('/', { replace: true })
    }

    const titulos = {
        menu: 'Conta',
        dados: 'Informações pessoais',
        editar: CAMPOS[campoEditando]?.titulo ?? 'Editar',
    }

    return (
        <Modal aberto={aberto} aoFechar={aoFechar} rotulo={titulos[vista]}>
            {/* A chave force o React a remontar ao trocar de vista, que é o
                que reinicia a animação — sem ela, o mesmo nó seria reusado e
                a transição não rodaria de novo. */}
            <div className={`conta-vista ${direcao}`} key={vista}>
                {vista === 'menu' && (
                    <>
                        <h2 className="conta-titulo">
                            <AvatarIcon className="conta-titulo-icone" aria-hidden="true" />
                            Conta
                        </h2>

                        <ul className="conta-lista">
                            <li>
                                <button type="button" className="conta-item" onClick={() => avancar('dados')}>
                                    <span className="conta-item-icone"><AccountInfoIcon aria-hidden="true" /></span>
                                    <span className="conta-item-textos">
                                        <strong>Informações pessoais</strong>
                                        <small>E-mail, nascimento e nacionalidade.</small>
                                    </span>
                                    <Chevron className="conta-item-seta" aria-hidden="true" />
                                </button>
                            </li>

                            <li>
                                <button type="button" className="conta-item" onClick={aoAlterarSenha}>
                                    <span className="conta-item-icone"><LockIcon aria-hidden="true" /></span>
                                    <span className="conta-item-textos">
                                        <strong>Alterar senha</strong>
                                        <small>Enviamos um código para o seu e-mail.</small>
                                    </span>
                                    <Chevron className="conta-item-seta" aria-hidden="true" />
                                </button>
                            </li>

                            <li>
                                {/* Link, e não button+navigate: é navegação de verdade, então
                                    deve permitir abrir em nova aba e ser lida como link pelo
                                    leitor de tela. target="_blank" preserva o estado da tela
                                    atual, já que a política é leitura de apoio. */}
                                <Link
                                    className="conta-item"
                                    to="/privacy-policy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="conta-item-icone"><InfoIcon aria-hidden="true" /></span>
                                    <span className="conta-item-textos">
                                        <strong>Política de privacidade</strong>
                                        <small>Quais dados guardamos e como são tratados.</small>
                                    </span>
                                    <Chevron className="conta-item-seta" aria-hidden="true" />
                                </Link>
                            </li>

                            <li>
                                <button type="button" className="conta-item" onClick={sair}>
                                    <span className="conta-item-icone"><LogoffIcon aria-hidden="true" /></span>
                                    <span className="conta-item-textos">
                                        <strong>Sair da conta</strong>
                                        <small>Você poderá entrar de novo quando quiser.</small>
                                    </span>
                                    <Chevron className="conta-item-seta" aria-hidden="true" />
                                </button>
                            </li>
                        </ul>

                        <section className="conta-risco" aria-labelledby="conta-risco-titulo">
                            <h3 id="conta-risco-titulo">
                                <DangerIcon aria-hidden="true" />
                                Zona de risco
                            </h3>

                            <p>Ações desta área são permanentes e não podem ser desfeitas.</p>

                            <button type="button" className="conta-risco-botao" onClick={aoExcluirConta}>
                                <TrashIcon aria-hidden="true" />
                                Excluir conta
                            </button>
                        </section>
                    </>
                )}

                {vista === 'dados' && (
                    <>
                        <h2 className="conta-titulo">
                            <button
                                type="button"
                                className="conta-voltar"
                                onClick={() => voltar('menu')}
                                aria-label="Voltar para Conta"
                            >
                                <VoltarIcon aria-hidden="true" />
                            </button>
                            Informações pessoais
                        </h2>

                        <p className="conta-nota">
                            Estes dados aparecem só para você. O perfil público mostra apenas
                            nome, @, foto, bio e os contadores.
                        </p>

                        <ul className="conta-dados">
                            {DADOS_PESSOAIS.map(({ campo, rotulo, valor }) => (
                                <li key={campo}>
                                    <button type="button" className="conta-dado" onClick={() => abrirEdicao(campo)}>
                                        <span className="conta-dado-textos">
                                            <small>{rotulo}</small>
                                            <strong>{valor(usuario) || '—'}</strong>
                                        </span>
                                        <EditIcon className="conta-dado-editar" aria-hidden="true" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {vista === 'editar' && (
                    <>
                        <h2 className="conta-titulo">
                            <button
                                type="button"
                                className="conta-voltar"
                                onClick={() => voltar('dados')}
                                aria-label="Voltar para Informações pessoais"
                            >
                                <VoltarIcon aria-hidden="true" />
                            </button>
                            {titulos.editar}
                        </h2>

                        <EditarCampoForm
                            ativo={aberto && vista === 'editar'}
                            campo={campoEditando}
                            usuario={usuario}
                            mostrarTitulo={false}
                            aoCancelar={() => voltar('dados')}
                            aoSalvar={async (corpo) => {
                                await aoSalvarCampo(corpo)
                                voltar('dados')
                            }}
                        />
                    </>
                )}
            </div>
        </Modal>
    )
}

export default ContaModal
