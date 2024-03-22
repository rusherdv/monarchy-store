import React,{useState} from 'react'
import {Accordion, AccordionItem, Button, Checkbox, Divider, Progress, Input} from "@nextui-org/react";

const Filter = ({ filterOptions, onFilterChange }) => {

  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(250000)
  const [typeSelected, setTypeSelected] = useState([])
  const [orderSelected, setOrderSelected] = useState([])
  const [filterOpened, setFilterOpened] = useState(true)

  const handleMinPrice = (e) => {
    const newMinPrice = e.target.value;
    onFilterChange({
      ...filterOptions,
      minPrice: newMinPrice,
    });
    setMinPrice(newMinPrice);
  };
  
  const handleMaxPrice = (e) => {
    const newMaxPrice = e.target.value;
    onFilterChange({
      ...filterOptions,
      maxPrice: newMaxPrice,
    });
    setMaxPrice(newMaxPrice);
  };

  const handleTypeFilters = (e) => {
    const selectedType = e.target.value;
    setTypeSelected((prevTypes) => {
      if (prevTypes.includes(selectedType)) {
        const updatedTypes = prevTypes.filter((type) => type !== selectedType);
        onFilterChange({
          ...filterOptions,
          filters: {
            type: updatedTypes,
          },
        });
        return updatedTypes;
      } else {
        const updatedTypes = [...prevTypes, selectedType];
        onFilterChange({
          ...filterOptions,
          filters: {
            type: updatedTypes,
          },
        });
        return updatedTypes;
      }
    });
  };

  const handleTypeOrder = (e) => {
    const selectedType = e.target.name;
    const selectedOrder = e.target.value;
    if (orderSelected.length === 0) {
      onFilterChange({
        ...filterOptions,
        orderBy: [
          { type: 'rating', order: 'des' }
        ],
      });
      setOrderSelected([selectedType]);
    } else {
      onFilterChange({
        ...filterOptions,
        orderBy: [
          { type: selectedType, order: selectedOrder }
        ],
      });
      setOrderSelected([selectedType]);
    }
  };
  
  const cleanFilters = () => {
    onFilterChange({
      minPrice: 0,
      maxPrice: 10000,
      orderBy: [
        {type: 'rating', order: 'des'}
      ],
      max: 0,
      filters: {},
      search: ''
    });
  }

  return (
    <>
    <div className='h-auto w-[300px] border-1 hidden max-xl:flex flex-col items-center justify-between fixed left-6 border-gray-400 max-xl:w-11/12 max-xl:left-0 max-xl:relative max-md:w-11/12'>
        <Accordion >
        <AccordionItem key="1" aria-label="Accordion 1" title="Filtro" className='pl-3 pr-3 font-bold text-xl inter'>
        <div className='w-full flex flex-col items-center'>
            <h1 className='inter text-3xl mt-5 '>Filtros</h1>
            <div className='w-10/12 mt-10 inter400 mb-10 '>
              <Accordion variant='light' isCompact>
                  <AccordionItem key="1" aria-label="Tipo" title="Tipo">
                    <div className='text-xs flex items-center justify-between mb-1'>Armas<Checkbox name='type' value='weapon' onChange={handleTypeFilters} className='mr-0'/></div>
                    <Divider className="my-2" />
                    <div className='text-xs flex items-center justify-between mb-1'>Kit de armas<Checkbox name='type' value='weapon-kit' onChange={handleTypeFilters} className='mr-0'/></div>
                    <Divider className="my-2" />
                    <div className='text-xs flex items-center justify-between mb-1'>Packs<Checkbox name='type' value='pack' onChange={handleTypeFilters} className='mr-0'/></div>
                    <Divider className="my-2" />
                    <div className='text-xs flex items-center justify-between mb-1'>Vehiculos<Checkbox name='type' value='car' onChange={handleTypeFilters} className='mr-0'/></div>
                    <Divider className="my-2" />
                    <div className='text-xs flex items-center justify-between mb-1'>Facciones<Checkbox name='type' value='faccion' onChange={handleTypeFilters} className='mr-0'/></div>
                    <Divider className="my-2" />
                    <div className='text-xs flex items-center justify-between mb-1'>Monedas VIP<Checkbox name='type' value='coins' onChange={handleTypeFilters} className='mr-0'/></div>
                    <Divider className="my-2" />
                    <div className='text-xs flex items-center justify-between mb-1'>Dinero<Checkbox name='type' value='money' onChange={handleTypeFilters} className='mr-0'/></div>
                    <Divider className="my-2" />
                    <div className='text-xs flex items-center justify-between mb-1'>Dinero en negro<Checkbox name='type' value='blackmoney' onChange={handleTypeFilters} className='mr-0'/></div>
                  </AccordionItem>
                  <AccordionItem key="4" aria-label="Ordenar" title="Ordenar">
                    <div className='text-xs flex items-center justify-between mb-1'>Mas popular<Checkbox defaultSelected name='rating' value='des' onChange={handleTypeOrder} className='mr-0'/></div>
                    <Divider className="my-2" />
                    <div className='text-xs flex items-center justify-between mb-1'>Menor precio<Checkbox name='price' value='asc' onChange={handleTypeOrder} className='mr-0'/></div>
                    <Divider className="my-2" />
                    <div className='text-xs flex items-center justify-between mb-1'>Mayor precio<Checkbox name='price' value='des' onChange={handleTypeOrder} className='mr-0'/></div>
                  </AccordionItem>
                </Accordion>
            </div>
        </div>
        </AccordionItem>
        </Accordion>
    </div>
    <div className='h-auto w-[320px] border-1 flex flex-col items-center justify-between fixed left-6 border-gray-400 max-xl:hidden'>
        <div className='w-full flex flex-col items-center'>
            <h1 className='inter text-3xl mt-5 '>Filtros</h1>
            <div className='w-10/12 mt-10 inter400 mb-10 '>
                <Accordion variant='light' isCompact>
                  <AccordionItem key="1" aria-label="Tipo" title="Tipo">
                    <div className='text-xs flex items-center justify-between mb-1'>Armas<Checkbox name='type' value='weapon' onChange={handleTypeFilters} className='mr-0'/></div>
                    <Divider className="my-2" />
                    <div className='text-xs flex items-center justify-between mb-1'>Kit de armas<Checkbox name='type' value='weapon-kit' onChange={handleTypeFilters} className='mr-0'/></div>
                    <Divider className="my-2" />
                    <div className='text-xs flex items-center justify-between mb-1'>Packs<Checkbox name='type' value='pack' onChange={handleTypeFilters} className='mr-0'/></div>
                    <Divider className="my-2" />
                    <div className='text-xs flex items-center justify-between mb-1'>Vehiculos<Checkbox name='type' value='car' onChange={handleTypeFilters} className='mr-0'/></div>
                    <Divider className="my-2" />
                    <div className='text-xs flex items-center justify-between mb-1'>Facciones<Checkbox name='type' value='faccion' onChange={handleTypeFilters} className='mr-0'/></div>
                    <Divider className="my-2" />
                    <div className='text-xs flex items-center justify-between mb-1'>Monedas VIP<Checkbox name='type' value='coins' onChange={handleTypeFilters} className='mr-0'/></div>
                    <Divider className="my-2" />
                    <div className='text-xs flex items-center justify-between mb-1'>Dinero<Checkbox name='type' value='money' onChange={handleTypeFilters} className='mr-0'/></div>
                    <Divider className="my-2" />
                    <div className='text-xs flex items-center justify-between mb-1'>Dinero en negro<Checkbox name='type' value='blackmoney' onChange={handleTypeFilters} className='mr-0'/></div>
                  </AccordionItem>
                  <AccordionItem key="4" aria-label="Ordenar" title="Ordenar">
                    <div className='text-xs flex items-center justify-between mb-1'>Mas popular<Checkbox defaultSelected name='rating' value='des' onChange={handleTypeOrder} className='mr-0'/></div>
                    <Divider className="my-2" />
                    <div className='text-xs flex items-center justify-between mb-1'>Menor precio<Checkbox name='price' value='asc' onChange={handleTypeOrder} className='mr-0'/></div>
                    <Divider className="my-2" />
                    <div className='text-xs flex items-center justify-between mb-1'>Mayor precio<Checkbox name='price' value='des' onChange={handleTypeOrder} className='mr-0'/></div>
                  </AccordionItem>
                </Accordion>
            </div>
        </div>    
    </div>
    </>
  )
}

export default Filter