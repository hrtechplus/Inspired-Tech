import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../css/style.css";
import SideNavigation from "./Component/SideNavigation";
import {
  Badge,
  Grid,
  GridItem,
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Collapse,
  Progress,
} from "@chakra-ui/react";
import {
  SearchIcon,
  RepeatIcon,
  DeleteIcon,
  EditIcon,
  AddIcon,
} from "@chakra-ui/icons";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  const [parcels, setParcels] = useState([]);
  const [userP, setUserP] = useState([]);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editParcel, setEditParcel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deleteParcelId, setDeleteParcelId] = useState(null);
  const [showFooter, setShowFooter] = useState(true);
  const [user, setUser] = useState(""); // user for the Add parcel
  const toast = useToast();

  // Inside the AdminPanel component

  const [newParcel, setNewParcel] = useState({
    parcelId: "",
    status: "Pending",
    handOverDate: "",
    deliveryCost: "",
    trackingNumber: "",
    user: "",
  });

  AOS.init();

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/parcels");
      setParcels(response.data.parcels);
      setUserP(response.data.user);
    } catch (error) {
      console.error("Error fetching parcels:", error);
    }
  };

  const handleDeleteParcel = async (trackingNumber) => {
    try {
      await axios.delete(
        `http://localhost:5000/admin/parcels/${trackingNumber}`
      );
      fetchParcels();

      toast({
        title: "Parcel Deleted",
        description: "The parcel has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting parcel:", error);

      toast({
        title: "Error",
        description: "Failed to delete parcel. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRefresh = () => {
    fetchParcels();
  };

  const handleInputChange = (e) => {
    setTrackingNumber(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/admin/parcels/${trackingNumber}`
      );
      setParcels([response.data]);
    } catch (error) {
      console.error("Error searching parcel:", error);
      toast({
        title: "Error",
        description: "Failed to search for parcel. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditParcel = (parcel) => {
    setEditMode(true);
    setEditParcel(parcel);
    setIsModalOpen(true);
  };
  const handleUsers = async () => {
    setIsAddModalOpen(true);
    try {
      const response = await axios.get("http://localhost:5000/api/user/:email");
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchUserByEmail = async (email) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/${email}`
      );
      return response.data; // Assuming the user data is returned as JSON
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error; // Throw the error for handling in the calling code
    }
  };

  const handleAddParcelInputChange = async (e, key) => {
    const value = e.target.value;
    if (key === "user") {
      try {
        setUser(value); // Update user state in real-time
        const userData = await fetchUserByEmail(value);
        setNewParcel({
          ...newParcel,
          [key]: userData._id,
        });
      } catch (error) {
        console.error("Error setting user:", error);
        // Handle error (e.g., display error message)
      }
    } else {
      setNewParcel({
        ...newParcel,
        [key]: value,
      });
    }
  };

  const handleAddParcel = async () => {
    try {
      await axios.post("http://localhost:5000/admin/parcels", newParcel);
      fetchParcels();
      setIsAddModalOpen(false);
      toast.success("Parcel Added");
      toast({
        title: "Parcel Added",
        description: "The parcel has been successfully added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding parcel:", error);
      toast({
        title: "Error",
        description: "Failed to add parcel. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setNewParcel({});
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/admin/parcels/${editParcel.trackingNumber}`,
        editParcel
      );

      setEditMode(false);
      fetchParcels();
      setIsModalOpen(false);
      toast({
        title: "Parcel Updated",
        description: "The parcel has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating parcel:", error);
    }
  };

  const handleEditInputChange = (e, key) => {
    setEditParcel({
      ...editParcel,
      [key]: e.target.value,
    });
  };

  const handleDeleteConfirmation = (trackingNumber) => {
    setIsDeleteAlertOpen(true);
    setDeleteParcelId(trackingNumber);
  };

  const handleDeleteCancel = () => {
    setIsDeleteAlertOpen(false);
    setDeleteParcelId(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteParcelId) {
      await handleDeleteParcel(deleteParcelId);
      setIsDeleteAlertOpen(false);
    }
  };

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
        <Center
          h="100%"
          data-aos="fade-zoom-in"
          data-aos-easing="ease-in-back"
          data-aos-delay="100"
          data-aos-offset="0"
        >
          <Box
            p={8}
            boxShadow="2xl"
            borderRadius="xl"
            m={4}
            width="100%"
            className="adminPanel"
            overflow="hidden"
          >
            <Stack spacing={4} mb={4} direction="row" align="center">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={handleInputChange}
                />
              </FormControl>
              <IconButton
                colorScheme="gray.900"
                className="btn search-btn"
                icon={<SearchIcon />}
                onClick={handleSearch}
              ></IconButton>

              <IconButton
                colorScheme="gray.900"
                className="btn refresh-btn"
                aria-label="Refresh parcels"
                icon={<RepeatIcon />}
                onClick={handleRefresh}
              />
              <Button
                colorScheme="blue.500"
                className="btn add-btn"
                leftIcon={<AddIcon />}
                onClick={handleUsers}
              >
                Add
              </Button>
            </Stack>

            <Box height="calc(100% - 120px)" overflowY="auto">
              <Table variant="simple">
                <Thead>
                  <Tr boxShadow="md">
                    <Th>Parcel ID</Th>
                    <Th>Status</Th>
                    <Th>Hand Over Date</Th>
                    <Th>Delivery Fee </Th>
                    <Th>Tracking Number</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>

                <Tbody className="table_body" boxSize="sm">
                  {parcels.map((parcel, userP) => (
                    <Tr key={parcel._id} boxShadow="xs" rounded="md">
                      <Td>
                        {" "}
                        <Badge>{parcel.parcelId}</Badge>
                      </Td>

                      <Td>
                        {parcel.status}{" "}
                        <Progress
                          value={
                            parcel.status === "Delivered"
                              ? 100
                              : parcel.status === "In Transit"
                              ? 50
                              : parcel.status === "Pending"
                              ? 10
                              : 0
                          }
                          size="xs"
                          colorScheme={
                            parcel.status === "Delivered"
                              ? "green"
                              : parcel.status === "In Transit"
                              ? "orange"
                              : parcel.status === "Pending"
                              ? "yellow"
                              : 0
                          }
                        />
                      </Td>
                      <Td fontSize={"sm"}>
                        {
                          new Date(parcel.handOverDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </Td>
                      <Td>{parcel.deliveryCost}</Td>
                      <Td>{parcel.trackingNumber}</Td>
                      <Td>
                        <IconButton
                          className=" btn edit_btn"
                          aria-label="Edit parcel"
                          icon={<EditIcon color={"#525CEB"} />}
                          onClick={() => handleEditParcel(parcel)}
                        />
                        <IconButton
                          className="btn delete-btn"
                          aria-label="Delete parcel"
                          icon={<DeleteIcon color={"#B31312"} />}
                          onClick={() =>
                            handleDeleteConfirmation(parcel.trackingNumber)
                          }
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            <Collapse in={showFooter} animateOpacity>
              <Box mt={4} p={4} bg="gray.100" borderRadius="md">
                <Text fontWeight="bold" mb={2}>
                  Developer Details:
                </Text>
                <Text>Name: Hasindu Rangika</Text>
                <Link to="https://www.hasindu.me/">
                  <Text fontSize={"xs"} color="blue.500">
                    www.hasindu.me
                  </Text>
                </Link>
              </Box>
            </Collapse>
          </Box>
          {/* Edit Parcel Modal */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Parcel</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl mb={4}>
                  <FormLabel>Parcel ID</FormLabel>
                  <Input
                    type="text"
                    value={editParcel?.parcelId}
                    onChange={(e) => handleEditInputChange(e, "parcelId")}
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Status</FormLabel>
                  <Input
                    type="text"
                    value={editParcel?.status}
                    onChange={(e) => handleEditInputChange(e, "status")}
                    placeholder="In Transit, Delivered, Pending"
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Hand Over Date</FormLabel>
                  <Input
                    type="date"
                    value={editParcel?.handOverDate}
                    onChange={(e) => handleEditInputChange(e, "handOverDate")}
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Delivery Cost</FormLabel>
                  <Input
                    type="number"
                    value={editParcel?.deliveryCost}
                    onChange={(e) => handleEditInputChange(e, "deliveryCost")}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue.500"
                  className="btn add-btn"
                  onClick={handleSaveEdit}
                >
                  Save
                </Button>
                <Button
                  colorScheme="gray"
                  ml={3}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/* Add parcel model */}

          <Modal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add Parcel</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl mb={4}>
                  <FormLabel>Parcel ID</FormLabel>
                  <Input
                    type="text"
                    value={newParcel.parcelId}
                    onChange={(e) => handleAddParcelInputChange(e, "parcelId")}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Hand Over Date</FormLabel>
                  <Input
                    type="date"
                    value={newParcel.handOverDate}
                    onChange={(e) =>
                      handleAddParcelInputChange(e, "handOverDate")
                    }
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Delivery Cost</FormLabel>
                  <Input
                    type="number"
                    value={newParcel.deliveryCost}
                    onChange={(e) =>
                      handleAddParcelInputChange(e, "deliveryCost")
                    }
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Tracking Number</FormLabel>
                  <Input
                    type="text"
                    value={newParcel.trackingNumber}
                    onChange={(e) =>
                      handleAddParcelInputChange(e, "trackingNumber")
                    }
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>
                    User<Text fontSize={"xs"}>{newParcel.user}</Text>
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter user email"
                    value={user}
                    onChange={(e) => handleAddParcelInputChange(e, "user")}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  className=" add-btn"
                  colorScheme="blue.500"
                  onClick={handleAddParcel}
                >
                  Add
                </Button>
                <Button
                  colorScheme="gray"
                  ml={3}
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/* Delete Parcel Confirmation Dialog */}
          <AlertDialog
            isOpen={isDeleteAlertOpen}
            leastDestructiveRef={undefined}
            onClose={handleDeleteCancel}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader>Delete Parcel</AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure you want to delete this parcel? This action
                  cannot be undone.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button colorScheme="red" onClick={handleDeleteConfirm}>
                    Delete
                  </Button>
                  <Button onClick={handleDeleteCancel}>Cancel</Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Center>
      </GridItem>
    </Grid>
  );
};

export default AdminPanel;
