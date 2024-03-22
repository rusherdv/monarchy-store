import React, { useState, useEffect } from 'react'
import { Button, Divider, Spinner } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import NavegationBar from '../components/navbar'
import getDataAPI from '../helpers/apiconnections'

const OrderPage = () => {
  const [order, setOrder] = useState({});
  const [date, setDate] = useState(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getOrder = async () => {
      try {
        try {
          const data = await getDataAPI('products', "GET", {})
          if (data) {
            setProductos(data.products)
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
        const urlParam = window.location.href.split('/order/')[1];
        const data = urlParam ? decodeURIComponent(urlParam) : '';
        const dataAPI = await getDataAPI('orders', "POST", {
          order: data
        })
        if (dataAPI) {
          console.log(dataAPI)
          const time = new Date(dataAPI.order.created_at);
          const timestamp = time;
          const formattedDate = `${timestamp.getDate().toString().padStart(2, "0")}/${(timestamp.getMonth() + 1).toString().padStart(2, "0")}/${timestamp.getFullYear()}, ${timestamp.getHours().toString().padStart(2, "0")}:${timestamp.getMinutes().toString().padStart(2, "0")}`;
          if(dataAPI.code){
            setCode(dataAPI.code)
          }
          setDate(formattedDate);
          setOrder(dataAPI.order)
          setLoading(false);
        }
      } catch (error) {
        console.log(error)
      }
    };
  
    getOrder();
  }, []);
  let subtotal = 0
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
                  <div className='w-full flex justify-around mt-4 max-xl:flex-col xl:mt-10 max-xl:items-center max-xl:justify-start'>
                      <div className='w-7/12 rounded-md h-4/6 max-xl:h-fit flex flex-col border-r-2 border-default-300 max-xl:w-11/12 xl:justify-between max-xl:border-0'>
                          {
                            order ? 
                            <>
                            <div className='max-xl:w-full max-xl:m-auto'>
                                <h1 className='inter text-5xl'>Order #{order.order_id.slice(-6).toUpperCase()}</h1>
                                <div className='mt-1'>
                                    <div className='text-sm text-gray-500 inter400'>
                                      <p>Purchase ID: {order.order_id}</p>
                                      <p>Date: {date}</p>
                                    </div>
                                </div>   
                            </div>
                            {
                              code && (
                                <>
                                <p className='inter400 max-sm:text-[11px]'>Para reclamar sus items entre al servidor y escriba el comando /codigo y su codigo</p>
                                <p className='inter400 max-sm:text-[11px]'>Para reclamar las otras cosas no reclamables IC, por favor abra ticket y envie captura de esta compra</p>
                                <p className='inter400'>Tu codigo de un solo uso es: <strong>{code}</strong></p>
                                </>
                              )
                            }
                            <div className='mt-4 max-xl:w-full'>
                              <Button onClick={() => {navigate('/')}} color="primary" variant="shadow" radius='sm' className='rounded-md inter400 max-sm:hidden max-xl:hidden mr-5'>Volver al inicio</Button>
                              {
                                code && (
                                  <Button variant="shadow" className='rounded-md inter400 max-sm:hidden max-xl:hidden' color='primary' onClick={() => {showNotification("Copiado al portapapeles",'success');navigator.clipboard.writeText(code)}}>Copiar</Button>
                                )
                              }
                            </div>
                            </>
                            :
                            <div style={{ height: 'calc(100vh - 65px)' }} className='flex justify-center items-center'>
                            <Spinner size="lg"/>
                            </div>
                          }
                      </div>
                      <div className='w-3/12 h-4/6 max-xl:h-fit max-xl:w-11/12 max-xl:mt-2'>
                          <h1 className='inter text-3xl mb-1'>Summary</h1>
                          <Divider orientation='horizontal'/>
                          <div className='mt-1 inter400'>
                              {
                                  order && 
                                  <>
                                      {order.items.map((cartProduct, index) => {
                                          const product = productos.find((element) => element.id === cartProduct.id);
                                          const finalprice = (product.price - (product.discount * product.price)/100) * cartProduct.quantity
                                          subtotal = subtotal + finalprice
                                          return (
                                            <div key={index} className='flex justify-between mt-1 mb-1'>
                                              <p>{product.name}</p>
                                              <p>${finalprice}</p>
                                            </div>
                                          );
                                      })}
                                  </>
                              }
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
                      <div className='flex xl:hidden flex-col items-center justify-center mt-5 mb-5 w-full'>
                        {
                          code && (
                            <Button variant="shadow" className='inter400 w-11/12 mb-5' color='primary' onClick={() => {showNotification("Copiado al portapapeles",'success');navigator.clipboard.writeText(code)}}>Copiar</Button>
                          )
                        }
                        <Button onClick={() => navigate('/')} color="primary" variant="shadow" radius='sm' className='inter400 w-11/12'>Volver al inicio</Button>
                      </div>
                  </div>
              </>
          }
      </div>
  )
}

export default OrderPage