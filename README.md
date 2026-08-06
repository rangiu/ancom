# 🍚 DỰ ÁN: ĂN CƠM (Eat Rice Project)

> Website toàn cầu tối giản, hiện đại, phong cách Apple với một câu hỏi duy nhất: **"Hôm nay bạn đã ăn cơm chưa?" / "Have you eaten rice today?"**

---

## 📁 Cấu Trúc Thư Mục

Dự án **100% tĩnh (static)**, không có backend/server nào — chỉ một thư mục duy nhất:

- 🎨 **`frontend/`**: Mã nguồn Giao diện người dùng (React 18 + Vite + TypeScript + Tailwind CSS + i18n + Framer Motion) -> **Triển khai lên Vercel**.

---

## ⚡ Cách hoạt động của số liệu (không backend)

- Mỗi lượt bấm "Đã ăn" / "Chưa ăn" **cộng số thật**, lưu ngay vào `localStorage` của trình duyệt — không phải số ảo, không bị mất khi tải lại trang.
- Số liệu là **theo từng trình duyệt/thiết bị** (không phải số liệu toàn cầu dùng chung, vì không có server/database nào lưu trữ tập trung).
- **Tự động reset về 0 lúc 00:00 giờ Việt Nam (UTC+7) mỗi ngày**: mỗi lần mở app, hoặc mỗi 30 giây/khi quay lại tab trong lúc đang mở, app sẽ kiểm tra ngày hiện tại (theo giờ VN) — nếu đã sang ngày mới, số liệu và trạng thái "đã bình chọn" sẽ tự xoá để bắt đầu lại từ 0.
- Logic reset nằm ở [`frontend/src/lib/storage.ts`](frontend/src/lib/storage.ts) (hàm `ensureDailyReset`).

---

## 🌟 Tính Năng Nổi Bật

- 🍎 **Giao diện chuẩn Apple Aesthetic**: nền trắng sạch, hiệu ứng kính mờ `backdrop-blur`, bo góc mềm (`rounded-3xl`), micro-animation mượt bằng `framer-motion`.
- 🌓 **Tự động Dark Mode**: theo hệ thống thiết bị, cho phép chuyển đổi thủ công.
- 🌐 **Đa ngôn ngữ (i18n)**: 🇻🇳 Tiếng Việt & 🇺🇸 English, tự nhận diện ngôn ngữ trình duyệt, lưu lựa chọn vào `localStorage`.
- ⚡ **Số liệu thật, lưu bền & tự reset hàng ngày** (xem mục trên).
- 🔍 **Tối Ưu SEO & AdSense Ready**: Meta Title/Description/Open Graph/Twitter Cards, `robots.txt` & `sitemap.xml`, trang Chính sách bảo mật & Điều khoản sử dụng.

---

## 🛠️ Công Nghệ Sử Dụng

- **Core**: React 18 + Vite + TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Custom Apple Design Tokens
- **Icons & Animation**: Lucide React + Framer Motion
- **i18n**: `i18next` + `react-i18next` + `i18next-browser-languagedetector`
- **SEO**: `react-helmet-async`
- **Lưu trữ số liệu**: `localStorage` (không backend, không database)

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Local)

```bash
npm run install:all   # cài dependencies cho frontend
npm run dev            # chạy dev server tại http://localhost:5173
```

## 🧱 Build

```bash
npm run build           # build ra frontend/dist
```

---

## ☁️ Triển Khai Lên Vercel

1. Đẩy mã nguồn lên GitHub (nếu muốn deploy qua Git integration), hoặc deploy trực tiếp bằng Vercel CLI từ thư mục gốc dự án:
   ```bash
   npx vercel --prod
   ```
2. Cấu hình build đã có sẵn trong [`vercel.json`](vercel.json) ở thư mục gốc:
   - **Build Command**: `npm run build --prefix frontend`
   - **Output Directory**: `frontend/dist`
3. (Tuỳ chọn) Thêm biến môi trường `VITE_ADSENSE_CLIENT_ID` nếu dùng Google AdSense.
4. Không cần thêm bước nào khác — không có backend, không có database, không cron job phía server. Việc reset hàng ngày chạy hoàn toàn trên trình duyệt người dùng.
