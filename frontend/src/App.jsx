import Mainpage from "./pages/mainPage"
import Productpage from "./pages/productPage"
import Productspage from "./pages/productsPage"
import Cartpage from "./pages/cartPage"
import PurchasePage from "./pages/purchasePage"
import Loginpage from "./pages/loginPage"
import OrderPage from "./pages/orderPage"
import OrdersPage from "./pages/ordersPage"
import AdminPage from './pages/adminPage'
import AdminOrdersPage from "./pages/adminOrdersPage"
import AdminProductsPage from "./pages/adminProductsPage"
import AdminGeneratorPage from "./pages/adminGeneratorPage"
import AdminEditProductPage from './pages/adminEditProductPage'
import AdminCreateProductPage from './pages/adminCreateProductPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CartProvider from './context/cartContext'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Mainpage/>}/>
          <Route path='/admin' element={<AdminPage/>}/>
          <Route path='/admin/products' element={<AdminProductsPage/>}/>
          <Route path='/admin/createproduct' element={<AdminCreateProductPage/>}/>
          <Route path='/admin/editproduct/:id' element={<AdminEditProductPage/>}/>
          <Route path='/admin/generator' element={<AdminGeneratorPage/>}/>
          <Route path='/admin/orders' element={<AdminOrdersPage/>}/>
          <Route path='/cart' element={<Cartpage/>}/>
          <Route path='/products' element={<Productspage/>}/>
          <Route path='/product/:id' element={<Productpage/>}/>
          <Route path='/purchase' element={<PurchasePage/>}/>
          <Route path='/orders' element={<OrdersPage/>}/>
          <Route path='/order/:id' element={<OrderPage/>}/>
          <Route path='/login' element={<Loginpage/>}/>
          <Route path='/forgot-password' element={""}/>
          <Route path='/change-password/:id' element={""}/>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
