import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Image, Typography, Rate, Button, Select, message, Spin } from 'antd';
import axios from 'axios';

const { Title, Paragraph } = Typography;

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variant, setVariant] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
      setProduct(res.data);
      setVariant(res.data.variants?.[0]?.name || '');
    } catch {
      message.error('Không tìm thấy sản phẩm');
    }
    setLoading(false);
  };

  const addToCart = () => {
    // TODO: Gọi API thêm vào giỏ hàng
    message.success('Đã thêm vào giỏ hàng (demo)');
  };

  if (loading || !product) return <Spin />;

  return (
    <Row gutter={32} style={{ padding: 32 }}>
      <Col md={10} xs={24}>
        <Image src={product.images?.[0] || 'https://via.placeholder.com/400'} alt={product.name} width="100%" />
      </Col>
      <Col md={14} xs={24}>
        <Card>
          <Title level={2}>{product.name}</Title>
          <Rate disabled value={product.rating} /> ({product.numReviews || 0} đánh giá)
          <Paragraph>{product.description}</Paragraph>
          <div style={{ margin: '16px 0' }}>
            <b>Chọn gói:</b> <Select value={variant} onChange={setVariant} style={{ minWidth: 120 }} options={product.variants?.map(v => ({ label: v.name + ' - ' + v.price.toLocaleString() + 'đ', value: v.name }))} />
          </div>
          <Button type="primary" size="large" onClick={addToCart}>Thêm vào giỏ hàng</Button>
        </Card>
      </Col>
    </Row>
  );
};

export default ProductDetailPage;
