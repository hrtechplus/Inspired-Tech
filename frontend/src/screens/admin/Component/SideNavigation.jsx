import React from "react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Text,
  Button,
  Spacer,
  ListItem,
  ListIcon,
  List,
  Image,
  Divider,
} from "@chakra-ui/react";
import logo from "../Component/img/assest/logo.png";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./css/style.css";
const Sidebar = () => {
  return (
    <Box h="100%" w="250px" color="black" p={4} overflow="hidden">
      <Flex direction="column" h="100%">
        <Box>
          <Image src={logo} alt="logo" mb={8} />

          <Text fontSize="2xl" mb={4}>
            Menu
          </Text>
          <Box>
            <List spacing={3}>
              <ListItem>
                <Link to="/edit"> Dashboard</Link>
              </ListItem>
              <Divider></Divider>
              <ListItem>
                {" "}
                <Link to="/howto">How to Use</Link>
              </ListItem>
              <Divider></Divider>
              <ListItem>About</ListItem>

              {/* You can also use custom icons from react-icons */}
            </List>
            {/* Add more links here */}
          </Box>
        </Box>
        <Spacer />
        <Box mt="auto">
          <Button
            className="btn logout-btn"
            colorScheme="red"
            variant="outline"
            onClick={() => {
              sessionStorage.removeItem("accessToken");

              window.location.reload();
              toast.success("Logged out sucessfully !");
            }}
          >
            Logout
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default Sidebar;
