import React, { useEffect, useState } from 'react'
import { Button, Divider, Spinner } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import NavegationBar from '../components/navbar'
import getDataAPI from '../helpers/apiconnections'
import { useCartContext } from '../context/cartContext'
import showNotification from '../helpers/notification';

const PurchasePage = () => {
  const [id, setID] = useState()
  const [status, setStatus] = useState()
  const [code, setCode] = useState("")
  const [date, setDate] = useState(null)
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [productos, setProductos] = useState([])
  const { cleanCart } = useCartContext();

  const navigate = useNavigate();

  useEffect(() => {
      const getData = async () => {
        try {
          const data = await getDataAPI('products', "GET", {})
          if (data) {
            setProductos(data.products)
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
      };
    
      getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      cleanCart()
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.size == 0){
        navigate('/')
      }
      const params = {};
      for (const [key, value] of searchParams) {
        params[key] = value;
      }
      setID(params.preference_id)
      setStatus(params.status)
      
      try {
        const data = await getDataAPI('orders', "POST", {
          order: params.preference_id
        })

        if (data.order.items) {
          const time = new Date(data.order.created_at);
          const timestamp = time;
          const formattedDate = `${timestamp.getDate().toString().padStart(2, "0")}/${(timestamp.getMonth() + 1).toString().padStart(2, "0")}/${timestamp.getFullYear()}, ${timestamp.getHours().toString().padStart(2, "0")}:${timestamp.getMinutes().toString().padStart(2, "0")}`;
          setCode(data.code)
          setDate(formattedDate);
          setCart(data.order.items);
          setLoading(false);
        }
      } catch (error) {
        console.log(error)
      }
    }

    getData()
  }, [])
  
  let subtotal = 0

  return (
    <div className='h-screen overflow-y-auto'>
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
          <div className='flex h-5/6 justify-center sm:mt-20 max-xl:flex-col max-xl:items-center max-xl:w-11/12 max-xl:m-auto'>
            <div className='w-6/12 flex flex-col justify-between h-5/6 max-sm:w-11/12 max-xl:w-11/12 max-xl:flex max-xl:justify-center max-xl:items-center'>
              <div className='border-r-2 max-xl:flex max-xl:flex-col max-xl:items-center max-xl:border-0'>
                <h1 className='inter text-5xl max-sm:text-3xl'>{status === 'approved' ? "Gracias por su compra" : "Pago pendiente"}</h1>
                <div className='flex text-gray-500 inter400 mt-1 max-sm:text-[11px]'>
                  <p>ID:</p>
                  <p className='ml-1 truncate'>{id}</p>
                </div>
                <div className='flex text-gray-500 inter400 mt-1 max-sm:text-[11px]'>
                  <p>Estado:</p>
                  <p className='ml-1'>{status}</p>
                </div>
                <div className='flex text-gray-500 inter400 mt-1 max-sm:text-[11px]'>
                  <p>Fecha de compra:</p>
                  <p className='ml-1'>{date}</p>
                </div>
                <div className='mt-2 max-sm:hidden'>
                  <p className='inter400'>{status === 'approved' ? "Tu orden se realizo con exito":"Cuando el pago sea aprobado, se relizara tu pedido"}</p>
                </div>
                {
                  code && (
                    <>
                    <p className='inter400 max-xl:text-center max-sm:text-[11px]'>Para reclamar sus items entre al servidor y escriba el comando /codigo y su codigo</p>
                    <p className='inter400 max-xl:text-center max-sm:text-[11px]'>Para reclamar las otras cosas no reclamables IC, por favor abra ticket y envie captura de esta compra</p>
                    <p className='inter400 max-xl:text-center '>Tu codigo de un solo uso es: <strong>{code}</strong></p>
                    </>
                  )
                }
                <div className='mt-4 max-xl:w-full'>
                  <Button onClick={() => {navigate('/')}} color="primary" variant="shadow" radius='sm' className='rounded-md inter400 max-sm:hidden max-xl:hidden'>Volver al inicio</Button>
                  {
                    code && (
                      <Button variant="shadow" className='inter400 w-2/12 rounded-md ml-2 max-xl:w-full' color='primary' onClick={() => {showNotification("Copiado al portapapeles",'success');navigator.clipboard.writeText(code)}}>Copiar</Button>
                    )
                  }
                </div>
              </div>
            </div>
    
            <div className='w-3/12 h-5/6 pl-5 max-sm:hidden max-xl:hidden'>
              <h1 className='inter text-3xl mb-1'>Resumen</h1>
              <Divider orientation='horizontal'/>
              <div className='mt-1 inter400'>
    
                {cart.map((cartProduct, index) => {
                  const product = productos.find((element) => element.id === cartProduct.id);
                  const finalprice = product.price * cartProduct.quantity
                  subtotal = subtotal + finalprice
                  return (
                    <div key={index} className='flex justify-between mt-1 mb-1'>
                      <p>{product.name}</p>
                      <p>${finalprice}</p>
                    </div>
                  );
                })}
    
                <Divider orientation='horizontal'/>
                <div className='flex justify-between mt-1'>
                  <p>Subtotal</p>
                  <p>${subtotal}</p>
                </div>
                <div className='mt-1' >
                  <div className='flex justify-between items-center'>
                    <p>Total</p>
                    <p>${subtotal}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='w-3/12 pl-5 max-xl:w-11/12 max-xl:pl-0 max-xl:m-auto xl:hidden'>
            <h1 className='inter text-3xl mb-1 max-xl:mt-24'>Resumen</h1>
            <Divider orientation='horizontal'/>
            <div className='mt-1 inter400'>
              {cart.map((cartProduct, index) => {
                const product = productos.find((element) => element.id === cartProduct.id);
                const finalprice = product.price * cartProduct.quantity
                subtotal = subtotal + finalprice
                return (
                  <div key={index} className='flex justify-between mt-1 mb-1'>
                    <p>{product.name}</p>
                    <p>${finalprice}</p>
                  </div>
                );
              })}
              <Divider orientation='horizontal'/>
              <div className='flex justify-between mt-1'>
                <p>Subtotal</p>
                <p>${subtotal}</p>
              </div>
              <div className='mt-1' >
                <div className='flex justify-between items-center'>
                  <p>Total</p>
                  <p>${subtotal}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='xl:hidden mt-4 mb-4 flex flex-col'>
            <Button color="primary" variant="shadow" radius='sm' className='inter400 w-11/12 m-auto' onClick={() => navigate('/')}>Volver al inicio</Button>
          </div>
        </>
      }
    </div>

  )
}

export default PurchasePage