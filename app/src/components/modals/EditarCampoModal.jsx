import { useEffect, useState } from 'react'
import Modal from './Modal'
import usePaises from '../../hooks/usePaises'
import './EditarCampoModal.css'

const BIO_MAX = 280

/** Configuração de cada campo editável do perfil. */
const CAMPOS = {
    name: {
        titulo: 'Editar nome',
        rotulo: 'Nome completo',
        tipo: 'text',
        placeholder: 'Seu nome',
        maxLength: 100,
        autoComplete: 'name',
    },
    bio: {
        titulo: 'Editar bio',
        rotulo: 'Bio',
        tipo: 'textarea',
        placeholder: 'Conte um pouco sobre você',
        maxLength: BIO_MAX,
        ajuda: 'Aparece no seu perfil para qualquer pessoa.',
    },
    email: {
        titulo: 'Alterar e-mail',
        rotulo: 'Novo e-mail',
        tipo: 'email',
        placeholder: 'email@exemplo.com',
        autoComplete: 'email',
        exigeSenha: true,
        ajuda: 'O e-mail é usado para recuperar a conta, por isso pedimos sua senha.',
    },
    birthDate: {
        titulo: 'Editar data de nascimento',
        rotulo: 'Data de nascimento',
        tipo: 'date',
    },
    nationality: {
        titulo: 'Editar nacionalidade',
        rotulo: 'Nacionalidade',
        tipo: 'pais',
    },
}

/** Data de calendário no formato do input date, sem conversão de fuso. */
const paraInputDate = (valor) => (valor ? String(valor).slice(0, 10) : '')

/**
 * Edição de um campo do perfil por vez.
 * `aoSalvar` recebe o objeto pronto para o PATCH e deve lançar em caso de erro.
 */
function EditarCampoModal({ aberto, campo, usuario, aoFechar, aoSalvar }) {
    const config = CAMPOS[campo]

    const [valor, setValor] = useState('')
    const [currentPassword, setSenhaAtual] = useState('')
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState(null)

    const { paises, carregando: carregandoPaises } = usePaises()

    useEffect(() => {
        if (!aberto || !config) return
        const atual = usuario?.[campo] ?? ''
        setValor(campo === 'birthDate' ? paraInputDate(atual) : atual)
        setSenhaAtual('')
        setErro(null)
        setSalvando(false)
    }, [aberto, campo, config, usuario])

    if (!config) return null

    const original = campo === 'birthDate'
        ? paraInputDate(usuario?.birthDate)
        : (usuario?.[campo] ?? '')

    const mudou = String(valor).trim() !== String(original ?? '').trim()
    const excedeu = campo === 'bio' && valor.length > BIO_MAX
    const faltaSenha = config.exigeSenha && mudou && !currentPassword
    const podeSalvar = mudou && !excedeu && !faltaSenha && !salvando

    async function salvar(e) {
        e.preventDefault()
        if (!podeSalvar) return

        setSalvando(true)
        setErro(null)
        try {
            const corpo = { [campo]: valor }
            if (config.exigeSenha) corpo.currentPassword = currentPassword
            await aoSalvar(corpo)
        } catch (err) {
            // A mensagem da API é mais específica que o mapa genérico de status.
            setErro(err?.message || 'Não foi possível salvar. Tente novamente.')
            setSalvando(false)
        }
    }

    return (
        <Modal aberto={aberto} aoFechar={aoFechar} rotulo={config.titulo}>
            <form className="editar" onSubmit={salvar}>
                <h2 className="editar-titulo">{config.titulo}</h2>

                <label className="editar-campo">
                    <span>{config.rotulo}</span>

                    {config.tipo === 'textarea' && (
                        <textarea
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            placeholder={config.placeholder}
                            maxLength={config.maxLength + 20}
                            rows={4}
                            autoFocus
                        />
                    )}

                    {config.tipo === 'pais' && (
                        <select
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            disabled={carregandoPaises}
                            autoFocus
                        >
                            <option value="">{carregandoPaises ? 'Carregando...' : 'Selecione...'}</option>
                            {paises.map((p) => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                        </select>
                    )}

                    {!['textarea', 'pais'].includes(config.tipo) && (
                        <input
                            type={config.tipo}
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            placeholder={config.placeholder}
                            maxLength={config.maxLength}
                            autoComplete={config.autoComplete}
                            autoFocus
                        />
                    )}
                </label>

                {campo === 'bio' && (
                    <p className={`editar-contador ${excedeu ? 'excedido' : ''}`}>
                        {valor.length} / {BIO_MAX}
                    </p>
                )}

                {config.exigeSenha && mudou && (
                    <label className="editar-campo">
                        <span>Senha atual</span>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setSenhaAtual(e.target.value)}
                            placeholder="Sua senha"
                            autoComplete="current-password"
                        />
                    </label>
                )}

                {config.ajuda && <p className="editar-ajuda">{config.ajuda}</p>}

                {erro && <p className="editar-erro" role="alert">{erro}</p>}

                <div className="editar-acoes">
                    <button type="button" className="editar-botao neutro" onClick={aoFechar}>
                        Cancelar
                    </button>
                    <button type="submit" className="editar-botao" disabled={!podeSalvar}>
                        {salvando ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default EditarCampoModal
