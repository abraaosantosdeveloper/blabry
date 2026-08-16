import { useState } from "react"
import AuthButton from "../components/buttons/AuthButton"
import AuthInput from "../components/inputs/AuthInput"
import Toast from "../components/toasts/Toast"
import logo from '../assets/icons/logo_text.svg'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    // const [toast, setToast] = useState({ mensagem: 'Login realizado!', tipo: 'sucesso', visible: true })
    const navigate = useNavigate()

    async function handleLogin() {
        const resposta = await fetch('https://pretty-generosity-production-b8c6.up.railway.app/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, senha: senha })
        })

        const dados = await resposta.json()
        console.log(dados);

        if (dados.token) {
            localStorage.setItem('token', dados.token)
            localStorage.setItem('nome', dados.usuario.nome)
            navigate('/feed')
        }
    }

    return (
        <div className="login-form">

            {/* <Toast mensagem={toast.mensagem} tipo={toast.tipo} visible={toast.visible} /> */}

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