import React, {useState, useEffect} from 'react'
import { Button, Spinner } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import NavegationBar from '../components/navbar'
import {supabase} from '../api/supabase';
import getDataAPI from '../helpers/apiconnections'

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState({})
    const navigate = useNavigate();

    useEffect(() => {

        const {data:authListener} = supabase.auth.onAuthStateChange(async (event,session) => {
            if(session){
                if(!(session.user.email == import.meta.env.VITE_REACT_APP_ADMIN_EMAIL || session.user.email == import.meta.env.VITE_REACT_APP_ADMIN_EMAIL2)){
                navigate('/')
              }
              setSession(session)
              const data = await getDataAPI('allorders', "POST", {order:'all'}, session.access_token)
              if (data.error != 'No se encontraron órdenes') {
                setOrders(data)
              }
              setLoading(false)
            }else{
              navigate('/')
            }
        })
    }, []);

    return (
        <div className='h-screen'>
            <NavegationBar currentPage={window.location.href}/>
            {
                loading === false ? 
                <div className='flex items-center justify-center h-[90%] flex-col w-full m-auto'>
                    <h1 className='inter600 text-5xl mb-5 mt-5'>Ordenes</h1>
                    <div className='w-9/12 rounded-md h-5/6 mt-2 mb-4 pb-4 border-2 border-default-300 flex flex-col justify-start overflow-y-auto max-lg:w-11/12 max-md:w-full max-md:border-none '>
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
                                        <Button onClick={() => navigate(`/order/${order.pay_id}`)} color="primary" variant="ghost" radius='sm' className='inter400'>Ver detalles</Button>
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
                :
                <>
                <div style={{ height: 'calc(100vh - 65px)' }} className='flex justify-center items-center'>
                    <Spinner size="lg"/>
                </div>
                </>
            }
        </div>
    )
}

export default AdminOrdersPage