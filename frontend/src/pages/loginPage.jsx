import React,{ useState, useEffect } from 'react'
import {supabase} from '../api/supabase';
import NavegationBar from '../components/navbar';
import { useNavigate } from 'react-router-dom';

const Loginpage = () => {
  const navigate = useNavigate();

  useEffect(()=>{
    const {data:authListener} = supabase.auth.onAuthStateChange(async (event,session) => {
      if(session){
        navigate('/')
      }
    })
  },[])

  const handleLoginGoogle = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google'
        })
    } catch (error) {
        console.log(error)
    }
  }

  const handleLoginDiscord = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'discord'
        })
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className='w-100[vw] h-[100vh] flex flex-col items-center'>
        <NavegationBar currentPage={window.location.href}/>
        <div className='h-full flex flex-col items-center justify-center w-full'>
          <div className='border-2 p-16 rounded-lg flex flex-col items-center max-sm:w-full max-sm:border-none max-sm:p-0'>
            <div className='flex items-center'>
              <h1 className='inter400 text-black text-3xl ml-2'>Iniciar sesion</h1>
            </div>
            <div className='flex flex-col w-96 mt-5 max-sm:w-11/12'>
              <button type="button" onClick={handleLoginGoogle} className="text-white bg-[#0057e7] hover:bg-[#0057e7]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mb-2">
                <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                  <path d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"/>
                </svg>
                Iniciar sesion con Google
              </button>
              <button type="button" onClick={handleLoginDiscord} className="text-white bg-[#7289da] hover:bg-[#7289da]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mb-2">
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                <path fill="#ffffff" d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z"/>
              </svg>
                Iniciar sesion con Discord
              </button>
              <p className='inter400 text-sm'>Aun no tienes cuenta? <span className='hover:underline hover:cursor-pointer'>Registrate</span></p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Loginpage