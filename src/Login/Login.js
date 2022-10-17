import { Button } from "@chakra-ui/button";
import { Container, Stack } from "@chakra-ui/layout";

import { useToast } from "@chakra-ui/toast";
import { Form, Formik } from "formik";
import { InputControl } from "formik-chakra-ui";
import React from "react";
import { useCookies } from "react-cookie";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";

import { login } from "../networkCalls";
import { actionTypes, useStateValue } from "../store";

const Login = () => {
  const [, setCookie] = useCookies(["jwt"]);
  const [{ token }, dispatch] = useStateValue();
  console.log(token);
  const navigate = useNavigate();
  const { isError, error, isLoading, mutateAsync } = useMutation(
    "login",
    login,
    {
      onSuccess: (data) => {
        dispatch({ type: actionTypes.SET_TOKEN, value: data.token });
        setCookie("jwt", data.token);
        navigate("/");
      },
    }
  );
  const toast = useToast();

  if (isError) {
    toast({ title: error.message, status: "error" });
    alert("Please Enter Valid Id and Password");
  }

  return (
    <Container
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Stack width="300px" p="4" boxShadow="xl" borderRadius="xl">
        <Formik
          initialValues={{ email: "hello1@gmail.com", password: "123456@" }}
          onSubmit={async (values) => {
            try {
              await mutateAsync({
                email: values.email,
                password: values.password,
              });
            } catch (error) {
              console.log(error);
            }
          }}
        >
          <Form>
            <InputControl
              label="Email:"
              name="email"
              inputProps={{
                type: "email",
                placeholder: "Enter Email...",
                focusBorderColor: "blue.400",
              }}
            />
            <InputControl
              label="Password:"
              name="password"
              inputProps={{
                type: "password",
                placeholder: "Enter Password...",
                focusBorderColor: "blue.400",
              }}
            />
            <Button
              isLoading={isLoading}
              colorScheme="blue"
              mt="4"
              type="submit"
            >
              Login
            </Button>
          </Form>
        </Formik>
      </Stack>
    </Container>
  );
};

export default Login;
