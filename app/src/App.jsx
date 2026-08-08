import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/NovaConta';
import Chat from './pages/Chat';
import Feed from './pages/Feed';
import MeuPerfil from './pages/MeuPerfil';
import Perfil from './pages/Perfil';

function App() {
  return (
    <BrowserRouter basename="/blabry">
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/novaconta' element={<Cadastro />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/chat/:id' element={<Chat />} />
        <Route path='/perfil/me' element={<MeuPerfil />} />
        <Route path='/perfil/:alias' element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App