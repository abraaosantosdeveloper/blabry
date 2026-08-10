import { useState } from "react"
import AuthButton from "../components/buttons/AuthButton"
import AuthInput from "../components/inputs/AuthInput"
import logo from '../assets/icons/logo_text.svg'
import { Link } from 'react-router-dom'
import './Login.css'

function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    return (
        <div className="login-form">

            <img src={logo} alt="Logo Blabry" className="logo" />
            <div className="input-wrapper">
                <AuthInput label={"Email"} placeholder={"email@exemplo.com"} fieldType={"Email"} fieldId={"email-input"} value={email} onChange={(e) => setEmail(e.target.value)} />
                <AuthInput label={"Senha"} placeholder={"Senha"} fieldType={"Password"} fieldId={"password-input"} value={senha} onChange={(e) => setSenha(e.target.value)} />
                <Link className="forgot-psw" to="/recuperar-senha">Esqueci a senha</Link>
            </div>

            <AuthButton label={"Entrar"} />
            <p className="already-user">Não tem conta <Link className="already-user-link" to="/novaconta">Cadastre-se</Link></p>
        </div>
    )
}

export default Login