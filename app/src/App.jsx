import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/NovaConta';
import Chat from './pages/Chat';
import Feed from './pages/Feed';
import MeuPerfil from './pages/MeuPerfil';
import Perfil from './pages/Perfil';
import EmConstrucao from './pages/EmConstrucao';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/protectRoutes/ProtectedRoutes';

function App() {
  return (
    <BrowserRouter basename="/blabry">
      <Routes>
        <Route path='/' element={<Login />} />
        {/* Descomentar depois de implementar */}
        {/* <Route path='/recuperar-senha' element={<Login />} /> */}
        <Route path='/nova-conta' element={<Cadastro />} />

        {/* Rotas autenticadas — compartilham a casca da aplicação */}
        <Route element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route path='/feed' element={<Feed />} />
          <Route path='/conversas' element={<EmConstrucao />} />
          <Route path='/chat/:id' element={<Chat />} />
          <Route path='/perfil/me' element={<MeuPerfil />} />
          <Route path='/perfil/:alias' element={<Perfil />} />
          <Route path='*' element={<EmConstrucao />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
