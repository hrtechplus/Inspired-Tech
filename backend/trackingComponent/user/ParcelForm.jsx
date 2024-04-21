import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Center,
  Flex,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Spacer,
  Link,
} from "@chakra-ui/react";
import { LuPackageSearch } from "react-icons/lu";
import { FaCircle } from "react-icons/fa";
import "./css/style.css";
import { GrClearOption } from "react-icons/gr";
import logo from "../admin/Component/img/assest/logo.png";
import NavigationBar from "./Component/NavigationBar";
import "./css/style.css";
const ParcelForm = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [parcelData, setParcelData] = useState(null);
  const [error, setError] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    if (parcelData && parcelData.user) {
      return; // Exit if user details are already fetched
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/parcels/${trackingNumber}`
        );
        setParcelData(response.data.parcel);
        setError(null); // Clear any previous errors

        // Set background image URL after fetching parcel data
        setBackgroundImage(await getRandomImageUrl());

        // Retrieve user details concurrently
        const userResponse = await axios.get(
          `http://localhost:5000/parcels/${trackingNumber}`
        );
        setParcelData((prevData) => ({
          ...prevData,
          user: userResponse.data.user, // Attach user details to parcel data
        }));
      } catch (error) {
        setError(
          "Error fetching parcel data. Please check the tracking number."
        );
        console.error("Error fetching parcel data:", error);
      }
    };

    if (trackingNumber) {
      fetchData(); // Fetch data only if tracking number is provided
    }
  }, [trackingNumber, parcelData]);

  const getRandomImageUrl = async () => {
    try {
      // Fetch a specific image URL from Unsplash
      const response = await axios.get(
        "https://source.unsplash.com/1600x900/?parcel"
      );
      return response.request.responseURL;
    } catch (error) {
      console.error("Error fetching random image:", error);
      return ""; // Return empty string in case of error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset parcelData and error state to trigger useEffect
    setParcelData(null);
    setError(null);
  };

  const handleInputChange = (e) => {
    setTrackingNumber(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleNewSearch = () => {
    setTrackingNumber(""); // Clear the input field
  };

  return (
    <>
      <NavigationBar path={"/login"} title={"login"} />
      <Center
        h="95vh"
        className="parcelForm-background"
        bgSize="cover"
        bgPosition="center"
      >
        <Box
          boxShadow={"lg"}
          rounded={"lg"}
          w="100%"
          maxW="800px"
          p="4"
          borderRadius="lg"
          bgColor="rgba(255, 255, 255, 0.8)"
          textAlign="center"
        >
          <VStack spacing={4}>
            <Text fontSize="3xl" fontWeight="bold">
              Track Your Parcel
            </Text>
            <Text fontSize="lg" color="gray.600">
              Enter the tracking number below to check the status of your
              parcel.
            </Text>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Flex>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter Tracking Number"
                    value={trackingNumber}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                  />
                </FormControl>
                <Button
                  colorScheme={"blue.500"}
                  type="submit"
                  className="btn"
                  ml={2}
                >
                  <LuPackageSearch />
                  <Spacer mr={2} />
                  Track Package
                </Button>
              </Flex>
            </form>
            {error && <Text color="red">{error}</Text>}
            {parcelData && (
              <Box>
                <Text fontSize="lg" fontWeight="bold">
                  Parcel Details:
                </Text>
                <Text>Parcel ID: {parcelData.parcelId}</Text>
                <Flex alignItems={"center"} justifyContent={"center"} gap={2}>
                  <Text>Status: {parcelData.status}</Text>
                  <FaCircle
                    color={
                      parcelData.status === "Delivered"
                        ? "green"
                        : parcelData.status === "In Transit"
                        ? "yellow"
                        : parcelData.status === "Pending"
                        ? "red"
                        : "gray"
                    }
                  />
                </Flex>
                {parcelData.user && (
                  <Box mt={4}>
                    <Text fontSize="lg" fontWeight="bold">
                      User Details:
                    </Text>
                    <Text>Username: {parcelData.user.username}</Text>
                    <Text>Email: {parcelData.user.email}</Text>
                  </Box>
                )}
                <Button
                  mt={4}
                  colorScheme={"red.500"}
                  className="btn"
                  onClick={handleNewSearch}
                >
                  <GrClearOption /> <Spacer mr={2} />
                  Clear
                </Button>
              </Box>
            )}
          </VStack>
        </Box>
      </Center>
    </>
  );
};

export default ParcelForm;
