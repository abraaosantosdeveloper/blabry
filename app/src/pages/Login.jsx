import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login, mensagemDeErro } from '../services/auth.service'
import useToast from '../hooks/useToast'
import AuthButton from '../components/buttons/AuthButton'
import AuthInput from '../components/inputs/AuthInput'
import Toast from '../components/toasts/Toast'
import logo from '../assets/icons/logo_text.svg'
import './Login.css'

function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [carregando, setCarregando] = useState(false)
    const { toast, mostrarToast } = useToast()
    const navigate = useNavigate()

    async function handleLogin() {
        if (carregando) return
        if (!email || !senha) return mostrarToast('Preencha email e senha.')

        setCarregando(true)
        try {
            const dados = await login({ email: email.trim(), senha })
            localStorage.setItem('token', dados.token)
            localStorage.setItem('nome', dados.usuario.nome)
            navigate('/feed')
        } catch (err) {
            mostrarToast(mensagemDeErro(err))
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="login-form">
            <Toast {...toast} />

            <img src={logo} alt="Logo Blabry" className="logo" />

            <form className="input-wrapper" onSubmit={(e) => { e.preventDefault(); handleLogin() }}>
                <AuthInput label="Email ou @" placeholder="email@exemplo.com" fieldType="text" fieldId="email-input"
                    value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
                <AuthInput label="Senha" placeholder="Senha" fieldType="password" fieldId="password-input"
                    value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" />
                <Link className="forgot-psw" to="/recuperar-senha">Esqueci a senha</Link>

                <AuthButton label="Entrar" type="submit" carregando={carregando} />
            </form>

            <p className="already-user">Não tem conta? <Link className="already-user-link" to="/nova-conta">Cadastre-se</Link></p>
        </div>
    )
}

export default Login
