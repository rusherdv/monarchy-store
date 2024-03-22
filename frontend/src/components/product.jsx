import React,{useState, useEffect, useCallback} from 'react'
import { Button, Input } from "@nextui-org/react";
import { BsFillTrashFill } from 'react-icons/bs'
import { useCartContext } from '../context/cartContext';
import { useNavigate } from 'react-router-dom';
import getDataAPI from '../helpers/apiconnections'

const Product = ({id, name, rating, desc, img, price, discount}) => {

    const {addProduct} = useCartContext();
    const [productos, setProductos] = useState([])
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

    const handleRedirect = useCallback(() => {
      navigate(`/product/${id}`);
    }, [id, navigate]);

    const handleAddCart = (product) => {
      addProduct(product, 1);
    }

    const handleBuyNow = (product) => {
      addProduct(product, 1);
      navigate('/cart')
    }

  return (
    <>
    <div className='w-fit mt-2 hover:cursor-pointer border-1 hover:border-gray-300' key={id}>
        <div className='relative'>
            <img loading="lazy" onClick={handleRedirect} src={`${import.meta.env.VITE_REACT_APP_BACKEND_IP}/${img}`} className='w-60 h-40 p-5 object-contain'/>
        </div>
        <div className='ml-3 mb-1'>
            <p className='inter400' onClick={handleRedirect}>{name}</p>
            <p className='inter400 text-gray-400 text-sm max-w-[220px] truncate'>{desc}</p>
            {
              discount == 0 ? 
              <p className='text-xl inter400' onClick={handleRedirect}>${price}</p>:
              <div className='flex items-center'>
                  <p className='text-md text-gray-600 inter400 line-through' onClick={handleRedirect}>${price}</p>
                  <p className='text-xl inter400 ml-1'>${(price)-((discount * price)/100)}</p>
                  <div className='bg-green-600 rounded-sm ml-1 flex justify-center items-center'>
                    <p className='inter600 text-md pl-1 pr-2 text-white'>%{discount} OFF</p>
                  </div>
              </div>
            }
        </div>
        <div className='flex items-center justify-start flex-col w-11/12 mb-3 m-auto'>
            <Button color="primary" variant="ghost" className='rounded-none w-full inter400' onClick={() => {handleAddCart(productos.find(product => product.id == id))}}>Añadir al carrito</Button>
            <Button color="primary" variant="solid" className='mt-2 rounded-none inter400 w-full' onClick={() => {handleBuyNow(productos.find(product => product.id == id))}}>Comprar ahora</Button>
        </div>
    </div>
    </>
  )
}

const ProductCart = ({product}) => {

    const [cantidad, setCantidad] = useState(product.quantity);
    const [productCart, setProductCart] = useState(null);
    const {removeProduct, removeProductCart, addProductCart, cart} = useCartContext();
    const navigate = useNavigate();

    useEffect(() => {
      if (cart && cart.length > 0) {
        const productosFiltrados = cart.filter(
          (producto) => producto.id === product.id
        );
        if (productosFiltrados.length > 0) {
          setProductCart(productosFiltrados[0]);
        }
      }
    }, [product])

    useEffect(() => {
        setCantidad(cantidad)
    }, [cantidad])

    const handleRemoveCart = (id) => {
        removeProduct(id)
    }
  
    
  return (
    <>
    <div className='mt-2 border-2 flex items-center w-[97%] max-md:w-[94%] ml-3 mr-3 h-unit-4xl rounded-lg relative' key={product.id}>
        {
            productCart && (
                <>
                <div className='h-5/6 w-full flex justify-around items-center max-md:hidden'>
                    <div className='flex items-center'>
                        <div className='relative'>
                          
                            <img loading="lazy" src={`${import.meta.env.VITE_REACT_APP_BACKEND_IP}/${productCart.image_url}`} className='w-20 h-20 object-contain'/>
                        </div>
                        <p className='inter400 w-[120px] hover:underline hover:cursor-pointer ml-10' onClick={() => navigate(`/product/${productCart.id}`)}>{productCart.name}</p>
                    </div>
                    <p className='inter400 text-gray-400 text-sm w-fit flex justify-center'>{productCart.brand}</p>
                    <div>
                        <div className='flex'>
                        <Input
                            type="number"
                            aria-label='minPrice'
                            placeholder="1"
                            className='w-[4.3rem]'
                            min={1}
                            value={cantidad}
                            max={100}
                            onChange={(e) => {                      
                                if(productCart.quantity < e.target.value){
                                    addProductCart(productCart,1)
                                }else if(productCart.quantity > e.target.value){
                                    removeProductCart(productCart,1)
                                }
                                setCantidad(e.target.value)
                            }}
                            startContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">x</span>
                              </div>
                            }
                        />
                        </div>
                    </div>
                    <p className='text-md inter400 font-semibold w-[70px] flex justify-center'>${(productCart.price)-((productCart.discount * productCart.price)/100)}</p>
                    <Button color="danger" className='inter400' variant="solid" onClick={() => {handleRemoveCart(productCart.id)}}>Borrar</Button>
                </div>
                <div className='h-5/6 w-full flex justify-around items-center md:hidden'>
                    <div className='flex items-center'>
                    <div>
                        <p className='inter400 w-[120px] hover:underline hover:cursor-pointer' onClick={() => navigate(`/product/${productCart.id}`)}>{productCart.name}</p>
                        <p className='inter400 text-gray-400 text-sm w-fit flex justify-center'>{productCart.brand}</p>
                    </div>
                    </div>
                    <div>
                        <div className='flex flex-col'>
                        <p className='text-md inter400 font-semibold w-[70px] mb-2'>${(productCart.price)-((productCart.discount * productCart.price)/100)}</p>
                        <Input
                            type="number"
                            aria-label='minPrice'
                            placeholder="1"
                            className='w-[4.3rem]'
                            size='sm'
                            min={1}
                            value={cantidad}
                            max={100}
                            onChange={(e) => {                      
                                if(productCart.quantity < e.target.value){
                                    addProductCart(productCart,1)
                                }else if(productCart.quantity > e.target.value){
                                    removeProductCart(productCart,1)
                                }
                                setCantidad(e.target.value)
                            }}
                            startContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">x</span>
                              </div>
                            }
                        />
                        </div>
                    </div>
                    <div onClick={() => {handleRemoveCart(productCart.id)}} className='border-2 rounded-lg p-2.5 text-red-500 border-red-500 hover:bg-red-500 hover:text-white hover:cursor-pointer'>
                        <BsFillTrashFill/>
                    </div>
                </div>
                </>
            )
        }
    </div>
    </>
  )
}


export {Product, ProductCart}