import React, {useState, useEffect} from 'react'
import { Button, Spinner, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import NavegationBar from '../components/navbar'
import {supabase} from '../api/supabase';
import showNotification from '../helpers/notification';
import getDataAPI from '../helpers/apiconnections'

const AdminEditProductPage = () => {
    const [currentProduct, setCurrentProduct] = useState({})
    const [loading, setLoading] = useState(true)
    const [img, setImage] = useState('');
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [type, setType] = useState('');
    const [comando, setComando] = useState('');
    const [session, setSession] = useState({})
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    
    const navigate = useNavigate();

    useEffect(() => {

        const {data:authListener} = supabase.auth.onAuthStateChange(async (event,session) => {
            if(session){
                if(!(session.user.email == import.meta.env.VITE_REACT_APP_ADMIN_EMAIL || session.user.email == import.meta.env.VITE_REACT_APP_ADMIN_EMAIL2)){
                navigate('/')
              }
              setSession(session)
              setLoading(false)
            }else{
              navigate('/')
            }
        })


        
        const getProducts = async () => {
          try {
            const data = await getDataAPI('products', "GET", {})
            if (data) {
                const productoEncontrado = data.products.find(product => product.id == window.location.href.split('/admin/editproduct/')[1])
                setCurrentProduct(productoEncontrado)
                setImage(productoEncontrado.image_url || '');
                setName(productoEncontrado.name || '');
                setDesc(productoEncontrado.desc || '');
                setPrice(productoEncontrado.price || 0);
                setDiscount(productoEncontrado.discount || 0);
                setType(productoEncontrado.type || '');
                setComando(productoEncontrado.contain || '');
                setLoading(false)
            }
            setLoading(false)
          } catch (error) {
            console.log(error)
          }
        };
      
        getProducts();
    }, []);

    const handleEditProduct = async () => {
        if((img.trim() == '')||(name.trim() == '')||(desc.trim() == '')||(type.trim() == '')||(comando.trim() == '')){
            showNotification("Ningun espacio puede estar vacio", 'error')
            return
        }
        
        const data = await getDataAPI('editproduct', "POST", {
            product: {
                "id": currentProduct.id,
                "name": name,
                "type": type,
                "desc": desc,
                "contain": comando,
                "rating": currentProduct.rating,
                "price": price,
                "quantity": 1,
                "discount": discount,
                "image_url": img
            }
        }, session.access_token)
        
        if (data) {
            showNotification('Producto editado con exito!', 'success')
            setTimeout(() => {
                navigate('/admin/products')
            }, 2000);
        }
    }

    const handleDeleteProduct = async () => {

        const data = await getDataAPI('deleteproduct', "POST", {
            product: {
                "id": currentProduct.id
            }
        }, session.access_token)
        
        if (data) {
            showNotification('Producto eliminado con exito!', 'success')
            setTimeout(() => {
                navigate('/admin/products')
            }, 2000);
        }
    }

    const secureModal = async () => {
        onOpen()
    }

    return (
        <div className='h-screen'>
            <NavegationBar currentPage={window.location.href}/>
            {
                loading === false ? 
                <div className='flex items-center justify-center h-[90%] flex-col w-full m-auto'>
                    <h1 className='inter600 text-5xl mb-5 mt-5'>Editar Producto</h1>
                    <div className='w-5/12 rounded-md h-auto mt-2 mb-4 pb-4 border-2 border-default-300 flex flex-col justify-start overflow-y-auto max-lg:w-11/12 max-md:w-full max-md:border-none '>
                        <div className='w-11/12 mt-5 ml-5'>
                            <h1 className='inter400 text-lg'>Imagen</h1>
                            <img src={`${import.meta.env.VITE_REACT_APP_BACKEND_IP}/${currentProduct.image_url}`} className='w-32 h-32 object-contain' alt="" />
                            <div className='flex items-center mt-2'>
                                <Input value={img} onChange={(e) => setImage(e.target.value)} placeholder='Imagen' variant='bordered' className='w-full text-black'/>
                            </div>
                        </div>
                        <div className='w-11/12 mt-5 ml-5'>
                            <h1 className='inter400 text-lg'>Nombre</h1>
                            <div className='flex items-center mt-2'>
                                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='Nombre' variant='bordered' className='w-full text-black'/>
                            </div>
                        </div>
                        <div className='w-11/12 mt-5 ml-5'>
                            <h1 className='inter400 text-lg'>Descripcion</h1>
                            <div className='flex items-center mt-2'>
                                <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder='Descripcion' variant='bordered' className='w-full text-black'/>
                            </div>
                        </div>
                        <div className='flex w-11/12 mt-5 ml-5 justify-between'>
                            <div className='w-11/12'>
                                <h1 className='inter400 text-lg'>Precio</h1>
                                <div className='flex items-center mt-2'>
                                    <Input value={price} onChange={(e) => setPrice(parseInt(e.target.value))} placeholder='Precio' type='number' variant='bordered' className='w-full text-black'/>
                                </div>
                            </div>
                            <div className='w-11/12 ml-5'>
                                <h1 className='inter400 text-lg'>Descuento</h1>
                                <div className='flex items-center mt-2'>
                                    <Input value={discount} onChange={(e) => setDiscount(parseInt(e.target.value))} placeholder='Descuento' type='number' variant='bordered' className='w-full text-black'/>
                                </div>
                            </div>
                        </div>
                        <div className='flex w-11/12 mt-5 ml-5 justify-between'>
                            <div className='w-11/12'>
                                <h1 className='inter400 text-lg'>Tipo</h1>
                                <div className='flex items-center mt-2'>
                                    <Input value={type} onChange={(e) => setType(e.target.value)} placeholder='Tipo' variant='bordered' className='w-full text-black'/>
                                </div>
                            </div>
                            <div className='w-11/12 ml-5'>
                                <h1 className='inter400 text-lg'>Comando</h1>
                                <div className='flex items-center mt-2'>
                                    <Input value={comando} onChange={(e) => setComando(e.target.value)} placeholder='Comando' variant='bordered' className='w-full text-black'/>
                                </div>
                            </div>
                        </div>
                        <div className='w-11/12 ml-5 flex justify-around items-center h-10 mt-5'>
                            <Button color="primary" variant="shadow" radius='sm' onClick={handleEditProduct} className='inter400 w-11/12'>Actualizar</Button>
                            <Button color="danger" variant="shadow" radius='sm' onClick={secureModal} className='inter400 w-11/12 ml-5'>Eliminar</Button>
                        </div>
                    </div>
                </div>
                :
                <>
                <div style={{ height: 'calc(100vh - 65px)' }} className='flex justify-center items-center'>
                    <Spinner size="lg"/>
                </div>
                </>
            }
                <>
                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                      <ModalContent>
                        {(onClose) => (
                          <>
                            <ModalHeader className="flex flex-col gap-1">Eliminar producto</ModalHeader>
                            <ModalBody>
                              <p> 
                                Estas seguro que deseas eliminar el producto?
                              </p>
                            </ModalBody>
                            <ModalFooter>
                              <Button color="danger" variant="shadow" onPress={onClose}>
                                Cancelar
                              </Button>
                              <Button color="primary" variant="shadow" onPress={() => {onClose();handleDeleteProduct()}}>
                                Aceptar
                              </Button>
                            </ModalFooter>
                          </>
                        )}
                      </ModalContent>
                    </Modal>
    </>
        </div>
    )
}

export default AdminEditProductPage