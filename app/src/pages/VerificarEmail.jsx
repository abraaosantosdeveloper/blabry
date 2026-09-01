import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CampoCodigo, { TAMANHO_CODIGO } from '../components/verificacao/CampoCodigo'
import AuthButton from '../components/buttons/AuthButton'
import Toast from '../components/toasts/Toast'
import Logo from '../components/common/Logo'
import useToast from '../hooks/useToast'
import { confirmarEmail, reenviarCodigoCadastro, mensagemDeErro } from '../services/auth.service'
/* Reaproveita a casca das telas de autenticação (.sign-in-form, .logo,
   .already-user, .link-acao), que já vive no CSS do cadastro. Duplicar
   essas regras aqui criaria duas definições para o mesmo visual. */
import './NovaConta.css'
import './VerificarEmail.css'

/** Intervalo mínimo entre reenvios — espelha INTERVALO_REENVIO_SEGUNDOS no back. */
const ESPERA_REENVIO = 60

/**
 * Confirmação do e-mail por código.
 *
 * Chega aqui quem acabou de se cadastrar e quem tentou entrar com uma conta
 * ainda pendente (o login responde 403 nesse caso). O e-mail vem pelo state
 * da navegação — não pela URL: colocá-lo na barra de endereço o deixaria no
 * histórico do navegador e nos registros de qualquer proxy no caminho.
 */
function VerificarEmail() {
    const navigate = useNavigate()
    const { state } = useLocation()
    const { toast, mostrarToast } = useToast()

    const email = state?.email ?? ''
    const [code, setCode] = useState('')
    const [erro, setErro] = useState(false)
    const [enviando, setEnviando] = useState(false)
    /* Começa no intervalo cheio: o código do cadastro acabou de ser enviado,
       então pedir outro imediatamente receberia 429 do servidor. Mostrar o
       contador é melhor do que deixar o usuário descobrir pelo erro. */
    const [espera, setEspera] = useState(ESPERA_REENVIO)

    /* Contagem regressiva do botão de reenvio. O intervalo é limpo na
       função de limpeza do efeito — sem isso ele continuaria disparando
       depois da página sair da tela. */
    useEffect(() => {
        if (espera <= 0) return
        const id = setInterval(() => setEspera((s) => s - 1), 1000)
        return () => clearInterval(id)
    }, [espera])

    /* Sem e-mail no state não há o que verificar: é sinal de que a página
       foi aberta direto pela URL. Voltar ao login é mais honesto do que
       mostrar um formulário que falharia no envio. */
    useEffect(() => {
        if (!email) navigate('/', { replace: true })
    }, [email, navigate])

    async function confirmar(evento) {
        evento.preventDefault()
        if (code.length < TAMANHO_CODIGO || enviando) return

        setEnviando(true)
        setErro(false)
        try {
            const dados = await confirmarEmail({ email, code })

            // A confirmação já devolve o token: o usuário entra direto.
            localStorage.setItem('token', dados.token)
            localStorage.setItem('name', dados.user.name)
            localStorage.setItem('alias', dados.user.alias ?? '')

            mostrarToast('E-mail confirmado! Bem-vindo ao Blabry.', 'sucesso')
            setTimeout(() => navigate('/feed', { replace: true }), 900)
        } catch (err) {
            setErro(true)
            setCode('')
            mostrarToast(mensagemDeErro(err))
            setEnviando(false)
        }
    }

    async function reenviar() {
        if (espera > 0) return
        try {
            await reenviarCodigoCadastro(email)
            setEspera(ESPERA_REENVIO)
            /* "Se houver uma conta pendente" e não "enviamos": a API responde
               igual para e-mail com e sem conta, de propósito. Prometer o
               envio aqui contradiria essa escolha e transformaria a tela em
               um verificador de cadastro. */
            mostrarToast('Se houver uma conta pendente, um novo código foi enviado.', 'sucesso')
        } catch (err) {
            mostrarToast(mensagemDeErro(err))
        }
    }

    return (
        <div className="sign-in-form">
            <Toast {...toast} />

            <Logo className="logo" alt="Logo Blabry" />

            <form className="verificar" onSubmit={confirmar}>
                <h1 className="verificar-titulo">Confirme seu e-mail</h1>
                <p className="verificar-subtitulo">
                    Enviamos um código de {TAMANHO_CODIGO} dígitos para <strong>{email}</strong>.
                    Ele vale por 15 minutos.
                </p>

                <CampoCodigo
                    valor={code}
                    aoMudar={(v) => { setCode(v); setErro(false) }}
                    erro={erro}
                    desabilitado={enviando}
                />

                <AuthButton
                    type="submit"
                    label="Confirmar"
                    carregando={enviando}
                    // Só habilita com o código completo: enviar 3 dígitos
                    // gastaria uma das 5 tentativas do usuário por nada.
                    disabled={code.length < TAMANHO_CODIGO}
                />

                <p className="verificar-reenvio">
                    Não recebeu?{' '}
                    <button type="button" className="link-acao" onClick={reenviar} disabled={espera > 0}>
                        {espera > 0 ? `Reenviar em ${espera}s` : 'Reenviar código'}
                    </button>
                </p>

                <p className="verificar-dica">
                    Confira a caixa de spam. O remetente é o Blabry.
                </p>
            </form>

            <p className="already-user">
                <Link className="already-user-link" to="/">Voltar ao login</Link>
            </p>
        </div>
    )
}

export default VerificarEmail
