import React, { useState } from "react";
import NavigationBar from "../user/Component/NavigationBar";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Link,
  Center,
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import axios from "axios";
import "./Component/css/style.css";
import { useNavigate } from "react-router";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/parcel/login", {
        username,
        password,
      });

      // Assuming the server returns a success message upon successful login
      toast.success(response.data.message);
      console.log("Login successful:", response.data);

      sessionStorage.setItem("accessToken", response.data.accessToken);
      navigate("/edit");

      // added protected routes
    } catch (error) {
      // Display error toast if login fails
      toast.error("Login failed. Please check your credentials.");
      console.error("Error logging in:", error);
    }
  };

  return (
    <>
      <NavigationBar path={"/register"} title={"SignUp"} />

      <Center
        h="100vh"
        bgImage={`url(${getRandomBackgroundImageUrl()})`}
        bgSize="cover"
        bgPosition="center"
      >
        <Box w="400px" p="20px" bg="gray.100" borderRadius="lg" boxShadow="lg">
          <VStack spacing={4} align="center">
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  size="sm" // Reduced input field size
                />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="sm" // Reduced input field size
                />
              </FormControl>
              <Button
                type="submit"
                mt={2}
                colorScheme="blue.500"
                className="btn"
                size="sm" // Reduced button size
              >
                Login
              </Button>
            </form>
            <Link href="#" color="blue.500" fontSize="sm">
              Forgot Password?
            </Link>
          </VStack>
        </Box>
      </Center>
    </>
  );
};

// Function to get a random background image URL
const getRandomBackgroundImageUrl = () => {
  // Replace with your logic to fetch random background image URL
  return "https://source.unsplash.com/1600x900/?nature";
};

export default LoginForm;
