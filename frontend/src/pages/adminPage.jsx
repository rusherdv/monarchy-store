import React,{useState, useEffect} from 'react'
import { Spinner } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import NavegationBar from '../components/navbar'
import {supabase} from '../api/supabase';
import getDataAPI from '../helpers/apiconnections'

const AdminPage = () => {

  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(()=>{
    const {data:authListener} = supabase.auth.onAuthStateChange(async (event,session) => {
      if(session){
        if(!(session.user.email == import.meta.env.VITE_REACT_APP_ADMIN_EMAIL || session.user.email == import.meta.env.VITE_REACT_APP_ADMIN_EMAIL2)){
          navigate('/')
        }
        setLoading(false)
      }else{
        navigate('/')
      }
    })
  },[])

  return (
    <div className='h-screen'>
      <NavegationBar currentPage={window.location.href}/>
      {
        loading === false ? 
        <>
        <div className='flex items-center justify-center h-5/6 flex-col w-6/12 m-auto max-xl:w-full'>
          <h1 className='inter600 text-4xl mb-5 max-sm:w-full max-sm:text-3xl max-sm:text-center'>Panel de administracion</h1>
          <div onClick={() => {navigate('/admin/orders')}} className='border-2 inter400 w-4/12 max-sm:w-7/12 h-10 flex items-center justify-center rounded-lg hover:cursor-pointer hover:bg-gray-200 text-md'>
            <p>Administrar ventas</p>
          </div>
          <div onClick={() => {navigate('/admin/products')}} className='mt-2 border-2 inter400 w-4/12 max-sm:w-7/12 h-10 flex items-center justify-center rounded-lg hover:cursor-pointer hover:bg-gray-200 text-md'>
            <p>Administrar productos</p>
          </div>
          <div onClick={() => {navigate('/admin/generator')}} className='mt-2 border-2 inter400 w-4/12 h-10 max-sm:w-7/12 flex items-center justify-center rounded-lg hover:cursor-pointer hover:bg-gray-200 text-md'>
            <p>Generador de codigos</p>
          </div>
        </div>
        </>
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

export default AdminPage