import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from './context/AuthContext'
import Login from "./pages/Login"
import Register from "./pages/Register"
import ChatPage from "./pages/ChatPage"

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/chat" element={<ChatPage/>} />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;