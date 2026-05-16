import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Product not found');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="detail-loading">Loading product details...</div>;
  if (error) return <div className="detail-error">{error}</div>;

  return (
    <div className="product-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Products
      </button>
      
      <div className="detail-card">
        <div className="detail-image-section">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="detail-info-section">
          <span className="detail-pid">PID: #{product.pid}</span>
          <h1>{product.name}</h1>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          <div className="detail-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          <div className="detail-rating">
            {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
            <span className="rating-text">({product.reviewCount} reviews)</span>
          </div>
          <div className="detail-meta">
            <p><strong>Added on:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
          </div>
          <button className="buy-btn">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
