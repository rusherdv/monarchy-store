import React from 'react';

const Footer = () => {
  return (
    <footer className='bg-black text-white flex justify-center items-center h-unit-2xl max-sm:h-unit-3xl'>
      <div className='w-full flex justify-around items-center text-xs max-sm:flex-col'>
        <div className='w-auto text-gray-400'>
          <a href='' className='mr-4 hover:text-white'>
            Discord
          </a>
          <a href='https://www.tiktok.com/@monarchy.rp' className='mr-4 hover:text-white'>
            Instagram
          </a>
          <a href='fivem://connect/5vj63z' className='hover:text-white'>
            FiveM
          </a>
        </div>
        <div className='flex justify-center text-gray-400 max-sm:mt-4'>
          © 2024 Monarchy. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
