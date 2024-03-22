import React, { useEffect, useState } from "react";
import { Navbar, NavbarBrand, Link, Button, Switch, NavbarContent, NavbarItem, NavbarMenuToggle, Input, NavbarMenu,  NavbarMenuItem, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar} from "@nextui-org/react";
import { BsCart } from 'react-icons/bs';
import { BiSearchAlt2, BiSolidMoon, BiSolidSun } from 'react-icons/bi';
import {supabase} from '../api/supabase';
import showNotification from "../helpers/notification";
import { useNavigate } from 'react-router-dom';

function NavegationBar(currentPage) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [email, setEmail] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const navigate = useNavigate();

  useEffect(()=>{
    const {data:authListener} = supabase.auth.onAuthStateChange(async (event,session) => {
      if(session){
        setEmail(session.user.email)
        setPhotoUrl(session.user.user_metadata.avatar_url)
      }
      setLoading(false)
    })
  },[])

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    showNotification("Cerrando sesion", 'success')
    navigate('/login')
  }

  const search = () => {
    navigate(`/products?search?=${searchText}`)
  }

  let currentSection = currentPage.currentPage.split('5173')[1] || currentPage.currentPage.split('.com.ar')[1]
  if(currentSection.split('?search')[0]){
    currentSection = currentSection.split('?search')[0]
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

  return (
    <Navbar
      maxWidth="full"
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          'w-full',
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
      onMenuOpenChange={setIsMenuOpen}
      isBordered 
      isBlurred={false}>

      <NavbarItem className="w-1/12">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Cerrar menu" : "Abrir menu"}
          className="md:hidden"
        />
        <NavbarBrand className="flex justify-center">
          <img className='w-[150px] max-md:hidden' src="/logoTextBlack.webp" alt="" />
        </NavbarBrand>
      </NavbarItem>

      <NavbarItem className="hidden lg:flex gap-4 w-4/12">
        <Input
          isClearable
          onKeyDown={handleKeyPress}
          classNames={{
            base: "max-w-full h-4/6 ",
            input: "text-small",
            label: "text-xs",
            inputWrapper: "rounded-md h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          startContent={<BiSearchAlt2 className="text-xl hover:cursor-pointer" onClick={search}/>}
          placeholder="Buscar"
          size="lg"
          label="Barra de busqueda"
          onClear={() => setSearchText('')}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </NavbarItem>

      <NavbarContent className="hidden md:flex gap-4" justify="center">
      {
          currentSection === '/' ?
          <NavbarItem isActive>
            <Link href="/">
              Inicio
            </Link>
          </NavbarItem>
          :
          <NavbarItem>
            <Link color="foreground" href="/">
            Inicio
            </Link>
          </NavbarItem>
        }
        {
          currentSection === '/products' ?
          <NavbarItem isActive>
            <Link href="/products">
              Productos
            </Link>
          </NavbarItem>
          :
          <NavbarItem>
            <Link color="foreground" href="/products">
            Productos
            </Link>
          </NavbarItem>
        }
        
      </NavbarContent>

      {
        loading == false ? 
        <>
        {
        email != null ? 
        <>
          <NavbarContent as="div" className="items-center max-md:w-screen flex" justify="end">
            
            <div className="cursor-pointer mr-2" onClick={() => navigate('/cart')}>
              <BsCart size={25}/>
            </div>
    
            <Dropdown placement="bottom-end" closeOnSelect={false}>
              <DropdownTrigger className="gap-4 hidden md:flex">
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="primary"
                  size="sm"
                  src={photoUrl}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Iniciaste sesion como</p>
                  <p className="font-semibold">{email}</p>
                </DropdownItem>
                {
                  email === (import.meta.env.VITE_REACT_APP_ADMIN_EMAIL || import.meta.env.VITE_REACT_APP_ADMIN_EMAIL2) ? 
                  <DropdownItem onClick={() => navigate('/admin')} key="panel">Panel de administracion</DropdownItem>
                  :
                  ""
                }
                <DropdownItem onClick={() => navigate('/orders')} key="order">Ordenes</DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={logout}>
                  Cerrar sesion
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        </> 
        : 
        <>
        {
          currentSection == '/login' ? <></>:
          <NavbarContent justify="end" className="items-center max-md:w-screen"> 
            <NavbarItem className="flex justify-end">
              <Button as={Link} color="primary" href="/login" variant="ghost">
                Iniciar sesion
              </Button>
            </NavbarItem>
          </NavbarContent>
        
        }
        </>
        }
        </>:<></>
      }
      
      <NavbarMenu>
        <NavbarMenuItem>
          <Link color="foreground" className="w-full" href="/" size="lg">Inicio</Link>
        </NavbarMenuItem>
        {
          email === (import.meta.env.VITE_REACT_APP_ADMIN_EMAIL || import.meta.env.VITE_REACT_APP_ADMIN_EMAIL2) ?
          <NavbarMenuItem>
            <Link color="foreground" className="w-full" href="/admin" size="lg">Panel de administracion</Link>
          </NavbarMenuItem>
          :<></>
        }
        <NavbarMenuItem>
          <Link color="foreground" className="w-full" href="/products" size="lg">Productos</Link>
        </NavbarMenuItem>
        {
          email !== null ? 
          <>
            <NavbarMenuItem>
              <Link color="foreground" className="w-full" href="/orders" size="lg">Ordenes</Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link color="danger" className="w-full" onClick={logout} size="lg">Cerrar sesion</Link>
            </NavbarMenuItem>
          </> 
          : 
          <>
          </>
        }
      </NavbarMenu>
    </Navbar>
  );
}

export default NavegationBar