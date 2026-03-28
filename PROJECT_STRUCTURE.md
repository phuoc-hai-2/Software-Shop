# Cấu trúc thư mục & Chức năng từng file – Software-Shop

> Tài liệu tổng hợp sau khi quét toàn bộ mã nguồn dự án.

---

## 1. Tổng quan dự án

**Software-Shop** là ứng dụng **thương mại điện tử full-stack** bán phần mềm/bản quyền, gồm:

| Thành phần | Công nghệ |
|---|---|
| Backend | Node.js, Express.js, MongoDB (Mongoose) |
| Frontend | React 18, Ant Design, Redux Toolkit |
| Thanh toán | VNPay (cổng thanh toán Việt Nam) |
| Xác thực | JWT + bcryptjs |
| Email | Nodemailer (Gmail) |

---

## 2. Cấu trúc thư mục

```
Software-Shop/                          # Thư mục gốc
├── README.md                           # Giới thiệu dự án
├── PROJECT_STRUCTURE.md                # Tài liệu cấu trúc (file này)
├── .gitignore                          # Danh sách file/thư mục bỏ qua khi commit
│
└── Software-Shop/                      # Mã nguồn chính
    ├── backend/                        # Server API (Node.js/Express)
    │   ├── .env.example                # Mẫu biến môi trường
    │   ├── package.json                # Khai báo dependencies backend
    │   ├── README.md                   # Hướng dẫn cài đặt backend
    │   └── src/                        # Mã nguồn backend
    │       ├── server.js               # Điểm khởi chạy – kết nối MongoDB & start server
    │       ├── app.js                  # Cấu hình Express (middleware, routes)
    │       ├── controllers/            # Xử lý logic nghiệp vụ
    │       │   ├── admin.controller.js
    │       │   ├── auth.controller.js
    │       │   ├── cart.controller.js
    │       │   ├── category.controller.js
    │       │   ├── fulfillment.controller.js
    │       │   ├── order.controller.js
    │       │   ├── payment.controller.js
    │       │   ├── product.controller.js
    │       │   └── review.controller.js
    │       ├── models/                 # Schema MongoDB (Mongoose)
    │       │   ├── cart.model.js
    │       │   ├── category.model.js
    │       │   ├── order.model.js
    │       │   ├── product.model.js
    │       │   ├── review.model.js
    │       │   └── user.model.js
    │       ├── routes/                 # Định tuyến API
    │       │   ├── admin.route.js
    │       │   ├── auth.route.js
    │       │   ├── cart.route.js
    │       │   ├── category.route.js
    │       │   ├── fulfillment.route.js
    │       │   ├── order.route.js
    │       │   ├── payment.route.js
    │       │   ├── product.route.js
    │       │   └── review.route.js
    │       ├── middlewares/            # Middleware xử lý trung gian
    │       │   ├── auth.middleware.js
    │       │   └── upload.middleware.js
    │       └── services/              # Dịch vụ tích hợp bên ngoài
    │           └── vnpay.service.js
    │
    └── frontend/                       # Giao diện người dùng (React)
        ├── .env.example                # Mẫu biến môi trường
        ├── package.json                # Khai báo dependencies frontend
        ├── README.md                   # Hướng dẫn cài đặt frontend
        └── src/                        # Mã nguồn frontend
            ├── index.js                # Điểm khởi chạy React
            ├── App.js                  # Router chính – khai báo tất cả route
            ├── store.js                # Cấu hình Redux store
            ├── components/             # Component tái sử dụng
            │   └── OrderMenu.js
            └── pages/                  # Các trang giao diện
                ├── HomePage.js
                ├── LoginPage.js
                ├── RegisterPage.js
                ├── ProductListPage.js
                ├── ProductDetailPage.js
                ├── CartPage.js
                ├── CheckoutPage.js
                ├── VnPayReturnPage.js
                ├── OrderListPage.js
                ├── OrderDetailPage.js
                ├── AdminDashboardPage.js
                ├── AdminUserListPage.js
                ├── AdminUserDetailPage.js
                ├── AdminPaymentListPage.js
                ├── AdminPaymentDetailPage.js
                └── AdminReviewListPage.js
```

---

## 3. Chức năng từng file (tóm tắt)

### 3.1 Backend

#### 3.1.1 Cấu hình & Khởi chạy

| File | Chức năng |
|---|---|
| `server.js` | Kết nối MongoDB qua Mongoose, khởi động Express server tại cổng 5000 |
| `app.js` | Cấu hình CORS, JSON parser, Morgan (logging), đăng ký tất cả route API |
| `package.json` | Khai báo dependencies: express, mongoose, jsonwebtoken, bcryptjs, nodemailer, socket.io, cors, morgan, dotenv, nodemon |
| `.env.example` | Mẫu biến môi trường: `PORT`, `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `VNPay_*`, `CLIENT_URL` |

#### 3.1.2 Models (Schema cơ sở dữ liệu)

| File | Chức năng |
|---|---|
| `user.model.js` | Schema người dùng: email, mật khẩu (hash), họ tên, avatar, SĐT, vai trò (`user`/`admin`), trạng thái (`active`/`banned`), token reset mật khẩu |
| `product.model.js` | Schema sản phẩm: tên, mô tả, giá, biến thể (variant), hình ảnh, danh mục, đánh giá TB, lượt xem, số lượng đã bán |
| `order.model.js` | Schema đơn hàng: danh sách sản phẩm, tổng tiền, trạng thái (`Pending`/`Paid`/`Completed`/`Failed`/`Cancelled`/`Refunded`), thông tin thanh toán |
| `cart.model.js` | Schema giỏ hàng: tham chiếu user, mảng sản phẩm (product, variant, số lượng) |
| `review.model.js` | Schema đánh giá: điểm (1–5), nội dung, hình ảnh, trạng thái (`pending`/`approved`/`hidden`), phản hồi admin |
| `category.model.js` | Schema danh mục: tên, slug |

#### 3.1.3 Controllers (Xử lý nghiệp vụ)

| File | Chức năng |
|---|---|
| `auth.controller.js` | Đăng ký, đăng nhập, quên mật khẩu, đặt lại mật khẩu, xem/cập nhật profile. Sử dụng bcryptjs (hash), JWT (token), nodemailer (gửi email) |
| `product.controller.js` | CRUD sản phẩm; tìm kiếm theo từ khóa, lọc theo danh mục/giá; phân trang |
| `order.controller.js` | Tạo đơn hàng từ giỏ hàng, xem lịch sử đơn, xem chi tiết đơn |
| `payment.controller.js` | Tạo URL thanh toán VNPay, xử lý IPN callback, cập nhật trạng thái đơn, gửi email xác nhận |
| `cart.controller.js` | Thêm/xóa/cập nhật sản phẩm trong giỏ hàng |
| `admin.controller.js` | Thống kê dashboard (doanh thu, người dùng, đơn hàng), quản lý user (ban/unban), lịch sử thanh toán, doanh thu theo tháng, tăng trưởng user, top sản phẩm |
| `review.controller.js` | Tạo đánh giá sản phẩm, duyệt/kiểm duyệt đánh giá (admin) |
| `category.controller.js` | CRUD danh mục sản phẩm |
| `fulfillment.controller.js` | Giao file sản phẩm kỹ thuật số cho đơn hàng đã thanh toán |

#### 3.1.4 Routes (Định tuyến API)

| File | Endpoint gốc | Các phương thức chính |
|---|---|---|
| `auth.route.js` | `/api/auth` | `POST /register`, `POST /login`, `POST /forgot-password`, `POST /reset-password`, `GET /profile`, `PUT /profile` |
| `product.route.js` | `/api/products` | `GET /` (danh sách + tìm kiếm), `POST /` (tạo), `GET /:id`, `PUT /:id`, `DELETE /:id` |
| `category.route.js` | `/api/categories` | CRUD danh mục |
| `cart.route.js` | `/api/cart` | Thao tác giỏ hàng (thêm, xóa, cập nhật) |
| `order.route.js` | `/api/orders` | `POST /` (tạo đơn), `GET /` (danh sách), `GET /:id` (chi tiết) |
| `payment.route.js` | `/api/payment` | `POST /create` (tạo URL thanh toán), `GET /vnpay-ipn` (callback) |
| `review.route.js` | `/api/reviews` | Tạo & quản lý đánh giá |
| `fulfillment.route.js` | `/api/fulfillment` | Giao file đơn hàng |
| `admin.route.js` | `/api/admin` | Thống kê, quản lý user, lịch sử thanh toán |

#### 3.1.5 Middlewares

| File | Chức năng |
|---|---|
| `auth.middleware.js` | Xác thực JWT: kiểm tra Bearer token trong header, giải mã và gắn thông tin user vào request |
| `upload.middleware.js` | Xử lý upload file (hình ảnh sản phẩm, avatar) |

#### 3.1.6 Services

| File | Chức năng |
|---|---|
| `vnpay.service.js` | Tích hợp VNPay: tạo URL thanh toán với chữ ký HMAC-SHA512, xác minh callback IPN |

---

### 3.2 Frontend

#### 3.2.1 Cấu hình & Khởi chạy

| File | Chức năng |
|---|---|
| `index.js` | Điểm vào React – render `<App />` vào DOM |
| `App.js` | Khai báo tất cả route (React Router v6): trang chủ, đăng nhập, đăng ký, sản phẩm, giỏ hàng, thanh toán, đơn hàng, admin |
| `store.js` | Cấu hình Redux store (chưa hoàn thiện – cần thêm reducers) |
| `package.json` | Dependencies: react, react-router-dom, redux, @reduxjs/toolkit, axios, antd |
| `.env.example` | Biến môi trường: `REACT_APP_API_URL`, `REACT_APP_VNPAY_URL` |

#### 3.2.2 Components (tái sử dụng)

| File | Chức năng |
|---|---|
| `OrderMenu.js` | Menu điều hướng đơn hàng – hiển thị các liên kết quản lý đơn |

#### 3.2.3 Pages (trang giao diện)

| File | Chức năng |
|---|---|
| `HomePage.js` | Trang chủ – giới thiệu, hiển thị sản phẩm nổi bật |
| `LoginPage.js` | Form đăng nhập (email + mật khẩu) |
| `RegisterPage.js` | Form đăng ký tài khoản mới |
| `ProductListPage.js` | Danh sách sản phẩm: tìm kiếm, lọc theo danh mục/giá, phân trang |
| `ProductDetailPage.js` | Chi tiết sản phẩm: thông tin, hình ảnh, đánh giá, nút thêm giỏ hàng |
| `CartPage.js` | Giỏ hàng: hiển thị sản phẩm đã chọn, cập nhật số lượng, xóa |
| `CheckoutPage.js` | Thanh toán: form thông tin, nút thanh toán VNPay |
| `VnPayReturnPage.js` | Xử lý redirect sau khi thanh toán VNPay – hiển thị kết quả |
| `OrderListPage.js` | Lịch sử đơn hàng của người dùng |
| `OrderDetailPage.js` | Chi tiết đơn hàng: trạng thái, danh sách sản phẩm, thông tin thanh toán |
| `AdminDashboardPage.js` | Dashboard admin: thống kê doanh thu, số đơn, số user, biểu đồ |
| `AdminUserListPage.js` | Quản lý danh sách người dùng (admin) |
| `AdminUserDetailPage.js` | Chi tiết người dùng: profile, ban/unban (admin) |
| `AdminPaymentListPage.js` | Danh sách giao dịch thanh toán (admin) |
| `AdminPaymentDetailPage.js` | Chi tiết giao dịch thanh toán (admin) |
| `AdminReviewListPage.js` | Kiểm duyệt đánh giá sản phẩm (admin) |

---

## 4. Luồng hoạt động chính

```
Người dùng                          Backend                         Database
    │                                  │                               │
    ├─ Đăng ký/Đăng nhập ──────────► auth.controller ──────────────► user.model
    │  (JWT token trả về)              │                               │
    ├─ Xem sản phẩm ───────────────► product.controller ───────────► product.model
    │                                  │                               │
    ├─ Thêm giỏ hàng ──────────────► cart.controller ──────────────► cart.model
    │                                  │                               │
    ├─ Thanh toán ──────────────────► payment.controller               │
    │   │                              ├─► vnpay.service (tạo URL)     │
    │   ├─ Redirect VNPay ◄────────────┘                               │
    │   └─ Callback IPN ───────────► payment.controller ───────────► order.model
    │                                  │  (cập nhật trạng thái)        │
    │                                  ├─► nodemailer (gửi email)      │
    │                                  │                               │
    ├─ Xem đơn hàng ───────────────► order.controller ─────────────► order.model
    │                                  │                               │
    ├─ Đánh giá sản phẩm ──────────► review.controller ────────────► review.model
    │                                  │                               │
    └─ [Admin] Quản lý ────────────► admin.controller ─────────────► (tất cả models)
```

---

## 5. Ghi chú kỹ thuật

- **Xác thực**: Tất cả API cần đăng nhập đều qua `auth.middleware.js` (JWT Bearer token).
- **Phân quyền**: Vai trò `admin` được kiểm tra trong các route admin.
- **Thanh toán**: Sử dụng VNPay sandbox; chữ ký HMAC-SHA512 đảm bảo tính toàn vẹn.
- **Mật khẩu**: Hash bằng bcryptjs trước khi lưu vào database.
- **Redux store**: Frontend chưa hoàn thiện – cần bổ sung reducers/slices.
- **Socket.io**: Đã khai báo trong dependencies nhưng chưa tích hợp đầy đủ (dự kiến cho tính năng chat/hỗ trợ).
