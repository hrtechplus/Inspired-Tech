import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.address = address ? '' : 'Address is required.';
    tempErrors.city = city ? '' : 'City is required.';
    tempErrors.postalCode = postalCode.match(/^[0-9]{5}$/) ? '' : 'Postal Code is invalid.';
    tempErrors.country = country ? '' : 'Country is required.';
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === '');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(saveShippingAddress({ address, city, postalCode, country }));
      navigate('/payment');
    }
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            isInvalid={!!errors.address}
          />
          <Form.Control.Feedback type='invalid'>
            {errors.address}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='my-2' controlId='city'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter city'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            isInvalid={!!errors.city}
          />
          <Form.Control.Feedback type='invalid'>
            {errors.city}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='my-2' controlId='postalCode'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter postal code'
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            isInvalid={!!errors.postalCode}
          />
          <Form.Control.Feedback type='invalid'>
            {errors.postalCode}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='my-2' controlId='country'>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter country'
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            isInvalid={!!errors.country}
          />
          <Form.Control.Feedback type='invalid'>
            {errors.country}
          </Form.Control.Feedback>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;