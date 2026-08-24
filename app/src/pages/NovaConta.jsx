import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { cadastrar } from '../services/auth.service'
import './NovaConta.css'
import logo from '../assets/icons/logo_text.svg'
import AuthInput from '../components/inputs/AuthInput'
import AuthButton from '../components/buttons/AuthButton'
import OptionSelect from '../components/inputs/OptionSelect'

function NovaConta() {
    const [nome, setNome] = useState('')
    const [apelido, setApelido] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [nascimento, setNascimento] = useState('')
    const [nacionalidade, setNacionalidade] = useState('')
    const navigate = useNavigate()

    async function handleCadastro() {
        const dados = await cadastrar({ nome, apelido, email, senha, nascimento, nacionalidade })
        if (dados.token) {
            localStorage.setItem('token', dados.token)
            localStorage.setItem('nome', dados.usuario.nome)
            navigate('/feed')
        }
    }

    return (
        <div className="sign-in-form">

            <img src={logo} alt="Logo Blabry" className="logo" />
            <div className="input-wrapper">
                <div className="input-line-wrapper">
                    <AuthInput label={"Nome"} placeholder={"Seu nome completo"} fieldType={"Text"} fieldId={"nome-input"} value={nome} onChange={(e) => setNome(e.target.value)} />
                    <AuthInput label={"Apelido"} placeholder={"@um_usuario123"} fieldType={"Text"} fieldId={"apelido-input"} value={apelido} onChange={(e) => setApelido(e.target.value)} />
                </div>

                <div className="input-line-wrapper">
                    <AuthInput label={"Email"} placeholder={"email@exemplo.com"} fieldType={"Email"} fieldId={"email-input"} value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="input-line-wrapper">
                    <AuthInput label={"Senha"} placeholder={"Nova Senha"} fieldType={"Password"} fieldId={"senha-input"} value={senha} onChange={(e) => setSenha(e.target.value)} />
                    <AuthInput label={"Confirmar senha"} placeholder={"Sua senha novamente"} fieldType={"Password"} fieldId={"confirmar-senha-input"} value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
                </div>

                <div className="input-line-wrapper">
                    <AuthInput label={"Data de Nascimento"} placeholder={""} fieldType={"Date"} fieldId={"nascimento-input"} value={nascimento} onChange={(e) => setNascimento(e.target.value)} />
                    <OptionSelect label={"Nacionalidade"} fieldId={"nacionalidade-input"} value={nacionalidade} onChange={(e) => setNacionalidade(e.target.value)} options={[
                        { value: 'BRA', label: 'Brasil (BR)' },
                        { value: 'EUA', label: 'Estados Unidos (EUA)' }
                    ]} />
                </div>
            </div>

            <AuthButton label={"Cadastrar"} onClick={handleCadastro} />
            <p className="already-user">Já tem conta? <Link className="already-user-link" to="/">Fazer login</Link></p>
        </div>
    )
}

export default NovaConta