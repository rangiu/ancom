# 🍚 DỰ ÁN: ĂN CƠM (Eat Rice Project)

> Website toàn cầu tối giản, hiện đại, phong cách Apple với một câu hỏi duy nhất: **"Hôm nay bạn đã ăn cơm chưa?" / "Have you eaten rice today?"**

![Eat Rice App Preview](https://raw.githubusercontent.com/username/ancom/main/client/public/og-image.png)

---

## 🌟 Tính Năng Nổi Bật

- 🍎 **Giao diện chuẩn Apple Aesthetic**: Thiết kế cực kỳ sang trọng, nền trắng sạch, hiệu ứng kính mờ `backdrop-blur`, bo góc mềm (`rounded-3xl`), font chữ sắc nét và micro-animation siêu mượt bằng `framer-motion`.
- 🌓 **Tự động Dark Mode**: Tự động chuyển đổi giao diện sáng / tối theo hệ thống thiết bị và cho phép người dùng chuyển đổi thủ công.
- 🌐 **Đa ngôn ngữ (i18n)**:
  - Hỗ trợ 2 ngôn ngữ: 🇻🇳 Tiếng Việt & 🇺🇸 English.
  - Tự động nhận diện ngôn ngữ trình duyệt.
  - Lưu cấu hình ngôn ngữ vào `localStorage` cho các lần truy cập tiếp theo.
- ⚡ **Cập nhật thời gian thực (Realtime Stats)**:
  - Hiển thị tổng số người đã ăn cơm, chưa ăn, tổng lượt bình chọn và % tỷ lệ.
  - Thanh tiến trình hoạt họa sống động.
  - Tự động đồng bộ số liệu thời gian thực.
- 🚫 **Chống Spam Thông Minh**:
  - Giới hạn 1 lượt bình chọn trên mỗi thiết bị/ngày.
  - Kết hợp 3 lớp bảo vệ: `LocalStorage` + `Cookie HTTP-Only` + `Device Token / Firestore Transaction`.
- 🛡️ **Bảo Mật & Chuẩn Production**:
  - Backend tích hợp `Helmet`, `CORS`, `Express Rate-Limiting`, kiểm soát dữ liệu đầu vào bằng `Zod`.
  - Ẩn toàn bộ secret keys trong `.env`.
- 🔍 **Tối Ưu SEO & AdSense Ready**:
  - Thẻ Meta Title, Description, Open Graph, Twitter Cards tự động cập nhật theo ngôn ngữ.
  - Sẵn sàng tệp `robots.txt` & `sitemap.xml`.
  - Thiết kế vị trí Banner Quảng cáo tuân thủ chính sách Google AdSense.
  - Tích hợp sẵn trang **Chính sách bảo mật (Privacy Policy)** & **Điều khoản sử dụng (Terms of Service)**.

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend (`/client`)
- **Core**: React 18 + Vite + TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Custom Apple Design Tokens
- **Icons & Animation**: Lucide React + Framer Motion
- **i18n**: `i18next` + `react-i18next` + `i18next-browser-languagedetector`
- **SEO**: `react-helmet-async`

### Backend (`/server`)
- **Core**: Node.js + Express + TypeScript
- **Security**: Helmet, CORS, Cookie Parser, Express Rate Limit, Zod Validation
- **Database**: Firebase Firestore Admin SDK (Có sẵn driver Fallback Memory Engine cho môi trường dev/demo)

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Local)

### 1. Yêu cầu hệ thống
- Node.js version `>= 18.x`
- npm hoặc yarn

### 2. Cài đặt Dependencies
Chạy lệnh sau tại thư mục gốc để tự động cài đặt gói cho cả Client & Server:

```bash
npm run install:all
```

Hoặc cài thủ công:
```bash
# Client
cd client && npm install

# Server
cd ../server && npm install
```

### 3. Cấu hình Biến Môi Trường (.env)
Tạo file `.env` trong thư mục `server/`:

```env
PORT=5000
VITE_API_BASE_URL=http://localhost:5000/api
ALLOWED_ORIGIN=http://localhost:5173,http://localhost:3000

# (Tùy chọn) Cấu hình Firebase Firestore. Nếu bỏ trống, hệ thống sẽ tự dùng Memory Engine.
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

### 4. Khởi Chạy Dự Án

Mở 2 cửa sổ terminal:

**Terminal 1 (Backend Server):**
```bash
npm run dev:server
```
-> Backend khởi chạy tại: `http://localhost:5000`

**Terminal 2 (Frontend Client):**
```bash
npm run dev:client
```
-> Frontend khởi chạy tại: `http://localhost:5173`

---

## ☁️ Triển Khai Lên Production

### 1. Triển khai Frontend lên Vercel
1. Đẩy mã nguồn lên GitHub.
2. Truy cập [Vercel Dashboard](https://vercel.com) -> chọn **New Project** -> chọn repository `ancom`.
3. Cài đặt Cấu hình:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Thêm Environment Variable:
   - `VITE_API_BASE_URL`: URL backend của bạn trên Render/Railway (ví dụ: `https://ancom-api.onrender.com/api`)
5. Nhấn **Deploy**.

### 2. Triển khai Backend lên Render / Railway
1. Tạo Web Service mới trên Render hoặc Railway từ GitHub repo.
2. Chọn thư mục root là `server`.
3. Build Command: `npm run build`
4. Start Command: `npm start`
5. Thêm các biến môi trường từ `.env.example` (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `ALLOWED_ORIGIN`).

---

## 📄 Giấy Phép & Bản Quyền

Dự án được phát hành theo giấy phép **MIT License**.
© 2026 Eat Rice Project. Built with ❤️ for humanity.
