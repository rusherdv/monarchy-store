import React, {useState, useEffect} from 'react'
import { Button, Spinner, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import NavegationBar from '../components/navbar'
import {supabase} from '../api/supabase';
import showNotification from '../helpers/notification';
import getDataAPI from '../helpers/apiconnections'

const AdminCreateProductPage = () => {
    const [currentProduct, setCurrentProduct] = useState({})
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState({})
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const [img, setImage] = useState('');
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [type, setType] = useState('');
    const [comando, setComando] = useState('');

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
    }, []);

    const handleCreateProduct = async () => {

        const data = await getDataAPI('createproduct', "POST", {
            product: {
                "name": name,
                "type": type,
                "desc": desc,
                "contain": comando,
                "rating": 5,
                "price": price,
                "quantity": 1,
                "discount": discount,
                "image_url": img
            }
        }, session.access_token)
        
        if (data) {
            showNotification('Producto creado con exito!', 'success')
            setTimeout(() => {
                navigate('/admin/products')
            }, 2000);
        }

    }

    const secureModal = async () => {

        if((img.trim() == '')||(name.trim() == '')||(desc.trim() == '')||(type.trim() == '')||(comando.trim() == '')){
            showNotification("Ningun espacio puede estar vacio", 'error')
            return
        }

        onOpen()
    }

    return (
        <div className='h-screen'>
            <NavegationBar currentPage={window.location.href}/>
            {
                loading === false ? 
                <div className='flex items-center justify-center h-[90%] flex-col w-full m-auto'>
                    <h1 className='inter600 text-5xl mb-5 mt-5'>Crear Producto</h1>
                    <div className='w-5/12 rounded-md h-auto mt-2 mb-4 pb-4 border-2 border-default-300 flex flex-col justify-between overflow-y-auto max-lg:w-11/12 max-md:w-full max-md:border-none '>
                        <div className='w-11/12 mt-5 ml-5'>
                            <h1 className='inter400 text-lg'>Imagen</h1>
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
                        <div className='w-11/12 ml-5 flex justify-around items-center h-10 mt-5 '>
                            <Button color="primary" variant="shadow" radius='sm' onClick={secureModal} className='inter400 w-11/12'>Crear</Button>
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
                            <ModalHeader className="flex flex-col gap-1">Crear producto</ModalHeader>
                            <ModalBody>
                              <p> 
                                Estas seguro que deseas crear el producto?
                              </p>
                            </ModalBody>
                            <ModalFooter>
                              <Button color="danger" variant="shadow" onPress={onClose}>
                                Cancelar
                              </Button>
                              <Button color="primary" variant="shadow" onPress={() => {onClose();handleCreateProduct()}}>
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

export default AdminCreateProductPage