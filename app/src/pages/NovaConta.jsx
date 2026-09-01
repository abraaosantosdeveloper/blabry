import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cadastrar, mensagemDeErro } from '../services/auth.service'
import { enviarFoto } from '../services/users.service'
import useToast from '../hooks/useToast'
import usePaises from '../hooks/usePaises'
import AuthInput from '../components/inputs/AuthInput'
import AuthButton from '../components/buttons/AuthButton'
import OptionSelect from '../components/inputs/OptionSelect'
import Toast from '../components/toasts/Toast'
import PhotoCrop from '../components/upload/PhotoCrop'
import Logo from '../components/common/Logo'
import './NovaConta.css'

const ETAPAS = [
    { titulo: 'Vamos começar', subtitulo: 'Como devemos te chamar?' },
    { titulo: 'Dados de acesso', subtitulo: 'É com isso que você vai entrar.' },
    { titulo: 'Escolha seu @', subtitulo: 'É assim que as pessoas vão te encontrar.' },
    { titulo: 'Foto de perfil', subtitulo: 'Opcional — dá pra adicionar depois.' },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const SENHA_RE = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/
const ALIAS_RE = /^[a-z0-9_]{3,20}$/

const idade = (data) => {
    const hoje = new Date()
    const nasc = new Date(data)
    return (hoje - nasc) / 31557600000
}

const erro = (mensagem, ...campos) => ({ mensagem, campos })

function validar(etapa, f) {
    if (etapa === 0) {
        if (!f.name.trim()) return erro('Informe seu nome.', 'name')
        if (!f.sobrenome.trim()) return erro('Informe seu sobrenome.', 'sobrenome')
        if (!f.birthDate) return erro('Informe sua data de nascimento.', 'birthDate')
        if (idade(f.birthDate) < 13) return erro('Você precisa ter pelo menos 13 anos.', 'birthDate')
        if (!f.nationality) return erro('Selecione sua nacionalidade.', 'nationality')
    }
    if (etapa === 1) {
        if (!EMAIL_RE.test(f.email)) return erro('Digite um e-mail válido.', 'email')
        if (f.email !== f.confirmarEmail) return erro('Os e-mails não são iguais.', 'confirmarEmail')
        if (!SENHA_RE.test(f.senha)) return erro('A senha precisa de 8 caracteres, uma maiúscula e um caractere especial.', 'senha')
        if (f.senha !== f.confirmarSenha) return erro('As senhas não são iguais.', 'confirmarSenha')
    }
    if (etapa === 2) {
        if (!ALIAS_RE.test(f.alias))
            return erro('Use de 3 a 20 caracteres: letras minúsculas, números ou _', 'alias')
        /* O aceite é validado na última etapa antes do envio porque é ela que
           cria a conta. O back-end repete essa checagem: a interface é
           conveniência, a API é a fronteira real. */
        if (!f.acceptedPolicy)
            return erro('É preciso aceitar a política de privacidade para criar a conta.', 'acceptedPolicy')
    }
    return null
}

function NovaConta() {
    const [form, setForm] = useState({
        name: '', sobrenome: '', birthDate: '', nationality: '',
        email: '', confirmarEmail: '', senha: '', confirmarSenha: '', alias: '',
        // Começa falso e nunca é pré-marcado: consentimento pré-marcado não é
        // consentimento, é distração. O usuário precisa executar a ação.
        acceptedPolicy: false,
    })
    const [etapa, setEtapa] = useState(0)
    const [direcao, setDirecao] = useState('frente')
    const [invalidos, setInvalidos] = useState([])
    const [carregando, setCarregando] = useState(false)
    const [foto, setFoto] = useState(null)
    const { toast, mostrarToast } = useToast()
    const { paises, carregando: carregandoPaises, falhou: falhouPaises, recarregar } = usePaises()
    const navigate = useNavigate()

    const campo = (name) => ({
        value: form[name],
        onChange: (e) => {
            const valor = name === 'alias' ? e.target.value.toLowerCase() : e.target.value
            setForm((f) => ({ ...f, [name]: valor }))
            setInvalidos((atuais) => atuais.filter((c) => c !== name))
        },
        erro: invalidos.includes(name),
    })

    const ir = (destino) => {
        setDirecao(destino > etapa ? 'frente' : 'tras')
        setInvalidos([])
        setEtapa(destino)
    }

    async function avancar() {
        if (carregando) return
        const falha = validar(etapa, form)
        if (falha) {
            setInvalidos(falha.campos)
            return mostrarToast(falha.mensagem)
        }
        if (etapa < 2) return ir(etapa + 1)

        setCarregando(true)
        try {
            const dados = await cadastrar({
                name: `${form.name.trim()} ${form.sobrenome.trim()}`,
                alias: form.alias,
                email: form.email.trim(),
                password: form.senha,
                birthDate: form.birthDate,
                nationality: form.nationality,
                // Enviado como booleano de verdade. O serviço compara com
                // `=== true`, então a string "true" seria recusada.
                acceptedPolicy: form.acceptedPolicy,
            })
            /* O cadastro não devolve mais token: a conta nasce pendente de
               confirmação por e-mail. A etapa da foto fica para depois da
               verificação, porque enviar foto exige token.

               O e-mail vai pelo `state` da navegação, nunca na URL — lá ele
               ficaria no histórico do navegador. */
            mostrarToast('Conta criada! Enviamos um código para seu e-mail.', 'sucesso')
            return setTimeout(
                () => navigate('/verify-email', { state: { email: form.email.trim() } }),
                1200
            )
        } catch (err) {
            mostrarToast(mensagemDeErro(err))
        } finally {
            setCarregando(false)
        }
    }

    async function concluir() {
        if (!foto) return navigate('/feed')
        setCarregando(true)
        try {
            await enviarFoto(foto)
            navigate('/feed')
        } catch (err) {
            mostrarToast(mensagemDeErro(err))
            setCarregando(false)
        }
    }

    return (
        <div className="sign-in-form">
            <Toast {...toast} />

            <Logo className="logo" alt="Logo Blabry" />

            <div className="etapas-barra" aria-hidden="true">
                <span className="etapas-progresso" style={{ width: `${((etapa + 1) / ETAPAS.length) * 100}%` }} />
            </div>
            <p className="etapas-contador">Etapa {etapa + 1} de {ETAPAS.length}</p>

            <form className="etapa-container" onSubmit={(e) => { e.preventDefault(); etapa === 3 ? concluir() : avancar() }}>
                <div className={`etapa ${direcao}`} key={etapa}>
                    <h1 className="etapa-titulo">{ETAPAS[etapa].titulo}</h1>
                    <p className="etapa-subtitulo">{ETAPAS[etapa].subtitulo}</p>

                    <div className="input-wrapper">
                        {etapa === 0 && (
                            <>
                                <div className="input-line-wrapper">
                                    <AuthInput label="Nome" placeholder="Seu nome" fieldType="text" fieldId="nome-input" {...campo('name')} />
                                    <AuthInput label="Sobrenome" placeholder="Seu sobrenome" fieldType="text" fieldId="sobrenome-input" {...campo('sobrenome')} />
                                </div>
                                <div className="input-line-wrapper">
                                    <AuthInput label="Data de nascimento" fieldType="date" fieldId="nascimento-input" {...campo('birthDate')} />
                                    <OptionSelect label="Nacionalidade" fieldId="nacionalidade-input"
                                        options={paises} carregando={carregandoPaises} {...campo('nationality')} />
                                </div>
                                {falhouPaises && (
                                    <p className="dica dica-erro">
                                        Não foi possível carregar a lista de países.{' '}
                                        <button type="button" className="link-acao" onClick={recarregar}>Tentar de novo</button>
                                    </p>
                                )}
                            </>
                        )}

                        {etapa === 1 && (
                            <>
                                <AuthInput label="Email" placeholder="email@exemplo.com" fieldType="email" fieldId="email-input" autoComplete="email" {...campo('email')} />
                                <AuthInput label="Confirmar e-mail" placeholder="Repita o e-mail" fieldType="email" fieldId="confirmar-email-input" {...campo('confirmarEmail')} />
                                <div className="input-line-wrapper">
                                    <AuthInput label="Senha" placeholder="Nova senha" fieldType="password" fieldId="senha-input" autoComplete="new-password" {...campo('senha')} />
                                    <AuthInput label="Confirmar senha" placeholder="Repita a senha" fieldType="password" fieldId="confirmar-senha-input" autoComplete="new-password" {...campo('confirmarSenha')} />
                                </div>
                                <p className="dica">Mínimo de 8 caracteres, uma letra maiúscula e um caractere especial.</p>
                            </>
                        )}

                        {etapa === 2 && (
                            <>
                                <div className="alias-campo">
                                    <span className="alias-arroba">@</span>
                                    <AuthInput label="Seu @" placeholder="um_usuario123" fieldType="text" fieldId="apelido-input" maxLength={20} {...campo('alias')} />
                                </div>
                                <p className="dica">Letras minúsculas, números e _ — de 3 a 20 caracteres.</p>

                                {/* O label envolve o input: a área clicável passa a
                                    incluir o text, o que importa no celular, onde
                                    acertar um quadrado de 16px é difícil. */}
                                <label className={`aceite ${invalidos.includes('acceptedPolicy') ? 'aceite-erro' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={form.acceptedPolicy}
                                        onChange={(e) => {
                                            const marcado = e.target.checked
                                            setForm((f) => ({ ...f, acceptedPolicy: marcado }))
                                            setInvalidos((atuais) => atuais.filter((c) => c !== 'acceptedPolicy'))
                                        }}
                                    />
                                    <span>
                                        Li e aceito a{' '}
                                        {/* target="_blank" para não destruir o formulário
                                            já preenchido ao abrir a política. */}
                                        <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer">
                                            política de privacidade
                                        </Link>.
                                    </span>
                                </label>
                            </>
                        )}

                        {etapa === 3 && <PhotoCrop onCortar={setFoto} />}
                    </div>
                </div>

                <div className="etapa-acoes">
                    {etapa > 0 && etapa < 3 && (
                        <AuthButton label="Voltar" variante="secundario" compacto onClick={() => ir(etapa - 1)} />
                    )}
                    {etapa === 3 && (
                        <AuthButton label="Pular" variante="secundario" compacto onClick={() => navigate('/feed')} />
                    )}
                    <AuthButton
                        type="submit"
                        compacto
                        carregando={carregando}
                        label={etapa === 2 ? 'Criar conta' : etapa === 3 ? 'Concluir' : 'Continuar'}
                    />
                </div>
            </form>

            <p className="already-user">Já tem conta? <Link className="already-user-link" to="/">Fazer login</Link></p>
        </div>
    )
}

export default NovaConta
