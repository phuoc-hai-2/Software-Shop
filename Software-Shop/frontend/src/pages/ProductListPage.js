import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Input, Select, Rate, Pagination, Spin } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState(0);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [keyword, category, minPrice, maxPrice, rating, page]);

  const fetchCategories = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
    setCategories(res.data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const params = { keyword, category, minPrice, maxPrice, page, limit: 12 };
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`, { params });
    setProducts(res.data);
    setTotal(res.data.length < 12 ? (page - 1) * 12 + res.data.length : page * 12 + 1); // simple estimate
    setLoading(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Input placeholder="Tìm kiếm..." value={keyword} onChange={e => setKeyword(e.target.value)} /></Col>
        <Col span={4}><Select style={{ width: '100%' }} allowClear placeholder="Danh mục" value={category} onChange={setCategory} options={categories.map(c => ({ label: c.name, value: c._id }))} /></Col>
        <Col span={3}><Input placeholder="Giá từ" type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} /></Col>
        <Col span={3}><Input placeholder="Đến" type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} /></Col>
        <Col span={4}><Rate value={rating} onChange={setRating} allowClear /></Col>
      </Row>
      {loading ? <Spin /> : (
        <Row gutter={[16, 16]}>
          {products.map(p => (
            <Col xs={24} sm={12} md={8} lg={6} key={p._id}>
              <Card hoverable cover={<img alt={p.name} src={p.images?.[0] || 'https://via.placeholder.com/300'} onClick={() => navigate(`/product/${p._id}`)} style={{ height: 180, objectFit: 'cover', cursor: 'pointer' }} />}>
                <Meta title={p.name} description={<>
                  <div>Giá: {p.price.toLocaleString()}đ</div>
                  <Rate disabled value={p.rating} /> ({p.numReviews || 0})
                </>} />
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Pagination style={{ marginTop: 24 }} current={page} pageSize={12} onChange={setPage} total={total} showSizeChanger={false} />
    </div>
  );
};

export default ProductListPage;
