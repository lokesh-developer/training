"use client"
import { Button, Field, HStack, Input, Stack, Text } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useState } from "react"
import { NavLink, useNavigate } from "react-router"

export const LoginBox = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [err, setErr] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:5000/login', data)
      localStorage.setItem('user', JSON.stringify(response.data))
      setLoading(false)
      navigate('/feed')
    } catch (error) {
      console.log(error)
      setErr(JSON.parse(error.request.response))
      setLoading(false)
    }
    
  })

  console.log(err)

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="4" align="flex-start" maxW="sm">
        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email</Field.Label>
          <Input {...register("email")} w={'350px'} />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password}>
          <Field.Label>Password</Field.Label>
          <Input {...register("password")} />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>
        {err.error && <Text color="red.500" alignSelf="center">{err.error}</Text>}

        <Button type="submit" loading={loading} alignSelf="center">Login</Button>
        <HStack alignSelf="center">
          <Text alignSelf="center">Not have an account?</Text>
          <NavLink to="/signup"><Button variant="link" alignSelf="center">Sign up</Button></NavLink>
        </HStack>
      </Stack>
    </form>
  )
}
