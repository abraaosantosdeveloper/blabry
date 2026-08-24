import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/auth.service'
import AuthButton from "../components/buttons/AuthButton"
import AuthInput from "../components/inputs/AuthInput"
import Toast from "../components/toasts/Toast"
import logo from '../assets/icons/logo_text.svg'
import './Login.css'

function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [toast, setToast] = useState({ mensagem: '', tipo: '', visible: false })
    const navigate = useNavigate()

    async function handleLogin() {
        const dados = await login({ email, senha })
        if (dados.token) {
            localStorage.setItem('token', dados.token)
            localStorage.setItem('nome', dados.usuario.nome)
            setToast({ mensagem: 'Login realizado!', tipo: 'sucesso', visible: true })
            setTimeout(() => navigate('/feed'), 1500)
        }
        else {
            setToast({ mensagem: 'Erro no login...', tipo: 'erro', visible: true })

        }

    }

    return (
        <div className="login-form">

            <Toast mensagem={toast.mensagem} tipo={toast.tipo} visible={toast.visible} />

            <img src={logo} alt="Logo Blabry" className="logo" />
            <div className="input-wrapper">
                <AuthInput label={"Email"} placeholder={"email@exemplo.com"} fieldType={"email"} fieldId={"email-input"} value={email} onChange={(e) => setEmail(e.target.value)} />
                <AuthInput label={"Senha"} placeholder={"Senha"} fieldType={"password"} fieldId={"password-input"} value={senha} onChange={(e) => setSenha(e.target.value)} />
                <Link className="forgot-psw" to="/recuperar-senha">Esqueci a senha</Link>
            </div>

            <AuthButton label={"Entrar"} onClick={handleLogin} />
            <p className="already-user">Não tem conta? <Link className="already-user-link" to="/nova-conta">Cadastre-se</Link></p>
        </div>
    )
}

export default Login