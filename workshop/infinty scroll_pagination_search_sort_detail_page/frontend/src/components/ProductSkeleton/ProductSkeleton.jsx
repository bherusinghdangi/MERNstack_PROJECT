import React from 'react';
import './ProductSkeleton.css';

const ProductSkeleton = ({ type = 'card' }) => {
  if (type === 'table-row') {
    return (
      <tr className="skeleton-row">
        <td><div className="skeleton skeleton-text"></div></td>
        <td><div className="skeleton skeleton-price"></div></td>
        <td><div className="skeleton skeleton-text"></div></td>
        <td><div className="skeleton skeleton-text small"></div></td>
      </tr>
    );
  }

  return (
    <div className="product-card skeleton-card">
      <div className="skeleton skeleton-image"></div>
      <div className="product-info">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-price-tag"></div>
        <div className="skeleton skeleton-description"></div>
        <div className="skeleton skeleton-description last"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
