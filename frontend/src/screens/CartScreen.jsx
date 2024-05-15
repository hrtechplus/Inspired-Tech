import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const [userEmail, setUserEmail] = useState('');
  const [pdfData, setPdfData] = useState(null);
  const [pdfGenerated, setPdfGenerated] = useState(false);

  const { totalDiscount, finalSubtotal } = useMemo(() => {
    let discount = 0;
    let subtotal = 0;
    cartItems.forEach((item) => {
      const itemTotal = item.qty * item.price;
      subtotal += itemTotal;
      if (item.qty >= 3) {
        discount += itemTotal * 0.1; // 10% discount
      }
    });
    return {
      totalDiscount: discount,
      finalSubtotal: subtotal,
    };
  }, [cartItems]);

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  const calculateDiscountedPrice = (qty, price) => {
    if (qty >= 3) {
      return (price - price * 0.1).toFixed(2); // 10% discount
    }
    return price.toFixed(2);
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Shopping Cart Summary', 10, 10);
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 20);
  
    const tableColumn = ['Item', 'Unit Price', 'Quantity', 'Total', 'Discount', 'TotalAfterDiscount'];
    const tableRows = cartItems.map(item => {
      const itemSubtotal = item.qty * item.price;
      const discount = item.qty >= 3 ? itemSubtotal * 0.1 : 0;
      const total = itemSubtotal - discount;
      return [
        item.name,
        `$${item.price.toFixed(2)}`,
        item.qty,
        `$${itemSubtotal.toFixed(2)}`,
        `$${discount.toFixed(2)}`,
        `$${total.toFixed(2)}`
      ];
    });
  
    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 25 }
    });
  
    const finalTotal = cartItems.reduce((acc, item) => acc + (item.qty * item.price) - (item.qty >= 3 ? (item.qty * item.price * 0.1) : 0), 0);
    doc.text(`Subtotal Before Discount: $${finalSubtotal.toFixed(2)}`, 10, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Discount: -$${totalDiscount.toFixed(2)}`, 10, doc.lastAutoTable.finalY + 20);
    doc.text(`Subtotal: $${finalTotal.toFixed(2)}`, 10, doc.lastAutoTable.finalY + 30);
  
    // Trigger the download of the PDF
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'cart-summary.pdf';
    link.click();
    URL.revokeObjectURL(pdfUrl);
  
    // Convert the Blob to a Base64 string for email
    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);
    reader.onloadend = () => {
      const base64data = reader.result;
      setPdfData(base64data.split(',')[1]); // Store the Base64 string in state
      setPdfGenerated(true); // Indicate that the PDF has been generated
    };
  };

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

  const sendPDFEmail = async () => {

    if (!validateEmail(userEmail)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!pdfData) return; // Ensure the PDF data is available
  
    const emailDetails = {
      to: userEmail,
      subject: 'Your Cart Summary',
      text: 'Please find attached your cart summary.',
      pdfBase64: pdfData // Use the PDF data
    };
  
    // Send the request to your backend
    try {
      const response = await fetch('http://localhost:3000/api/email/send-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailDetails)
      });
  
      if (response.ok) {
        console.log('Email sent successfully');
        alert('Email sent successfully');
      } else {
        console.error('Failed to send email');
        alert('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email', error);
      alert('Error sending email');
    }
  

  
  };

  return (
    <Row>
      <Col md={7}>
        <h1 className='text-primary' style={{ marginBottom: '20px' }}>
          Shopping Cart
        </h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as='select'
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                  {item.qty >= 3 && ( // Only display if eligible for discount
                    <Col md={2} className="text-success">
                      <strong>Discounted Price:</strong> ${calculateDiscountedPrice(item.qty, item.price)}
                    </Col>
                  )}
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={5}>
        <Card className='rounded-lg'>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3 className='text-primary'>
                Subtotal Calculation
              </h3>
              <ListGroup variant='flush'>
                {cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row>
                      <Col>{item.name}</Col>
                      <Col>
                        {item.qty} x ${item.price} = ${item.qty * item.price}
                        {item.qty >= 3 && (
                          <>
                            <br />
                            <span className="text-success">
                              Discount (10%): -${(item.qty * item.price * 0.1).toFixed(2)}
                            </span>
                          </>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <strong>Subtotal Before Discount: </strong> ${finalSubtotal.toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Total Discount: </strong> -${totalDiscount.toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Final Subtotal: </strong> ${(finalSubtotal - totalDiscount).toFixed(2)}
                </ListGroup.Item>
              </ListGroup>
            </ListGroup.Item>
            <ListGroup.Item>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type='button'
                className='btn-block btn-primary'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
                style={{
                  backgroundColor: '#387ADF',
                  outline: 'none',
                  border: 'none',
                }}
              >
                Proceed To Checkout
              </Button>
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type='button'
                className='btn-block'
                variant='secondary'
                onClick={generatePDF}
                style={{
                  backgroundColor: '#387ADF',
                  color: 'white',
                  outline: 'none',
                  border: 'none',
                }}
              >
                {pdfGenerated ? 'Regenerate Quotation' : 'Get Quotation'}
              </Button>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  style={{ marginRight: '10px' }}
                />
                <button
                  type='button'
                  onClick={sendPDFEmail}
                  disabled={!pdfGenerated || !userEmail}
                >
                  Send Quotation to Email
                </button>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;