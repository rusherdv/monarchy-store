import React,{ useState, useEffect } from 'react'
import { Input, Spinner } from "@nextui-org/react";
import { SectionProduct } from '../components/sectionproducts'
import { BiSearchAlt2 } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer'
import Filter from '../components/filter'
import NavegationBar from '../components/navbar'
import getDataAPI from '../helpers/apiconnections'

const Productspage = () => {

  const [searchText, setSearchText] = useState('')
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    minPrice: 0,
    maxPrice: 10000,
    orderBy: [
      {type: 'rating', order: 'des'}
    ],
    max: 0,
    filters: {}
  });

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
  
  const navigate = useNavigate();

  const search = () => {
    navigate(`/products?search?=${searchText}`)
  }

  useEffect(() => {
    const data = decodeURIComponent(window.location.href.split('/products?search?=')[1]).toLowerCase()
    if(data !== 'undefined'){
      setSearchText(data)
    }
  },[])

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      search()
    }
  }
  
  const handleFilterChange = (newFilterOptions) => {
    setFilterOptions(newFilterOptions);
  };
    
  return (
    <div className='flex flex-col min-h-screen'>
    <NavegationBar currentPage={window.location.href} filterOptions={filterOptions} onFilterChange={handleFilterChange}/>
    {
      loading ? 
      <div style={{ height: 'calc(100vh - 65px)' }} className='flex justify-center items-center'>
      <Spinner size="lg"/>
      </div>
      :
      <div className='grow flex items-start mt-20 justify-around max-xl:justify-start relative max-xl:flex-col max-xl:items-center max-xl:mt-10 mb-20'>
      <Input
        isClearable
        onKeyDown={handleKeyPress}
        classNames={{
          base: "max-w-full h-4/6 ",
          input: "text-small",
          label: "text-xs",
          inputWrapper: "w-11/12 m-auto h-full border-gray-400 border-1 font-normal",
        }}
        startContent={<BiSearchAlt2 className="text-xl hover:cursor-pointer" onClick={search}/>}
        placeholder="Type to search..."
        size="lg"
        onClear={() => setSearchText('')}
        className='md:hidden mb-3'
        radius='none'
        label="Search"
        value={searchText}
        variant='bordered'
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Filter filterOptions={filterOptions} onFilterChange={handleFilterChange} />
      <div className='ml-[350px] w-9/12 max-xl:ml-0 max-xl:mt-3 max-xl:mr-0 mr-5 max-xl:w-11/12'>
        
        <div className='h-14 flex w-full items-center border-1 border-gray-400 justify-between'>
          <h1 className='font-bold text-4xl inter ml-2 max-xl:text-3xl'>PRODUCTOS</h1>
        </div>

        <div className='m-auto flex justify-between  max-xl:justify-center max-xl:gap-1 flex-wrap max-sm:justify-center'>
          <SectionProduct  filterOptions={filterOptions} productos={productos}/>
        </div>
      </div>
    </div>
    }
    <Footer/>
    </div>
  )
}

export default Productspage