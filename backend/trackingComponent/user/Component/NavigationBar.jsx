import React from "react";
import { Box, Flex, Text, Button, Link } from "@chakra-ui/react";
import { LuPackageSearch } from "react-icons/lu";

export default function NavigationBar({ title, path }) {
  return (
    <Box
      sticky="top"
      w="100%"
      className="navbar-background"
      p="4"
      color="white"
      textAlign="center"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb="0"
    >
      <Flex gap={2}>
        <LuPackageSearch w={4} /> <Text> InspiredTech Tracking</Text>
      </Flex>
      <Box>
        <Link href="#" mr="4">
          About
        </Link>
        <Button>
          <Link href={path} mr="">
            {title}
          </Link>
        </Button>
      </Box>
    </Box>
  );
}

// Path: frontend/src/trackingComponent/user/Conponent/NavigationBar.jsx
