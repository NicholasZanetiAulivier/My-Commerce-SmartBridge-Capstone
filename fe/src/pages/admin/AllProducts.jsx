import '../../styles/AllProducts.css'
import { Button, Container } from 'react-bootstrap';
import ProductsAdmin from '../../components/ProductsAdmin';
import WestIcon from '@mui/icons-material/West';
import { useNavigate } from 'react-router-dom';

const AllProducts = () => {
    const navigator = useNavigate();

    return (
        <Container style={{ 'paddingTop': '10vh', paddingRight: 0, paddingLeft: 0 }}>
            <span><Button onClick={() => navigator(-1)}><WestIcon /></Button></span>
            <Container fluid>
                <ProductsAdmin />
            </Container>
        </Container>
    )
}

export default AllProducts