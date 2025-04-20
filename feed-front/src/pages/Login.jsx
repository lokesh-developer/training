import { Center } from "@chakra-ui/react"
import { LoginBox } from "../components/web/LoginBox"
import { useUser } from "../hooks/user";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const Login = () => {
  const { user, checkUser } = useUser();
  const navigate = useNavigate();
  // Dummy feed data
  useEffect(() => {
    checkUser();
    
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/feed');
      console.log(user)
    }
  }, [user])

    return (
        <Center h="100vh">
            <LoginBox />
        </Center>
    )
}