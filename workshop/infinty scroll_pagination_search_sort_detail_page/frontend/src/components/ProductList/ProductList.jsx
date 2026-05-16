import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import ProductCard from '../ProductCard';
import ProductSkeleton from '../ProductSkeleton';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  
  const observer = useRef();
  
  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchProducts = async (isNewSearch = false) => {
    setLoading(true);
    try {
      const currentPage = isNewSearch ? 1 : page;
      const response = await axios.get(`http://localhost:5000/api/products`, {
        params: {
          page: currentPage,
          limit: 10,
          search: search
        }
      });
      
      if (isNewSearch) {
        setProducts(response.data.products);
      } else {
        setProducts(prevProducts => [...prevProducts, ...response.data.products]);
      }
      
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination
  useEffect(() => {
    if (page > 1) {
      fetchProducts(false);
    }
  }, [page]);

  // Handle instant search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchProducts(true);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="product-list-container">
      <div className="list-header">
        <h1>Product Discovery</h1>
        <div className="search-box">
          <input 
            type="text" 
            className="search-input"
            placeholder="Search all products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="product-grid">
        {products.map((product, index) => {
          const isLast = products.length === index + 1;
          return (
            <div ref={isLast ? lastProductElementRef : null} key={`${product._id}-${index}`}>
              <ProductCard product={product} />
            </div>
          );
        })}
        
        {/* Show skeletons while loading */}
        {loading && Array(4).fill(0).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
      
      {!hasMore && products.length > 0 && <div className="no-more">You've reached the end!</div>}
      {!loading && products.length === 0 && search && (
        <div className="no-results">No products found matching "{search}"</div>
      )}
    </div>
  );
};

export default ProductList;
