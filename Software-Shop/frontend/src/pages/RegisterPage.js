import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, values);
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      message.error(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', background: '#fff', padding: 32, borderRadius: 8 }}>
      <h2>Đăng ký</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Nhập email hợp lệ!' }]}> <Input /> </Form.Item>
        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }]}> <Input.Password /> </Form.Item>
        <Form.Item name="name" label="Tên hiển thị" rules={[{ required: true, message: 'Nhập tên!' }]}> <Input /> </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>Đăng ký</Button>
        <div style={{ marginTop: 16 }}>
          <a href="/login">Đã có tài khoản? Đăng nhập</a>
        </div>
      </Form>
    </div>
  );
};

export default RegisterPage;
