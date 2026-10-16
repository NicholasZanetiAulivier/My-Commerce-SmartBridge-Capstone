import React, { useEffect, useState } from 'react'
import '../styles/Home.css'
import Products from '../components/Products'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import { fetchApi } from '../utils/fetchUtils'
import { Card, CardImg, Container } from 'react-bootstrap'
import { BsLine } from 'react-icons/bs'
import ENV from '../config/env'

const Home = () => {

  const navigate = useNavigate();

  const [categories, setCategories] = useState(undefined);

  useEffect(() => {
    if (localStorage.getItem('type') === 'admin') navigate('/admin');
    fetchCategories();
  }, [])

  async function fetchCategories() {
    await fetchApi('/product/categories').then(async res => {
      if (res.status === 200) {
        setCategories((await res.json()).categories);
      }
      else
        throw new Error("Failed to fetch categories");
    }).catch(e => console.error(e));
  }

  return (
    <Container fluid style={{ 'paddingTop': '10vh', paddingRight: 0, paddingLeft: 0 }}>
      <Container fluid className='d-flex justify-content-center'>

        {
          categories ?
            categories.map((c) => (
              <Card onClick={() => navigate('/category/' + c)} className='col-1' key={c}>
                <CardImg src={ENV.PLACEHOLD_IMG} />
                <div className='h5 align-self-center'>{c}</div>
              </Card>
            ))
            : null
        }
      </Container>
      <hr className="hr px-5 mx-5" />
      <Container fluid>
        <Products category={categories} />
      </Container>
      <Footer />
    </Container>
  )
}

export default Home