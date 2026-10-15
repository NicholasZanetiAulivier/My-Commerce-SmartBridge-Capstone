import React, { useEffect, useState } from 'react'
import '../styles/Home.css'
import Products from '../components/Products'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import { fetchApi } from '../utils/fetchUtils'

const Home = () => {

  const navigate = useNavigate();

  // const [bannerImg, setBannerImg] = useState();
  const [categories, setCategories] = useState(undefined);

  useEffect(() => {
    // fetchBanner();
    fetchCategories();
  }, [])

  // const fetchBanner = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:6001/api/banners"); // public route
  //     setBannerImg(response.data);
  //   } catch (err) {
  //     console.error("Failed to fetch banner:", err.response?.data?.message || err.message);
  //   }
  // };

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
    <div className="HomePage">
      {/* <div className="home-banner">
        {bannerImg ?
          <img src={bannerImg} alt="" />
          :
          ""}
      </div> */}

      <div className="home-categories-container">

        {
          categories ?
            categories.map((c) => (<div className="home-category-card" onClick={() => navigate('/category/' + c)}>
              <img src="https://placehold.co/400/png" alt="" />
              <h5>{c}</h5>
            </div>))
            : null
        }

      </div>


      <div id='products-body'></div>
      <Products category={categories} />


      <Footer />
    </div>
  )
}

export default Home