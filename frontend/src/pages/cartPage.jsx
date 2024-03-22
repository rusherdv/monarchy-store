import React,{useState, useEffect} from 'react'
import { Button, Divider, Spinner } from "@nextui-org/react";
import { ProductCart } from '../components/product';
import { initMercadoPago } from '@mercadopago/sdk-react'
import { useCartContext } from '../context/cartContext'
import NavegationBar from '../components/navbar'
import getDataAPI from '../helpers/apiconnections'
import {supabase} from '../api/supabase';
import showNotification from '../helpers/notification';

const Cartpage = () => {
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [productos, setProductos] = useState([]);
  const [session, setSession] = useState(null)
  const { cart, cleanCart, removeProduct, addProduct, addProductCart, getTotalPay } = useCartContext();

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getDataAPI('products', "GET", {})
        if (data) {
          setProductos(data.products)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };
  
    getData();
  }, []);

  useEffect(()=>{
    const {data:authListener} = supabase.auth.onAuthStateChange(async (event,session) => {
      if(session){
        setSession(session)
      }
    })
  },[])

  initMercadoPago(import.meta.env.VITE_REACT_APP_MP_TOKEN);

  const handleBuy = async () => {
    
    if(!session){
      showNotification("Inicia sesion para poder comprar", 'error')
      return
    }

    try {
      const data = await getDataAPI('mp/create_preference', "POST", {
        title: "Productos",
        quantity: 1,
        price: total,
        buyer: session.user.id,
        created_at: new Date().toUTCString(),
        order_id: Array.from({ length: 32 }, () => Math.random().toString(36).charAt(2).toUpperCase()).join(''),
        items: cart,
      })
      if (data) {
        window.location.href = data.init_point
      }
    }catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    const getTotal = async () => {
      const totalPay = await getTotalPay()
      setSubtotal(totalPay.toFixed(2))
      setTotal(totalPay.toFixed(2))
    }
    getTotal()
  },[cart])

  return (
    <div className='h-screen'>
      <NavegationBar currentPage={window.location.href}/>
      {
        loading ? 
        <>
        <div style={{ height: 'calc(100vh - 65px)' }} className='flex justify-center items-center'>
            <Spinner size="lg"/>
        </div>
        </>
        :
        <>
        <div className={`flex ${cart.length === 0 ? "justify-center":"justify-end"} max-xl:flex-col max-xl:items-center max-xl:justify-center`}>
          <div className='w-8/12 max-xl:w-full h-[90%]'>
            <h1 className={`${cart.length === 0 ? "hidden":""} inter text-5xl mt-5 max-xl:w-11/12 max-xl:m-auto max-xl:mt-5 max-xl:mb-5`}>Carrito</h1>
            <div className={`${cart.length === 0 ? "":"border-1"} w-10/12 max-xl:w-11/12 max-xl:m-auto h-full max-xl:h-5/6 mt-5 rounded-md overflow-y-auto overflow-x-hidden pb-2`}>
              {cart.length === 0 ? 
              <p className='flex h-full inter400 text-xl items-center justify-center absolute top-0 right-0 left-0 bottom-0'>El carrito esta vacio</p>
              :
              cart.map((product, index) => (
                <ProductCart key={index} product={product} />
              ))}
            </div>
          </div>
          {cart.length === 0 ? 
            <></> 
            : 
            <>
              <div className='w-1 pt-4 pr-5 max-xl:hidden'>
              <Divider orientation="vertical"/>
              </div>
              <div className='w-10/12 pt-4 pr-5 xl:hidden'>
              <Divider orientation="horizontal"/>
              </div>
              <div className='w-3/12 mt-5 flex flex-col justify-start inter400 mr-10 max-xl:w-11/12 max-xl:m-auto max-xl:shadow-medium max-xl:rounded-lg max-xl:mb-4 max-xl:p-5 shadow-black'>
                <h1 className='inter text-3xl' onClick={()=>{console.log(cart)}}>Pagar</h1>
                <div className='mt-2 mb-2'>
                {cart.map((cartProduct, index) => {
                  const product = productos.find((element) => element.id === cartProduct.id);
                  const finalprice = ((product.price)-((product.discount * product.price)/100))* cartProduct.quantity
                  return (
                    <div key={index} className='flex justify-between mr-2'>
                      <div className="flex-grow">
                        <p>{product.name}</p>
                      </div>
                      <div className="w-16 text-right">
                        <p>${finalprice}</p>
                      </div>
                    </div>
                  );
                })}
                <Divider/>
                <div className='mr-2'>
                  <div className='mt-2 flex justify-between '>
                    <p>Subtotal</p>
                    <p>${subtotal}</p>
                  </div>
                  <div className='flex justify-between items-center'>
                    <p>Total</p>
                    <p>${total}</p>
                  </div>
                </div>
                <div className='max-xl:flex max-xl:justify-between max-sm:block'>
                  <Button onClick={handleBuy} color="primary" variant="shadow" className='mt-2 w-full max-xl:h-12' radius='sm'>Pagar</Button>
                </div>
                </div>
              </div>
            </>
          }
        </div>
        </>
      }
    </div>
  )
}

export default Cartpage