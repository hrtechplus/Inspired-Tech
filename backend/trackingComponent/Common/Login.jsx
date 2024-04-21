import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link,
} from "@chakra-ui/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log("Email:", email, "Password:", password);
  };

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={"gray.50"}>
      <Box
        rounded={"lg"}
        bg={"white"}
        boxShadow={"lg"}
        p={8}
        maxW={"md"}
        w={"full"}
      >
        <Box textAlign={"center"}>
          <Heading>Login</Heading>
        </Box>
        <Box my={4} textAlign={"left"}>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>Email Address</FormLabel>
              <Input
                type={"email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={"Enter your email"}
              />
            </FormControl>
            <FormControl mt={6}>
              <FormLabel>Password</FormLabel>
              <Input
                type={"password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={"Enter your password"}
              />
            </FormControl>
            <Button
              width={"full"}
              mt={4}
              type={"submit"}
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
            >
              Sign In
            </Button>
          </form>
          <Text mt={2} textAlign={"center"}>
            Don't have an account?{" "}
            <Link color={"blue.400"} href={"#"}>
              Sign Up
            </Link>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default LoginForm;
