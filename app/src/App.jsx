import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/NovaConta';
import Chat from './pages/Chat';
import Feed from './pages/Feed';
import MeuPerfil from './pages/MeuPerfil';
import Perfil from './pages/Perfil';
import ProtectedRoute from './components/protectRoutes/ProtectedRoutes';

function App() {
  return (
    <BrowserRouter basename="/blabry">
      <Routes>
        <Route path='/' element={<Login />} />
        {/* Descomentar depois de implementar */}
        {/* <Route path='/recuperar-senha' element={<Login />} /> */}
        <Route path='/nova-conta' element={<Cadastro />} />
        <Route path='/feed' element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        } />
        <Route path='/chat/:id' element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } />
        <Route path='/perfil/me' element={
          <ProtectedRoute>
            <MeuPerfil />
          </ProtectedRoute>
        } />
        <Route path='/perfil/:alias' element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App