import React, { useContext, useEffect, useState } from 'react'
import '../../styles/IndividualProduct.css'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../../context/GeneralContext';
import { createTokenHeader, fetchApi } from '../../utils/fetchUtils';
import { Button, Container, Form, Image, Modal } from 'react-bootstrap';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ENV from '../../config/env';

const IndividualProduct = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const { password, fetchCartCount } = useContext(GeneralContext);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [mainImg, setMainImg] = useState('');
    const [sizes, setSizes] = useState([]);
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);

    const [qty, setQty] = useState(1);

    const [size, setSize] = useState('');

    const [success, setSuccess] = useState(true);
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [])

    async function fetchProduct() {
        const result = await fetchApi(`/product/${id}`).then(res => {
            if (res.ok) return res.json();
            else throw new Error();
        }).catch(e => { throw e });

        setName(result.title);
        setDescription(result.description);
        setMainImg(result.mainImg);
        setSizes(result.sizes);
        setPrice(result.price);
        setDiscount(result.discount);
    }

    function handleClose() {
        setModalShow(false);
    }

    async function handleAddToCart(e) {
        e.preventDefault();
        const body = { productId: id, qty }
        try {
            if (localStorage.getItem('token')) {
                const result = await fetchApi('/cart', 'POST', body, createTokenHeader()).then(res => {
                    if (!res.ok) setSuccess(false);
                    else {
                        setSuccess(true);
                        fetchCartCount();
                    }
                }).catch(e => console.log(e));
            } else {
                setSuccess(false);
            }
        } catch (e) {
            console.log(e);
            setSuccess(false);
        }
        setModalShow(true);
    }

    return (
        <Container fluid className="px-5 pt-5 d-flex flex-column justify-content-center ">
            <Button onClick={() => navigate(-1)} style={{ width: 'fit-content' }}>
                <ArrowBackIcon /> Back
            </Button>
            <div className='d-flex gap-4 justify-content-center pt-3'>
                <Image src={mainImg ? mainImg : ENV.PLACEHOLD_IMG} style={{ minWidth: '40%' }} />
                <div className='vr' />
                <Container fluid style={{ minWidth: '40%' }}>
                    <h1 className='fw-bold'>{name}</h1>
                    <h3 className='text-muted'>{description}</h3>
                    <h3 className='text-success'>Rp. {parseInt(price - (price * discount))}</h3>

                    <Form onSubmit={handleAddToCart}>
                        <Form.Group>
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type='number' min={1} className='w-25' value={qty} onChange={(e) => setQty(e.target.value)} required />
                        </Form.Group>
                        <Button variant="primary mt-3" type="submit">
                            Add to Cart
                        </Button>
                    </Form>
                </Container>
            </div>
            <Modal show={modalShow}>
                {success ?
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>Successful Operation</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Successfully added to cart. You can check it out on the cart page</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </> :
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>Failed to add to cart</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Item couldn't be added to cart. You have to be logged in. Products in cart can only be modified through the cart page</Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </>
                }
            </Modal>
        </Container>
    )
}

export default IndividualProduct