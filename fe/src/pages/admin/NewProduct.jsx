import React, { useEffect, useState } from 'react'
import '../../styles/NewProducts.css'
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form, Image } from 'react-bootstrap';
import ENV from '../../config/env';
import { createTokenHeader, fetchApi } from '../../utils/fetchUtils';

const NewProduct = () => {

  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [mainImg, setMainImg] = useState();
  const [mainImgFile, setMainImgFile] = useState();
  const [category, setCategory] = useState();
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);

  const navigate = useNavigate();

  async function handleNewProduct(e) {
    e.preventDefault();
    if (title.length < 5) {
      alert("Nama Produk harus lebih dari 5 karakter");
      return;
    }
    const formData = new FormData();
    formData.append('img', mainImgFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', new Number(price));
    formData.append('discount', new Number(discount));

    await fetchApi('/product', 'POST', formData, createTokenHeader()).then(async res => {
      if (res.ok) {
        navigate('/');
      } else {
        console.log(await res.json());
        throw new Error();
      }
    })
  }

  async function handleUpload(e) {
    if (e.target.files[0].type !== 'image/png' && e.target.files[0].type !== 'image/jpeg') {
      setMainImg(null);
      setMainImgFile(null);
      return;
    }
    setMainImgFile(e.target.files[0]);
    setMainImg(URL.createObjectURL(e.target.files[0]));
  }


  return (
    <Container style={{ width: '30%' }} className='py-2'>
      <Form onSubmit={handleNewProduct}>
        <Form.Group className="mb-3">
          <Form.Label>Product Image</Form.Label>
          <Form.Control type="file" placeholder="Enter Image" onChange={handleUpload} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Preview</Form.Label>
          <Image src={mainImg ? mainImg : ENV.PLACEHOLD_IMG} style={{ width: '100%' }} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Product Name</Form.Label>
          <Form.Control type="text" placeholder="Enter Name" onChange={(e) => setTitle(e.target.value)} value={title} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Product Description</Form.Label>
          <Form.Control className='d-block' type="text" placeholder="Enter Description" onChange={(e) => setDescription(e.target.value)} value={description} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Product Category</Form.Label>
          <Form.Control type="text" placeholder="Enter Category" onChange={(e) => setCategory(e.target.value)} value={category} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Product Price</Form.Label>
          <Form.Control type="number" placeholder="Enter Price" onChange={(e) => setPrice(Number(e.target.value))} value={price} min={0} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Product Discount</Form.Label>
          <Form.Control type="number" placeholder="Enter Discount" onChange={(e) => setDiscount(Number(e.target.value))} value={discount} min={0} max={1} step={0.01} required />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form >
    </Container>
  )
}

export default NewProduct