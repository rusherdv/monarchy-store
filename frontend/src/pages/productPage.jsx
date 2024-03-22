import React,{useState, useEffect} from 'react'
import { Button, Spinner, CheckboxGroup, Checkbox, Listbox, ListboxItem } from "@nextui-org/react";
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { SectionProduct } from '../components/sectionproducts.jsx';
import { useCartContext } from '../context/cartContext.jsx';
import NavegationBar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx';
import getDataAPI from '../helpers/apiconnections'

const Productpage = () => {
  const [currentProduct, setCurrentProduct] = useState()
  const [currentImg, setCurrentImage] = useState()
  const [loading, setLoading] = useState(true)
  const [price, setPrice] = useState(0)
  const [zonaroja, setZonaroja] = useState(false)
  const [moreinventory, setMoreinventory] = useState(false)
  const [parking, setParking] = useState(false)
  const [cctv, setCctv] = useState(false)
  const [irrompibilidad, setIrrompibilidad] = useState(false)
  const [masinventory, setMasinventory] = useState(false)
  const {addProduct} = useCartContext();
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));
  const [productos, setProductos] = useState([])
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getDataAPI('products', "GET", {});
        if (data) {
          setProductos(data.products)
          const productoEncontrado = data.products.find(product => product.id == window.location.href.split('/product/')[1]);
          setCurrentProduct(productoEncontrado)
          setCurrentImage(productoEncontrado.image_url);
          setPrice(productoEncontrado.price);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };
  
    getData();
  }, []);

  useEffect(() => {
    if(zonaroja){
      setPrice(price + 750)
    }

    if(!zonaroja){
      setPrice(price - 750)
    }
  },[zonaroja])
  
  useEffect(() => {
    if(moreinventory){
      setPrice(price + 500)
    }

    if(!moreinventory){
      setPrice(price - 500)
    }

  },[moreinventory])
  
  useEffect(() => {
    if(parking){
      setPrice(price + 500)
    }

    if(!parking){
      setPrice(price - 500)
    }

  },[parking])
  
  useEffect(() => {
    if(cctv){
      setPrice(price + 500)
    }

    if(!cctv){
      setPrice(price - 500)
    }
  },[cctv])

  useEffect(() => {
    if(irrompibilidad){
      setPrice(price + 2000)
    }

    if(!irrompibilidad){
      setPrice(price - 2000)
    }

  },[irrompibilidad])

  useEffect(() => {
    if(masinventory){
      setPrice(price + 2000)
    }

    if(!masinventory){
      setPrice(price - 2000)
    }

  },[masinventory])

  const handleAddCart = () => {

    if(currentProduct.type === 'house'){
      if(zonaroja){
        currentProduct.extra.zonaroja = true
        currentProduct.price = price
      }
  
      if(moreinventory){
        currentProduct.extra.moreinventory = true
        currentProduct.price = price
      }
  
      if(parking){
        currentProduct.extra.parking = true
        currentProduct.price = price
      }
  
      if(cctv){
        currentProduct.extra.cctv = true
        currentProduct.price = price
      }
    }else if(currentProduct.type === 'car'){
      console.log(selectedValue)
      if(irrompibilidad){
        currentProduct.extra.irrompibilidad = true
        currentProduct.price = price
      }
  
      if(masinventory){
        currentProduct.extra.moreinventory = true
        currentProduct.price = price
      }

      if(selectedValue === 'extraVelocity1'){
        currentProduct.extra.extraVelocity = 10
        currentProduct.price = price + 1000
      }

      if(selectedValue === 'extraVelocity2'){
        currentProduct.extra.extraVelocity = 20
        currentProduct.price = price + 2000
      }

      if(selectedValue === 'extraVelocity3'){
        currentProduct.extra.extraVelocity = 30
        currentProduct.price = price + 3000
      }

      console.log(selectedValue)
  
    }

    addProduct(currentProduct, 1);
  }

  return (
    <>
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
            <div className='flex justify-center items-start mt-32 max-2xl:mt-14 max-md:mt-0'>
            <div className='flex items-center justify-center h-full relative max-sm:items-center w-full max-md:flex-col ml-10 mr-10'>
                
                <div className='flex items-center'>
                    <div className='flex-1 w-5/12'>
                      {
                        currentProduct.type === 'weapon'? 
                        <img className='h-[300px] float-right mr-10 object-contain w-6/12' src={`${import.meta.env.VITE_REACT_APP_BACKEND_IP}/${currentImg}`} alt="" />
                        :
                        <img className='h-[300px] mr-2 object-cover w-11/12' src={`${import.meta.env.VITE_REACT_APP_BACKEND_IP}/${currentImg}`} alt="" />
                      }
                    </div>
                </div>
                <div className='flex flex-col justify-center items-start relative max-md:mt-10 w-3/12 max-md:w-9/12 max-sm:w-11/12'>
                    <div className='flex-1'>
                        <h1 className='text-3xl w-12/12 inter600 pr-8 max-sm:w-10/12'>{currentProduct.name}</h1>
                        <p className='text-gray-500 mb-2 inter400'>{currentProduct.desc}</p>
                        <div className='flex'>
                            <AiFillStar/>
                            <AiFillStar/>
                            <AiFillStar/>
                            <AiFillStar/>
                            <AiOutlineStar/>
                        </div>
                        {
                            currentProduct.discount === 0 ? 
                            <div className='flex items-center'>
                                <p className='text-3xl'>${price}</p>
                            </div>
                            :
                            <div>
                                <p className='text-1xl text-gray-500 line-through'>${currentProduct.price}</p>
                                <div className='flex items-center'>
                                    <p className='text-3xl'>${(currentProduct.price)-((currentProduct.discount * currentProduct.price)/100)}</p>
                                    <div className='bg-green-700 rounded-sm ml-1 flex justify-center items-center'>
                                        <p className='font-bold text-md pl-1 pr-2 text-white'>%{currentProduct.discount} OFF</p>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                          currentProduct.type === 'car' ? 
                          <div className='inter400 mt-1'>
                            <Listbox
                              className='border-2 rounded-lg'
                              aria-label="Velocity"
                              variant="flat"
                              disallowEmptySelection
                              selectionMode="single"
                              selectedKeys={selectedKeys}
                              onSelectionChange={setSelectedKeys}
                            >
                              <ListboxItem key={false}>+0 KM/H</ListboxItem>
                              <ListboxItem key="extraVelocity1"><div className='flex items-center'><p>+10 KM/H</p><p className='text-xs ml-1 text-green-500 inter600'>+1000</p></div></ListboxItem>
                              <ListboxItem key="extraVelocity2"><div className='flex items-center'><p>+20 KM/H</p><p className='text-xs ml-1 text-green-500 inter600'>+2000</p></div></ListboxItem>
                              <ListboxItem key="extraVelocity3"><div className='flex items-center'><p>+30 KM/H</p><p className='text-xs ml-1 text-green-500 inter600'>+3000</p></div></ListboxItem>
                            </Listbox>
                            <CheckboxGroup className='mt-2'>
                              <div className='flex items-center'>
                                <Checkbox onChange={(e) => setIrrompibilidad(prevValue => !prevValue)} size='sm' value='irrompibilidad'>Irrompibilidad</Checkbox>
                                <p className='text-xs ml-1 text-green-500 inter600'>+2000</p>
                              </div>
                              <div className='flex items-center'>
                                <Checkbox onChange={(e) => setMasinventory(prevValue => !prevValue)} size='sm' value='masinventory'>Inventario grande</Checkbox>
                                <p className='text-xs ml-1 text-green-500 inter600'>+2000</p>
                              </div>
                            </CheckboxGroup>
                          </div>
                          :
                          <>
                          </>
                        }
                        {
                          currentProduct.type === 'house' ? 
                          <div className='inter400 mt-1'>
                            <CheckboxGroup>
                              <div className='flex items-center'>
                                <Checkbox onChange={(e) => setZonaroja(prevValue => !prevValue)} size='sm' value='zonaroja'>Zona roja, zona caliente</Checkbox>
                                <p className='text-xs ml-1 text-green-500 inter600'>+750</p>
                              </div>
                              <div className='flex items-center'>
                                <Checkbox onChange={(e) => setMoreinventory(prevValue => !prevValue)} size='sm' value='moreinventory'>Inventario grande</Checkbox>
                                <p className='text-xs ml-1 text-green-500 inter600'>+500</p>
                              </div>
                              <div className='flex items-center'>
                                <Checkbox onChange={(e) => setParking(prevValue => !prevValue)} size='sm' value='parking'>Estacionamiento</Checkbox>
                                <p className='text-xs ml-1 text-green-500 inter600'>+500</p>
                              </div>
                              <div className='flex items-center'>
                                <Checkbox onChange={(e) => setCctv(prevValue => !prevValue)} size='sm' value='cctv'>Camaras de vigilancia</Checkbox>
                                <p className='text-xs ml-1 text-green-500 inter600'>+500</p>
                              </div>
                            </CheckboxGroup>
                          </div>
                          :
                          <>
                          </>
                        }
                    </div>
                    <div className='flex items-center justify-start flex-col w-full mt-2'>
                        <Button color="primary" variant="ghost" className='rounded-md w-full inter400' onClick={() => {handleAddCart(currentProduct.id)}}>Añadir al carrito</Button>
                        <Button color="primary" variant="solid" className='mt-2 rounded-md inter400 w-full'>Comprar ahora</Button>
                    </div>
                </div>
            </div>
            </div>
            <div className='m-auto mt-[14rem] max-sm:mt-5 flex flex-col w-[56%] max-sm:w-11/12 max-sm:mb-5'>
                <div className='mt-10 h-14 flex items-center border-1 border-gray-400 justify-between max-sm:w-11/12 max-sm:m-auto'>
                  <h1 className='font-bold text-4xl inter ml-2 max-md:text-3xl'>MAS PRODUCTOS</h1>
                </div>
                <div className='mb-10 flex justify-center max-xl:flex max-xl:flex-col max-sm:w-11/12 max-sm:m-auto'>
                  <SectionProduct       
                    filterOptions={{
                      minPrice: 0,
                      maxPrice: 250000,
                      orderBy: [{ type: 'rating', order: 'des' }],
                      max: 4,
                      filters: {
                        type: ['vip']
                      }
                    }}
                    productos={productos}
                  />  
                </div>
            </div>
            <Footer/>
        </>
    }
    </>
  )
}

export default Productpage