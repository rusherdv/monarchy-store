import React, {useState, useEffect} from 'react'
import NavegationBar from '../components/navbar'
import Footer from '../components/footer'
import { Spinner } from "@nextui-org/react";
import { SectionProduct } from '../components/sectionproducts'
import getDataAPI from '../helpers/apiconnections'

const Mainpage = () => {

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getDataAPI('products', 'GET', {});
        if (data) {
          setProductos(data.products);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };
    getData();
  }, []);

  return (
    <>
    <NavegationBar currentPage={window.location.href}/>
    {
      loading ? 
      <div style={{ height: 'calc(100vh - 65px)' }} className='flex justify-center items-center'>
      <Spinner size="lg"/>
      </div>
      :
      <>
          <div className='relative flex justify-start items-center'>
      <img src="/bannerFivem.webp" className='w-full h-unit-7xl object-cover brightness-50' alt="" />
      <div className='absolute flex flex-col items-center right-0 left-0'>
        <img className='w-[500px]' src="/logo.webp" alt="" />
        <img className='w-[400px]' src="/logoText.webp" alt="" />
      </div>
    </div>


    <div className='mt-10 w-11/12 h-14 flex items-center m-auto border-1 border-gray-400 justify-between'>
      <h1 className='font-bold text-4xl inter ml-2'>VIP</h1>
    </div>
    
    <div className='w-11/12 m-auto flex justify-between flex-wrap max-sm:justify-center max-md:justify-around mb-4'>
      <SectionProduct       
        filterOptions={{
          minPrice: 0,
          maxPrice: 250000,
          orderBy: [{ type: 'rating', order: 'des' }],
          max: 5,
          filters: {
            type: ["vip"]
          }
        }}
        productos={productos}
      />
    </div>

    <div className={`mt-2 w-11/12 h-14 flex items-center m-auto border-1 border-gray-400 justify-between`}>
      <h1 className='font-bold text-4xl inter ml-2'>ARMAS</h1>
    </div>

    <div className='w-11/12 m-auto flex justify-between flex-wrap max-sm:justify-center mb-4'>
      <SectionProduct 
        filterOptions={{
          minPrice: 0,
          maxPrice: 250000,
          orderBy: [{ type: 'rating', order: 'des' }],
          max: 6,
          filters: {
            type: ["weapon"]
          }
        }}
        productos={productos}
      /> 
    </div>

    <div className={`mt-2 w-11/12 h-14 flex items-center m-auto border-1 border-gray-400 justify-between`}>
      <h1 className='font-bold text-4xl inter ml-2'>FACCIONES</h1>
    </div>

    <div className='w-11/12 m-auto flex justify-between flex-wrap max-sm:justify-center mb-4'>
      <SectionProduct 
        filterOptions={{
          minPrice: 0,
          maxPrice: 250000,
          orderBy: [{ type: 'rating', order: 'des' }],
          max: 5,
          filters: {
            type: ["faccion"]
          }
        }}
        productos={productos}
      />
    </div>

    <div className={`mt-2 w-11/12 h-14 flex items-center m-auto border-1 border-gray-400 justify-between`}>
      <h1 className='font-bold text-4xl inter ml-2'>OTROS</h1>
    </div>

    <div className='w-11/12 m-auto flex justify-between flex-wrap max-sm:justify-center mb-4'>
      <SectionProduct 
        filterOptions={{
          minPrice: 0,
          maxPrice: 250000,
          orderBy: [{ type: 'rating', order: 'des' }],
          max: 5,
          filters: {
            type: ["item"]
          }
        }}
        productos={productos}
      /> 
    </div>
      </>
    }

    <Footer/>
    </>
  )
}

export default Mainpage