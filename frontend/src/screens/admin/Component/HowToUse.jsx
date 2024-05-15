import React from "react";
import SideNavigation from "./SideNavigation";
import "./css/style.css";
import { Grid, GridItem, Box, Text, Center, Button } from "@chakra-ui/react";
import AOS from "aos";
import "aos/dist/aos.css";
import toast, { Toaster } from "react-hot-toast";
const HowToUse = () => {
  const notify = () => toast("Here is your toast.");

  const App = () => {
    return (
      <div>
        <button onClick={notify}>Make me a toast</button>
        <Toaster />
      </div>
    );
  };
  AOS.init();
  return (
    <Grid
      templateAreas={`"nav main"`}
      gridTemplateRows={"1fr"}
      gridTemplateColumns={"250px 1fr"}
      h="100vh"
      gap="1"
    >
      <GridItem pl="2" area={"nav"}>
        <SideNavigation />
      </GridItem>

      <GridItem pl="2" area={"main"} className="grid_second">
        <Center>
          <Box
            data-aos="fade-up"
            data-aos-duration="500"
            p={8}
            boxShadow="2xl"
            borderRadius="xl"
            m={4}
            width="100%"
            className="panel"
          >
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              How to Use Admin Panel
            </Text>
            <Text mb={2}>
              1. To search for a specific parcel, enter the tracking number in
              the search bar and click the search button.
            </Text>
            <Text mb={2}>
              2. To refresh the list of parcels, click the refresh button.
            </Text>
            <Text mb={2}>
              3. To add a new parcel, click the "Add" button and fill in the
              details in the popup modal.
            </Text>
            <Text mb={2}>
              4. To edit a parcel, click the edit icon next to the parcel you
              want to edit and modify the details in the popup modal.
            </Text>
            <Text mb={2}>
              5. To delete a parcel, click the delete icon next to the parcel
              you want to delete and confirm the action in the confirmation
              dialog.
            </Text>
            <Text mb={2}>
              6. The developer details are displayed in the footer section of
              the Admin Panel.
            </Text>
          </Box>
          <Button onClick={notify}>Ok</Button>
        </Center>
      </GridItem>
    </Grid>
  );
};

export default HowToUse;
