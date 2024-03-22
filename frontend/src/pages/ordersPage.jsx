import React, { useState, useEffect } from 'react'
import { Button, Spinner } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import NavegationBar from '../components/navbar';
import getDataAPI from '../helpers/apiconnections';
import {supabase} from '../api/supabase';

const OrdersPage = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    useEffect(()=>{
        const {data:authListener} = supabase.auth.onAuthStateChange(async (event,session) => {
          if(session){
            try {
                const response = await getDataAPI('orders', "POST", {
                    buyer: session.user.id
                })

                if (response) {
                    setOrders(response)
                    setLoading(false)
                }

                if (response.error === 'Orden no encontrada') {
                    setOrders([])
                    setLoading(false)
                }
                
              } catch (error) {
                console.log(error)
              }
          }
        })
    },[])
    
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
                    <div style={{ height: 'calc(100vh - 65px)' }} className='w-full flex flex-col items-center'>
                        <h1 className='inter text-5xl mt-10 w-9/12 max-lg:w-11/12 max-md:w-full max-md:ml-7'>Ordenes</h1>
                        <div className='w-9/12 rounded-md h-5/6 mt-4 mb-4 pb-4 border-2 border-default-300 flex flex-col justify-start overflow-y-auto max-lg:w-11/12 max-md:w-full max-md:border-none '>
                            {
                                orders.length == 0 ?
                                <>
                                <p className='mt-4 inter400 m-auto'>No hay ordenes</p>
                                </>
                                :
                                <>
                                {
                                orders.map((order,index) => {
                                    const time = new Date(order.created_at); // Convierte la cadena a un objeto Date
                                    const timestamp = time;
                                    const formattedDate = `${timestamp.getDate().toString().padStart(2, "0")}/${(timestamp.getMonth() + 1).toString().padStart(2, "0")}/${timestamp.getFullYear()}, ${timestamp.getHours().toString().padStart(2, "0")}:${timestamp.getMinutes().toString().padStart(2, "0")}`;
                                    return(
                                        <div key={index} className='ml-4 mr-4 border-2 border-default-300 h-52 max-sm:h-64 mt-4 rounded-md flex flex-col justify-between max-sm:justify-center'>
                                        <div className='m-5 max-md:mb-0 flex max-md:flex-col justify-between'>
                                            <div>
                                                <h2 className='inter text-3xl'>Orden #{order.order_id.slice(-6).toUpperCase()}</h2>
                                                <div className='flex text-sm text-gray-500 inter400 mt-1'>
                                                  <p className='max-md:text-xs max-sm:hidden'>ID de compra: {order.order_id}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className='text-sm text-gray-500 inter400'>{formattedDate}</p>
                                                <p className='inter text-2xl flex justify-end max-md:justify-start mt-1'>${order.price}</p>
                                            </div>
                                        </div>
                                        <div className='flex justify-between m-5 max-md:mt-0 items-end max-sm:flex-col-reverse max-sm:items-start max-sm:m-5'>
                                            <Button onClick={() => navigate (`/order/${order.pay_id}`)} color="primary" variant="ghost" radius='sm' className='inter400'>Ver detalles</Button>
                                            <div className='max-sm:mb-3'>
                                                <p className='inter400 text-xs text-gray-500 mb-1'>Estado: {order.status}</p>
                                            </div>
                                        </div>
                                    </div>
                                    )
                                })
                                }
                                </>
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default OrdersPage