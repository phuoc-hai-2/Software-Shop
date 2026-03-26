import React from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const OrderMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Menu
      mode="horizontal"
      selectedKeys={[location.pathname.startsWith('/orders') ? '/orders' : location.pathname]}
      style={{ marginBottom: 24 }}
    >
      <Menu.Item key="/orders" onClick={() => navigate('/orders')}>Lịch sử đơn hàng</Menu.Item>
    </Menu>
  );
};

export default OrderMenu;
