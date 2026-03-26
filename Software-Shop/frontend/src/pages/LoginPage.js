import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, values);
      localStorage.setItem('token', res.data.token);
      message.success('Đăng nhập thành công!');
      navigate('/');
    } catch (err) {
      message.error(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', background: '#fff', padding: 32, borderRadius: 8 }}>
      <h2>Đăng nhập</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Nhập email hợp lệ!' }]}> <Input /> </Form.Item>
        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Nhập mật khẩu!' }]}> <Input.Password /> </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>Đăng nhập</Button>
        <div style={{ marginTop: 16 }}>
          <a href="/register">Chưa có tài khoản? Đăng ký</a>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
