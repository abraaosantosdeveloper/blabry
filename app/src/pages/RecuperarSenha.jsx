import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CampoCodigo, { TAMANHO_CODIGO } from '../components/verificacao/CampoCodigo'
import AuthInput from '../components/inputs/AuthInput'
import AuthButton from '../components/buttons/AuthButton'
import Toast from '../components/toasts/Toast'
import Logo from '../components/common/Logo'
import useToast from '../hooks/useToast'
import { solicitarCodigoSenha, trocarSenha, mensagemDeErro } from '../services/auth.service'
import './NovaConta.css'
import './VerificarEmail.css'

/** Mesma regra de força validada pelo back-end em SENHA_RE. */
const SENHA_RE = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Intervalo mínimo entre reenvios — espelha o limite do servidor. */
const ESPERA_REENVIO = 60

/**
 * Troca de senha por código enviado ao e-mail.
 *
 * Duas etapas: pedir o código e usá-lo junto com a nova senha. Elas são
 * separadas porque a segunda depende de algo que só existe fora da tela —
 * o e-mail que o usuário precisa abrir.
 */
function RecuperarSenha() {
    const navigate = useNavigate()
    const { state } = useLocation()
    const { toast, mostrarToast } = useToast()

    /* Se a página foi aberta a partir de uma sessão conhecida (o modal de
       conta manda o e-mail no state), o campo já vem preenchido. */
    const [email, setEmail] = useState(state?.email ?? '')
    const [etapa, setEtapa] = useState(0)
    const [codigo, setCodigo] = useState('')
    const [novaSenha, setNovaSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [espera, setEspera] = useState(0)

    useEffect(() => {
        if (espera <= 0) return
        const id = setInterval(() => setEspera((s) => s - 1), 1000)
        return () => clearInterval(id)
    }, [espera])

    /** Etapa 1 → pede o código. */
    async function pedirCodigo(evento) {
        evento?.preventDefault()
        if (enviando || espera > 0) return

        if (!EMAIL_RE.test(email.trim()))
            return mostrarToast('Digite um e-mail válido.')

        setEnviando(true)
        try {
            await solicitarCodigoSenha(email.trim())
            setEspera(ESPERA_REENVIO)
            setEtapa(1)
            /* Novamente "se houver uma conta": a API responde igual para
               e-mail cadastrado ou não, e a interface não pode contradizer
               isso sem revelar quem tem conta aqui. */
            mostrarToast('Se houver uma conta com esse e-mail, o código foi enviado.', 'sucesso')
        } catch (err) {
            mostrarToast(mensagemDeErro(err))
        } finally {
            setEnviando(false)
        }
    }

    /** Etapa 2 → confirma o código e grava a nova senha. */
    async function definirSenha(evento) {
        evento.preventDefault()
        if (enviando) return

        if (codigo.length < TAMANHO_CODIGO)
            return mostrarToast('Digite o código completo.')

        if (!SENHA_RE.test(novaSenha))
            return mostrarToast('A senha precisa de 8 caracteres, uma maiúscula e um caractere especial.')

        if (novaSenha !== confirmarSenha)
            return mostrarToast('As senhas não são iguais.')

        setEnviando(true)
        try {
            await trocarSenha({ email: email.trim(), codigo, novaSenha })
            mostrarToast('Senha alterada! Faça login com a nova senha.', 'sucesso')
            /* Não emitimos token aqui de propósito. Quem trocou a senha deve
               entrar com ela — é a confirmação prática de que a nova senha
               funciona, e evita que uma sessão siga aberta com a credencial
               antiga na cabeça do usuário. */
            setTimeout(() => navigate('/', { replace: true }), 1400)
        } catch (err) {
            setCodigo('')
            mostrarToast(mensagemDeErro(err))
            setEnviando(false)
        }
    }

    return (
        <div className="sign-in-form">
            <Toast {...toast} />

            <Logo className="logo" alt="Logo Blabry" />

            {etapa === 0 ? (
                <form className="verificar" onSubmit={pedirCodigo}>
                    <h1 className="verificar-titulo">Recuperar senha</h1>
                    <p className="verificar-subtitulo">
                        Informe o e-mail da conta. Enviaremos um código de {TAMANHO_CODIGO} dígitos.
                    </p>

                    <AuthInput
                        label="E-mail"
                        placeholder="email@exemplo.com"
                        fieldType="email"
                        fieldId="recuperar-email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <AuthButton type="submit" label="Enviar código" carregando={enviando} />
                </form>
            ) : (
                <form className="verificar" onSubmit={definirSenha}>
                    <h1 className="verificar-titulo">Nova senha</h1>
                    <p className="verificar-subtitulo">
                        Digite o código enviado para <strong>{email}</strong> e escolha a nova senha.
                    </p>

                    <CampoCodigo
                        valor={codigo}
                        aoMudar={setCodigo}
                        desabilitado={enviando}
                        id="recuperar-codigo"
                    />

                    <AuthInput
                        label="Nova senha"
                        placeholder="Nova senha"
                        fieldType="password"
                        fieldId="recuperar-senha"
                        autoComplete="new-password"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                    />

                    <AuthInput
                        label="Confirmar senha"
                        placeholder="Repita a senha"
                        fieldType="password"
                        fieldId="recuperar-senha-2"
                        autoComplete="new-password"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                    />

                    <p className="dica">Mínimo de 8 caracteres, uma maiúscula e um caractere especial.</p>

                    <AuthButton type="submit" label="Alterar senha" carregando={enviando} />

                    <p className="verificar-reenvio">
                        Não recebeu?{' '}
                        <button type="button" className="link-acao" onClick={pedirCodigo} disabled={espera > 0}>
                            {espera > 0 ? `Reenviar em ${espera}s` : 'Reenviar código'}
                        </button>
                    </p>
                </form>
            )}

            <p className="already-user">
                <Link className="already-user-link" to="/">Voltar ao login</Link>
            </p>
        </div>
    )
}

export default RecuperarSenha
