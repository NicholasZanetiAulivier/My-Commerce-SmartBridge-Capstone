import React, { useEffect, useState } from 'react'
import '../styles/Products.css'
import { createTokenHeader, fetchApi, imgString } from '../utils/fetchUtils';
import { Button, Container, Form, Image, Modal } from 'react-bootstrap';
import ENV from '../config/env';
import { useNavigate } from 'react-router-dom';

const ProductsAdmin = () => {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [currId, setCurrId] = useState();
    const [currImg, setCurrImg] = useState();
    const [currImgFile, setCurrImgFile] = useState();
    const [currTitle, setCurrTitle] = useState();
    const [currDescription, setCurrDescription] = useState();
    const [currCategory, setCurrCategory] = useState();
    const [currPrice, setCurrPrice] = useState();
    const [currDiscount, setCurrDiscount] = useState();

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        const body = await fetchApi('/product').then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error();
            }
        }).catch(e => { throw e });
        setProducts(body.products);
    }

    async function handleDeleteItem(id) {
        const body = await fetchApi(`/product/${id}`, 'DELETE', null, createTokenHeader()).then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error();
            }
        }).catch(e => { throw e; });
        fetchData();
    }

    function handleShowUpdateModal(product) {
        setCurrImg(imgString(product.id));
        setCurrImgFile(null);
        setCurrTitle(product.title);
        setCurrDescription(product.description);
        setCurrCategory(product.category);
        setCurrPrice(product.price);
        setCurrDiscount(product.discount);
        setCurrId(product.id);
        setShowModal(true);
    }

    async function handleUpdate(e) {
        e.preventDefault();

        if (currTitle.length < 5) {
            alert("Nama Produk harus lebih dari 5 karakter");
            return;
        }
        const formData = new FormData();
        if (currImgFile)
            formData.append('img', currImg);
        formData.append('title', currTitle);
        formData.append('description', currDescription);
        formData.append('category', currCategory);
        formData.append('price', new Number(currPrice));
        formData.append('discount', new Number(currDiscount));

        await fetchApi('/product/' + currId, 'PUT', formData, createTokenHeader()).then(async res => {
            if (res.ok) {
                setShowModal(false);
            } else {
                console.log(await res.json());
                setShowModal(false);
            }
        })
        navigate(0);
    }

    async function handleUpload(e) {
        if (e.target.files[0].type !== 'image/png' && e.target.files[0].type !== 'image/jpeg') {
            setCurrImg(null);
            setCurrImgFile(null);
            return;
        }
        setCurrImg(e.target.files[0]);
        setCurrImgFile(URL.createObjectURL(e.target.files[0]));
    }

    return (
        <Container fluid >
            <div className='h3'>All Products</div>
            <Container fluid className='d-flex flex-column gap-3 w-100 ' >
                <table className='table table-striped align-content-center'>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products ? products.map((product) => {
                            return (
                                <tr itemScope="row">
                                    <th><Image src={product.mainImg ? imgString(product.id) : ENV.PLACEHOLD_IMG} className='w-auto object-fit-cover ratio-1x1' style={{ height: '15vh' }} /></th>
                                    <th>{product.title}</th>
                                    <th>{product.description.slice(0, 30) + '....'}</th>
                                    <th>{product.category}</th>
                                    <th>Rp. {parseInt(product.price)}</th>
                                    <th>{product.discount * 100}%</th>
                                    <th>
                                        <Button variant='outline-info' onClick={() => handleShowUpdateModal(product)}>Edit</Button>
                                        <Button variant='danger' onClick={() => handleDeleteItem(product.id)}>Delete</Button>
                                    </th>
                                </tr>);
                        }) : null}
                    </tbody>
                </table>
            </Container>
            <Modal show={showModal} size='lg' className='p-5'>
                <Form onSubmit={handleUpdate} className='m-3'>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Image</Form.Label>
                        <Form.Control type="file" placeholder="Enter Image" onChange={handleUpload} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Preview</Form.Label>
                        <Image src={currImg ? (currImgFile == null ? currImg : currImgFile) : ENV.PLACEHOLD_IMG} style={{ width: '100%' }} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Name" onChange={(e) => setCurrTitle(e.target.value)} value={currTitle} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Description</Form.Label>
                        <Form.Control className='d-block' type="text" placeholder="Enter Description" onChange={(e) => setCurrDescription(e.target.value)} value={currDescription} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Category</Form.Label>
                        <Form.Control type="text" placeholder="Enter Category" onChange={(e) => setCurrCategory(e.target.value)} value={currCategory} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Price</Form.Label>
                        <Form.Control type="number" placeholder="Enter Price" onChange={(e) => setCurrPrice(Number(e.target.value))} value={currPrice} min={0} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Discount</Form.Label>
                        <Form.Control type="number" placeholder="Enter Discount" onChange={(e) => setCurrDiscount(Number(e.target.value))} value={currDiscount} min={0} max={1} step={0.01} required />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    <Button className='mx-2' variant='danger' onClick={() => setShowModal(false)}>Close</Button>
                </Form >
            </Modal>
        </Container>
    )
}

export default ProductsAdmin