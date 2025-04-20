import { useEffect, useState } from 'react'
import { Button, Center, Theme } from "@chakra-ui/react"
import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react"
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ColorModeProvider } from './components/ui/color-mode'
import { Login } from './pages/Login';
import Signup from './pages/Signup';
import FeedPage from './pages/FeedPage';
import { useUser } from './hooks/user';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './store/userSlice';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {},
    },
  },
})

// const system = createSystem(defaultConfig, config)

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setUser(localStorage.getItem('user')))
  }, [])

  return (
    <Theme appearance="light">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="*" element={<HomeNav />} />
        </Routes>
      </Router>
    </Theme>
  );
}

function HomeNav() {
  const navigate = useNavigate();
  const userSelector = useSelector((state) => state.user.user)

  useEffect(() => {
    if(userSelector !== null) {
      navigate('/feed')
    }
  }, [])
  return (
    <Center h="100vh" w="100vw">
      <Button variant={'ghost'} mr={4} onClick={() => navigate('/login')}>Login</Button>
      <Button variant={'solid'} onClick={() => navigate('/signup')}>Signup</Button>
    </Center>
  );
}

export default App
