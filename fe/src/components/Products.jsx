import React, { useEffect, useState } from 'react'
import '../styles/Products.css'
import { useNavigate } from 'react-router-dom';
import { fetchApi, imgString } from '../utils/fetchUtils';
import { Card, CardGroup, Container } from 'react-bootstrap';
import ENV from '../config/env';

const Products = ({ category }) => {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

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
        setProducts(body.products.filter((p) => p.category === category || !category));
    }

    return (
        <Container fluid style={{ minHeight: "50vh", width: "100%" }}>
            {
                category ? null :
                    <h2 className='mx-auto d-block text-center fw-bold'>Categories</h2>
            }
            <Container fluid className='d-flex gap-3 w-100 ' >
                {products ? products.map((product) => {
                    return (
                        <Card onClick={() => navigate(`/product/${product.id}`)} key={product.id} className='col-2 border-0 p-2' style={{ height: 'fit-content' }}>
                            <Card.Img src={product.mainImg ? imgString(product.id) : ENV.PLACEHOLD_IMG} className='object-fit-cover ratio-1x1' style={{ height: '30vh' }} />
                            <div className='p-2 d-flex flex-column'>
                                <div className='h4 fw-bold'>{product.title}</div>
                                <Card.Subtitle>{product.description.slice(0, 30) + '....'}</Card.Subtitle>
                                <Card.Text className='align-self-end fw-bold '>
                                    Rp. {product.discount > 0 ? parseInt(product.price - (product.price * product.discount)) : parseInt(product.price)}
                                    {product.discount > 0 ? <s className='mx-1'>{product.price}</s> : null}
                                    {product.discount > 0 ?
                                        <Card.Text className='h6 text-danger align-self-end'> {product.discount * 100}% off</Card.Text> :
                                        null}
                                </Card.Text>
                            </div>

                        </Card>
                    )
                }) : null}
            </Container>
        </Container>
    )
}

export default Products