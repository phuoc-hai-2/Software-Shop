import React, { useEffect, useState } from 'react';
import { Table, Button, InputNumber, message, Popconfirm } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, { headers: { Authorization: `Bearer ${token}` } });
      setCart(res.data);
    } catch {
      setCart({ items: [] });
    }
    setLoading(false);
  };

  const updateQuantity = (index, value) => {
    const items = [...cart.items];
    items[index].quantity = value;
    setCart({ ...cart, items });
  };

  const saveCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_API_URL}/api/cart`, { items: cart.items }, { headers: { Authorization: `Bearer ${token}` } });
      message.success('Cập nhật giỏ hàng thành công');
    } catch {
      message.error('Lỗi khi cập nhật giỏ hàng');
    }
  };

  const removeItem = (index) => {
    const items = cart.items.filter((_, i) => i !== index);
    setCart({ ...cart, items });
  };

  const checkout = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, {}, { headers: { Authorization: `Bearer ${token}` } });
      message.success('Tạo đơn hàng thành công!');
      navigate(`/checkout/${res.data._id}`);
    } catch {
      message.error('Lỗi khi tạo đơn hàng');
    }
  };

  const columns = [
    { title: 'Sản phẩm', dataIndex: ['product', 'name'] },
    { title: 'Gói', dataIndex: 'variant' },
    { title: 'Số lượng', dataIndex: 'quantity', render: (value, _, i) => <InputNumber min={1} value={value} onChange={v => updateQuantity(i, v)} /> },
    { title: 'Giá', dataIndex: ['product', 'price'], render: (v) => v?.toLocaleString() + 'đ' },
    { title: 'Thao tác', render: (_, __, i) => <Popconfirm title="Xóa sản phẩm?" onConfirm={() => removeItem(i)}><Button danger>Xóa</Button></Popconfirm> }
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2>Giỏ hàng</h2>
      <Table rowKey={(_, i) => i} columns={columns} dataSource={cart.items} loading={loading} pagination={false} />
      <div style={{ marginTop: 24, textAlign: 'right' }}>
        <Button type="primary" onClick={saveCart} style={{ marginRight: 8 }}>Lưu giỏ hàng</Button>
        <Button type="primary" onClick={checkout} disabled={!cart.items.length}>Thanh toán</Button>
      </div>
    </div>
  );
};

export default CartPage;
