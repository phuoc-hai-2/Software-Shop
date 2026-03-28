# Software-Shop

Ứng dụng **thương mại điện tử full-stack** bán phần mềm / bản quyền.

| Thành phần | Công nghệ |
|---|---|
| Backend | Node.js · Express · MongoDB (Mongoose) |
| Frontend | React 18 · Ant Design · Redux Toolkit |
| Thanh toán | VNPay |
| Xác thực | JWT · bcryptjs |
| Email | Nodemailer |

---

## Yêu cầu hệ thống

| Phần mềm | Phiên bản tối thiểu |
|---|---|
| [Node.js](https://nodejs.org/) | v16 trở lên |
| [MongoDB](https://www.mongodb.com/try/download/community) | v5 trở lên |
| npm | đi kèm Node.js |

> **Ghi chú:** MongoDB có thể chạy local hoặc dùng dịch vụ cloud như [MongoDB Atlas](https://www.mongodb.com/atlas).

---

## Cách chạy dự án

### Bước 1 – Clone mã nguồn

```bash
git clone https://github.com/phuoc-hai-2/Software-Shop.git
cd Software-Shop
```

---

### Bước 2 – Cài đặt & chạy Backend

```bash
# Di chuyển vào thư mục backend
cd Software-Shop/backend

# Cài dependencies
npm install

# Tạo file .env từ file mẫu
cp .env.example .env
```

Mở file `.env` và cập nhật các giá trị phù hợp:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/software-shop
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
VNPay_TMN_CODE=your_vnpay_tmn_code
VNPay_HASH_SECRET=your_vnpay_hash_secret
VNPay_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
CLIENT_URL=http://localhost:3000
```

| Biến | Mô tả |
|---|---|
| `PORT` | Cổng chạy server (mặc định `5000`) |
| `MONGO_URI` | URI kết nối MongoDB |
| `JWT_SECRET` | Chuỗi bí mật dùng ký JWT |
| `EMAIL_USER` | Email dùng gửi thông báo (Gmail) |
| `EMAIL_PASS` | Mật khẩu ứng dụng Gmail ([hướng dẫn](https://support.google.com/accounts/answer/185833)) |
| `VNPay_TMN_CODE` | Mã terminal VNPay |
| `VNPay_HASH_SECRET` | Khóa bí mật VNPay |
| `VNPay_URL` | URL cổng thanh toán VNPay (sandbox hoặc production) |
| `CLIENT_URL` | URL frontend (mặc định `http://localhost:3000`) |

Chạy server ở chế độ **development** (tự restart khi thay đổi code):

```bash
npm run dev
```

Hoặc chạy ở chế độ **production**:

```bash
npm start
```

> Backend sẽ chạy tại **http://localhost:5000**. Truy cập để kiểm tra: `http://localhost:5000` → hiển thị *"API is running"*.

---

### Bước 3 – Cài đặt & chạy Frontend

Mở **terminal mới** (giữ backend đang chạy):

```bash
# Di chuyển vào thư mục frontend
cd Software-Shop/frontend

# Cài dependencies
npm install

# Tạo file .env từ file mẫu
cp .env.example .env
```

Mở file `.env` và cập nhật:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

| Biến | Mô tả |
|---|---|
| `REACT_APP_API_URL` | URL backend API |
| `REACT_APP_VNPAY_URL` | URL cổng thanh toán VNPay |

Chạy frontend:

```bash
npm start
```

> Frontend sẽ chạy tại **http://localhost:3000** và tự mở trình duyệt.

---

### Tóm tắt lệnh chạy

```bash
# Terminal 1 – Backend
cd Software-Shop/backend
npm install
cp .env.example .env   # rồi sửa .env
npm run dev

# Terminal 2 – Frontend
cd Software-Shop/frontend
npm install
cp .env.example .env   # rồi sửa .env
npm start
```

---

## API Endpoints

| Route | Mô tả |
|---|---|
| `GET /` | Health check – *"API is running"* |
| `/api/auth` | Đăng ký, đăng nhập, quên mật khẩu, profile |
| `/api/products` | CRUD sản phẩm, tìm kiếm, lọc |
| `/api/categories` | CRUD danh mục |
| `/api/cart` | Giỏ hàng (thêm/xóa/cập nhật) |
| `/api/orders` | Tạo đơn, lịch sử đơn hàng |
| `/api/payment` | Thanh toán VNPay |
| `/api/reviews` | Đánh giá sản phẩm |
| `/api/fulfillment` | Giao file sản phẩm kỹ thuật số |
| `/api/admin` | Dashboard & quản lý (admin) |

---

## Cấu trúc thư mục

Xem chi tiết tại [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).