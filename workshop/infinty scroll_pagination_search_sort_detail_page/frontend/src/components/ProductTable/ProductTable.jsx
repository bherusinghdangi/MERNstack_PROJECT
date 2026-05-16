import React, { useState, useEffect, useMemo } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import ProductSkeleton from '../ProductSkeleton';
import "./ProductTable.css";

const ProductTable = () => {
  const [products, setProducts] = useState([]); // Raw data from API
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Client-side only states
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(""); 
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/products`, {
        params: {
          page,
          limit,
        },
      });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit]);

  const displayedProducts = useMemo(() => {
    let filtered = products.filter((p) => {
      const searchTerm = search.toLowerCase();
      const nameMatch = (p.name || "").toLowerCase().includes(searchTerm);
      const descMatch = (p.description || "").toLowerCase().includes(searchTerm);
      const priceMatch = p.price.toString().includes(searchTerm);
      return nameMatch || descMatch || priceMatch;
    });

    if (sortBy) {
      filtered.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (typeof valA === "string") {
          return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        }
      });
    }
    return filtered;
  }, [products, search, sortBy, sortOrder]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
    setSearch(""); 
  };

  return (
    <div className="product-table-container">
      <div className="table-header-section">
        <div className="header-left">
          <h2>Product Inventory </h2>
          <div className="per-page-selector">
            <label>Show </label>
            <select value={limit} onChange={handleLimitChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span> items per page</span>
          </div>
        </div>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search within this page..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-card">
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort("name")}>
                  Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => toggleSort("price")}>
                  Price {sortBy === "price" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th>Description</th>
                <th onClick={() => toggleSort("createdAt")}>
                  Date Added {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Show 5 skeleton rows while loading
                Array(limit).fill(0).map((_, i) => (
                  <ProductSkeleton key={i} type="table-row" />
                ))
              ) : displayedProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "3rem" }}>
                    No matches found on this page.
                  </td>
                </tr>
              ) : (
                displayedProducts.map((product) => (
                  <tr key={product._id}>
                    <td style={{ fontWeight: "500" }}>
                      <Link to={`/product/${product._id}`} className="table-link">
                        {product.name}
                      </Link>
                    </td>
                    <td>
                      <span className="price-tag">${product.price.toFixed(2)}</span>
                    </td>
                    <td style={{ color: "#64748b" }}>{product.description}</td>
                    <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-footer">
          <div className="pagination-info">Total in DB: {totalItems}</div>
          <div className="pagination-controls">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous Page
            </button>
            <span style={{ margin: "0 10px", fontSize: "0.875rem" }}>
              Page {page} of {totalPages}
            </span>
            <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Next Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
