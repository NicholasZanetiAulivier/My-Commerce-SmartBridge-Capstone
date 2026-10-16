import React, { useEffect, useState } from 'react'
import '../styles/Products.css'
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../utils/fetchUtils';
import { Card, CardGroup, Container } from 'react-bootstrap';
import ENV from '../config/env';

const Products = ({ category }) => {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [sortFilter, setSortFilter] = useState('popularity');
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [genderFilter, setGenderFilter] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])

    //   const fetchData = async() =>{

    //     await axios.get('http://localhost:6001/api/products/fetch-products').then(
    //       (response)=>{
    //         if(props.category === 'all'){
    //             setProducts(response.data);
    //             setVisibleProducts(response.data);
    //         }else{
    //             setProducts(response.data.filter(product=> product.category === props.category));
    //             setVisibleProducts(response.data.filter(product=> product.category === props.category));
    //         }
    //       }
    //     )
    //     await axios.get('http://localhost:6001/api/products/fetch-categories').then(
    //       (response)=>{
    //         setCategories(response.data);
    //       }
    //     )
    //   }


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

    return (
        <Container fluid style={{ minHeight: "50vh", width: "100%" }}>
            <div className='h3'>All Products</div>
            <Container fluid className='d-flex gap-3 w-100 ' >
                {products ? products.map((product) => {
                    return (
                        <Card onClick={() => navigate(`/product/${product.id}`)} key={product.id} className='col-2 border-0 p-2' style={{ height: 'fit-content' }}>
                            <Card.Img src={product.mainImg ? product.mainImg : ENV.PLACEHOLD_IMG} />
                            <div className='p-2 d-flex flex-column'>
                                <div className='h4 fw-bold'>{product.title}</div>
                                <Card.Subtitle>{product.description.slice(0, 30) + '....'}</Card.Subtitle>
                                <Card.Text className='align-self-end fw-bold '>
                                    Rp. {parseInt(product.price - (product.price * product.discount))}
                                    <s>{product.price}</s>
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