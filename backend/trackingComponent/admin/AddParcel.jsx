import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";

const AdminPanel = () => {
  const [parcels, setParcels] = useState([]);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [newParcelData, setNewParcelData] = useState({
    parcelId: "",
    status: "Pending",
    handOverDate: "",
    deliveryCost: "",
  });

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    try {
      const response = await axios.get("/admin/parcels");
      setParcels(response.data);
    } catch (error) {
      console.error("Error fetching parcels:", error);
    }
  };

  const handleDeleteParcel = async (trackingNumber) => {
    try {
      await axios.delete(`/admin/parcels/${trackingNumber}`);
      fetchParcels();
    } catch (error) {
      console.error("Error deleting parcel:", error);
    }
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
    }
  };

  const handleInputChangeNewParcel = (e) => {
    const { name, value } = e.target;
    setNewParcelData({ ...newParcelData, [name]: value });
  };

  const handleAddParcel = async () => {
    try {
      await axios.post("http://localhost:5000/admin/parcels", newParcelData);
      fetchParcels();
      setNewParcelData({
        parcelId: "",
        status: "Pending",
        handOverDate: "",
        deliveryCost: "",
      });
    } catch (error) {
      console.error("Error adding new parcel:", error);
    }
  };

  return (
    <Box p={8}>
      <Stack spacing={4} mb={8}>
        <FormControl>
          <FormLabel>Search Parcel by Tracking Number</FormLabel>
          <Input
            type="text"
            placeholder="Enter tracking number"
            value={trackingNumber}
            onChange={handleInputChange}
          />
        </FormControl>
        <Button colorScheme="teal" onClick={handleSearch}>
          Search
        </Button>
      </Stack>

      <Table variant="simple">
        <Tbody>
          {parcels.map((parcel) => (
            <Tr key={parcel._id}>
              <Td>{parcel.parcelId}</Td>
              <Td>{parcel.status}</Td>
              <Td>{parcel.handOverDate}</Td>
              <Td>{parcel.deliveryCost}</Td>
              <Td>{parcel.trackingNumber}</Td>
              <Td>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteParcel(parcel.trackingNumber)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Box mt={8}>
        <Text fontSize="xl" mb={4}>
          Add New Parcel
        </Text>
        <FormControl>
          <FormLabel>Parcel ID</FormLabel>
          <Input
            type="text"
            placeholder="Enter parcel ID"
            name="parcelId"
            value={newParcelData.parcelId}
            onChange={handleInputChangeNewParcel}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Status</FormLabel>
          <Input
            type="text"
            placeholder="Enter status"
            name="status"
            value={newParcelData.status}
            onChange={handleInputChangeNewParcel}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Handover Date</FormLabel>
          <Input
            type="date"
            name="handOverDate"
            value={newParcelData.handOverDate}
            onChange={handleInputChangeNewParcel}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Delivery Cost</FormLabel>
          <Input
            type="number"
            placeholder="Enter delivery cost"
            name="deliveryCost"
            value={newParcelData.deliveryCost}
            onChange={handleInputChangeNewParcel}
          />
        </FormControl>
        <Button mt={4} colorScheme="teal" onClick={handleAddParcel}>
          Add Parcel
        </Button>
      </Box>
    </Box>
  );
};

export default AdminPanel;
