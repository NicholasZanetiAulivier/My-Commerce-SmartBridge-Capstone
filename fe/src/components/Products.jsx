import React, { useEffect, useState } from 'react'
import '../styles/Products.css'
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../utils/fetchUtils';

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
        <div className="products-container">
            <div className="products-body">
                <h3>All Products</h3>
                <div className="products">

                    {products ? products.map((product) => {
                        return (
                            <div className='product-item' key={product.id} >
                                <div className="product" onClick={() => navigate(`/product/${product.id}`)}>
                                    <img src={product.mainImg} alt="" />
                                    <div className="product-data">
                                        <h6>{product.title}</h6>
                                        <p>{product.description.slice(0, 30) + '....'}</p>
                                        <h5>Rp. {parseInt(product.price - (product.price * product.discount))} <s>{product.price}</s><p>( {product.discount * 100}% off)</p></h5>
                                    </div>
                                </div>
                            </div>
                        )
                    }) : null}


                </div>
            </div>
        </div>
    )
}

export default Products