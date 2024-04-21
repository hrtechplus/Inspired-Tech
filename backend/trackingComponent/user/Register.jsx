import React, { useState } from "react";
import axios from "axios";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Text,
  Alert,
  AlertIcon,
  Image,
  Link,
} from "@chakra-ui/react";
import "./css/style.css";
import NavigationBar from "./Component/NavigationBar";
import { RxAvatar } from "react-icons/rx";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckEmail = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/checkEmail",
        {
          email: formData.email,
        }
      );
      if (response.data.message === "Email is already registered") {
        setEmailError(response.data.message);
      } else {
        setEmailError("");
      }
    } catch (error) {
      console.error("Error checking email:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if form fields are empty
    if (
      formData.username === "" ||
      formData.email === "" ||
      formData.password === ""
    ) {
      // Handle empty fields
      toast.error("Form fields cannot be empty");
      console.error("Error: Form fields cannot be empty");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/register", formData);
      toast.success("User registered successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <>
      <NavigationBar path={"/login"} title={"Log In"} />
      <div
        style={{
          background: "url(https://source.unsplash.com/random)",
          backgroundSize: "cover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <VStack
          spacing={2} // Reduced spacing between form fields
          align="flex-start"
          w="50%"
          h="400px" // Fixed height for 1:1 aspect ratio
          bg="white"
          p={6} // Reduced padding
          borderRadius="xl"
          boxShadow="lg"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 2, display: "flex", justifyContent: "center" }}>
            <Image
              src="https://source.unsplash.com/random"
              alt="Random"
              boxSize="200px" // Adjusted image size
              borderRadius="md"
              style={{ height: "100%", width: "200px", filter: ` blur("8px")` }} // Adjusted image size
            ></Image>
          </div>
          <div style={{ flex: 3 }}>
            <FormControl mt={4}>
              <RxAvatar color="gray" boxSize="md" />
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                borderRadius={"md"}
                placeholder="Enter your username"
                size="sm" // Reduced size
              />
            </FormControl>
            <FormControl mt={4}>
              <MdOutlineEmail color="gray" />
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleCheckEmail}
                borderRadius={"md"}
                placeholder="Enter your email"
                size="sm" // Reduced size
              />
              {emailError && (
                <Alert status="error" variant="subtle">
                  <AlertIcon />
                  {emailError}
                </Alert>
              )}
            </FormControl>
            <FormControl mt={4}>
              <RiLockPasswordLine color="gray" />
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                borderRadius={"md"}
                placeholder="Enter your password"
                size="sm" // Reduced size
              />
            </FormControl>

            <Button
              colorScheme="blue.500"
              onClick={handleSubmit}
              className="btn"
              size="sm" // Reduced size
              mt={4}
            >
              Register
            </Button>

            <Text mt={2}>
              Already registered?{" "}
              <Link href="/login" color="blue.600">
                Login
              </Link>
            </Text>
          </div>
        </VStack>
      </div>
    </>
  );
};

export default RegisterForm;
