import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Product } from './product';

const SectionProduct = React.memo(({ filterOptions, productos }) => {

  const calculateFinalPrice = useCallback((product) => {
    return product && product.price ? product.price - (product.discount * product.price) / 100 : 0;
  })

  const filterProducts = useMemo(() => {
    if (!productos || !productos.length) {
      return [];
    }

    const searchTerm = decodeURIComponent(window.location.href.split('/products?search?=')[1]).toLowerCase();
    const typeFilters = Array.isArray(filterOptions.filters?.type) ? filterOptions.filters.type : [];
    const orderBy = filterOptions.orderBy && filterOptions.orderBy[0];

    const filteredProducts = productos.filter((product) => {
      const productName = product.name.toLowerCase();
      const typeName = product.type.toLowerCase();
      const typeMatches = typeFilters.length === 0 || typeFilters.includes(product.type);

      if (searchTerm !== 'undefined') {
        const nameMatches = productName.includes(searchTerm) || typeName.includes(searchTerm);
        return nameMatches && typeMatches;
      }

      return typeMatches;
    });

    const sortedProducts = filteredProducts.sort((a, b) => {
      const finalPriceA = calculateFinalPrice(a);
      const finalPriceB = calculateFinalPrice(b);

      if (orderBy.type === 'price') {
        return orderBy.order === 'asc' ? finalPriceA - finalPriceB : finalPriceB - finalPriceA;
      } else if (orderBy.type === 'rating') {
        return orderBy.order === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      }

      return 0;
    });

    const maxProducts = filterOptions.max || Infinity;
    const limitedProducts = sortedProducts.slice(0, maxProducts);

    return limitedProducts;
  }, [productos, filterOptions, calculateFinalPrice]);

  return (
    <div className="w-full flex flex-wrap justify-start gap-6 max-sm:justify-center">
      {filterProducts.map((product, index) => (
        <Product
          key={product.id}
          id={product.id}
          name={product.name}
          type={product.type}
          rating={product.rating}
          desc={product.desc}
          img={product.image_url}
          price={product.price}
          discount={product.discount}
        />
      ))}
    </div>
  );
})

export { SectionProduct };
