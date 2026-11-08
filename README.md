# SDN302_Fall2026_G2 — Pet Shop E-commerce

Đồ án môn SDN302 — Website bán sản phẩm & dịch vụ thú cưng (MERN Stack).

## Công nghệ sử dụng

**Backend (`BE/`)** — Node.js, Express 5, MongoDB (Mongoose), JWT auth (httpOnly cookie), bcryptjs, helmet, express-rate-limit

**Frontend (`FE/`)** — React 19, Vite, React Router 7, Zustand (state management), Tailwind CSS 4, Axios

## Tính năng chính

### Khách hàng
- Xem sản phẩm, tìm kiếm/lọc theo danh mục, thương hiệu, giá
- Giỏ hàng, mã giảm giá (coupon), đặt hàng, theo dõi đơn hàng, hủy đơn
- Đánh giá sản phẩm (chỉ với đơn hàng đã mua — verified purchase), sửa/xóa đánh giá
- Danh sách yêu thích (wishlist), hồ sơ thú cưng (pet profiles), đặt lịch dịch vụ (appointments)
- Quản lý thông tin cá nhân, lịch sử đơn hàng

### Quản trị (Admin)
- Dashboard thống kê (doanh thu, đơn hàng, người dùng)
- Quản lý sản phẩm, thương hiệu (Brands), danh mục, dịch vụ (Services)
- Quản lý voucher/mã giảm giá (tạo, sửa, bật/tắt, xóa)
- Quản lý đơn hàng & cập nhật trạng thái, quản lý người dùng & phân quyền
- Quản lý lịch hẹn dịch vụ (cập nhật trạng thái, xóa)
- Xem tin nhắn liên hệ từ form Contact

### Nhân viên (Staff)
- Quản lý đơn hàng, kho hàng, lịch hẹn dịch vụ

## Cài đặt

### Yêu cầu
- Node.js ≥ 18
- MongoDB đang chạy local (hoặc MongoDB Atlas URI)

### Backend
```bash
cd BE
npm install

# Tạo file .env (xem mẫu bên dưới)
npm run dev        # chạy development (nodemon)
npm start          # chạy production

# Import dữ liệu mẫu (11 collection: products, users, orders...)
npm run data:import
npm run data:destroy   # xóa dữ liệu
```

File `BE/.env` mẫu:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/petshop
JWT_SECRET=<chuỗi-bất-kỳ>
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend
```bash
cd FE
npm install
npm run dev        # http://localhost:5173 (proxy /api -> :5000)
npm run build      # build production
```

## Cấu trúc thư mục

```
├── BE/
│   ├── config/         # Kết nối MongoDB
│   ├── controllers/    # Xử lý logic từng nghiệp vụ
│   ├── middleware/     # protect / admin / staff (JWT)
│   ├── models/         # Schema Mongoose (11 models)
│   ├── routes/         # Định nghĩa API routes
│   ├── utils/          # Tạo JWT token
│   ├── seed.js         # Import dữ liệu mẫu từ data/
│   └── server.js       # Entry point
├── FE/
│   ├── src/api/        # Axios instance
│   ├── src/components/ # Layout, Header, Footer, routing guards
│   ├── src/pages/      # Trang người dùng + admin/ + staff/
│   └── src/store/      # Zustand stores
└── data/               # Dữ liệu seed JSON (11 collections)
```

## API chính

| Nhóm | Endpoint | Mô tả |
|---|---|---|
| Users | `POST /api/users/register`, `/login`, `/logout` | Đăng ký/đăng nhập (JWT cookie) |
| Users | `GET/PUT /api/users/profile` | Hồ sơ cá nhân |
| Users | `GET/POST/DELETE /api/users/wishlist` | Danh sách yêu thích |
| Products | `GET /api/products`, `GET /api/products/:id` | Danh sách/chi tiết sản phẩm |
| Orders | `POST /api/orders`, `GET /api/orders/myorders` | Đặt hàng, lịch sử |
| Orders | `PUT /api/orders/:id/status` | Cập nhật trạng thái (staff+) |
| Coupons | `POST /api/coupons/apply`, `GET /api/coupons/available` | Áp dụng mã giảm giá |
| Reviews | `GET/PUT/DELETE /api/reviews` | Đánh giá sản phẩm |
| Appointments | `GET/POST /api/appointments`, `PUT /api/appointments/:id/status` | Đặt/cập nhật lịch dịch vụ |
| Services/Brands | CRUD qua `/api/services`, `/api/brands` | Admin quản lý |
| Contact | `POST /api/contact` | Gửi tin nhắn liên hệ |

## Bảo mật đã áp dụng

- Mật khẩu hash bcryptjs, JWT lưu trong httpOnly cookie
- Phân quyền theo role: `user` / `staff` / `admin`
- Helmet (security headers), CORS whitelist theo `CLIENT_URL`
- Rate limiting 50 request/15 phút cho login/register/contact
