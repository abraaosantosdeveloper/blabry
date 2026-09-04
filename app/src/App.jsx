import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/NovaConta';
import Chat from './pages/Chat';
import Feed from './pages/Feed';
import MeuPerfil from './pages/MeuPerfil';
import Perfil from './pages/Perfil';
import Post from './pages/Post';
import EmConstrucao from './pages/EmConstrucao';
import PoliticaPrivacidade from './pages/PoliticaPrivacidade';
import VerificarEmail from './pages/VerificarEmail';
import RecuperarSenha from './pages/RecuperarSenha';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/protectRoutes/ProtectedRoutes';

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path='/' element={<Login />} />
        {/* Públicas por necessidade: quem precisa confirmar o e-mail ou
            recuperar a senha, por definição, ainda não tem sessão. */}
        <Route path='/verify-email' element={<VerificarEmail />} />
        <Route path='/reset-password' element={<RecuperarSenha />} />
        <Route path='/signup' element={<Cadastro />} />

        {/* Pública de propósito: o cadastro exige aceitar a política, e
            exigir login para ler o que se está aceitando seria um ciclo
            impossível de fechar. Fica fora do ProtectedRoute. */}
        <Route path='/privacy-policy' element={<PoliticaPrivacidade />} />

        {/* Rotas autenticadas — compartilham a casca da aplicação */}
        <Route element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route path='/feed' element={<Feed />} />
          <Route path='/chats' element={<EmConstrucao />} />
          <Route path='/chat/:id' element={<Chat />} />
          {/* Endereço próprio da publicação: compartilhável e recarregável.
              Fica dentro da casca autenticada porque a API exige token. */}
          <Route path='/post/:id' element={<Post />} />
          <Route path='/profile/me' element={<MeuPerfil />} />
          <Route path='/profile/:alias' element={<Perfil />} />
          <Route path='*' element={<EmConstrucao />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
