import React, {useState, useEffect} from 'react'
import { Button, Spinner } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import NavegationBar from '../components/navbar'
import {supabase} from '../api/supabase';
import getDataAPI from '../helpers/apiconnections'

const AdminProductsPage = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    useEffect(() => {

        const {data:authListener} = supabase.auth.onAuthStateChange(async (event,session) => {
            if(session){
                if(!(session.user.email == import.meta.env.VITE_REACT_APP_ADMIN_EMAIL || session.user.email == import.meta.env.VITE_REACT_APP_ADMIN_EMAIL2)){
                navigate('/')
              }
            }else{
              navigate('/')
            }
        })

        const getOrder = async () => {
          try {
            const data = await getDataAPI('products', "GET", {})
            if (data) {
                setProductos(data.products)
                setLoading(false)
            }
          } catch (error) {
            console.log(error)
          }
        };
      
        getOrder();
    }, []);

    return (
        <div className='h-screen'>
            <NavegationBar currentPage={window.location.href}/>
            {
                loading === false ? 
                <div className='flex items-center justify-center h-[90%] flex-col w-full m-auto'>
                    <h1 className='inter600 text-5xl mb-5 mt-5'>Productos</h1>
                    <div className='w-9/12 rounded-md h-5/6 mt-2 mb-4 pb-4 border-2 border-default-300 flex flex-col justify-start overflow-y-auto max-lg:w-11/12 max-md:w-full max-md:border-none '>
                        {
                            productos.length == 0 ?
                            <>
                            <p className='mt-4 inter400 m-auto'>No hay productos</p>
                            </>
                            :
                            <>
                            {
                            productos.map((product,index) => {
                                return(
                                    <div key={index} className='ml-4 mr-4 border-2 border-default-300 h-auto max-sm:h-64 mt-4 rounded-md flex flex-col justify-between max-sm:justify-center'>
                                    <div className='m-5 max-md:mb-0 flex max-md:flex-col justify-between'>
                                        <div className='flex items-center'>
                                            <img src={`${import.meta.env.VITE_REACT_APP_BACKEND_IP}/${product.image_url}`} className='w-20 h-20 object-contain' alt="" />
                                            <div className='ml-5'>
                                                <h2 className='inter text-3xl'>{product.name}</h2>
                                                <div className='flex text-sm text-gray-500 inter400 flex-col'>
                                                  <p className='max-md:text-xs max-sm:hidden'>ID: #{product.id}</p>
                                                  <p className='max-md:text-xs max-sm:hidden'>Descripcion: {product.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className='text-sm text-gray-500 inter400'></p>
                                            <p className='inter text-2xl flex justify-end max-md:justify-start mt-1'>${product.price}</p>
                                        </div>
                                    </div>
                                    <div className='flex justify-between m-5 max-md:mt-0 items-end max-sm:flex-col-reverse max-sm:items-start max-sm:m-5'>
                                        <div>
                                            <Button onClick={() => navigate(`/product/${product.id}`)} color="primary" variant="ghost" radius='sm' className='inter400'>Ver producto</Button>
                                            <Button onClick={() => navigate(`/admin/editproduct/${product.id}`)} color="primary" variant="ghost" radius='sm' className='inter400 ml-3'>Editar producto</Button>
                                        </div>
                                        {
                                            product.discount === 0 ? <></>:
                                            <div className='max-sm:mb-3 border-2 p-3 rounded-lg border-green-500'>
                                                <p className='inter600 text-green-500 text-sm'>Descuento: %{product.discount}</p>
                                            </div>
                                        }

                                    </div>
                                    </div>
                                )
                            })
                            }
                            </>
                        }
                    </div>
                    <div onClick={() => navigate('/admin/createproduct')} className='bg-gray-500 h-10 w-10 absolute bottom-2 right-2 rounded-full flex items-center justify-center text-white text-xl hover:bg-gray-500/90 hover:cursor-pointer'>
                        <FaPlus/>
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

export default AdminProductsPage