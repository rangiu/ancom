# 🍚 DỰ ÁN: ĂN CƠM (Eat Rice Project)

> Website toàn cầu tối giản, hiện đại, phong cách Apple với một câu hỏi duy nhất: **"Hôm nay bạn đã ăn cơm chưa?" / "Have you eaten rice today?"**

---

## 📁 Cấu Trúc Thư Mục

- 🎨 **`frontend/`**: Giao diện người dùng (React 18 + Vite + TypeScript + Tailwind CSS + i18n + Framer Motion) -> **Triển khai lên Vercel**.
- ⚙️ **`backend/`**: API bộ đếm bình chọn toàn cầu (Node.js + Express, lưu trạng thái vào 1 file JSON trên đĩa) -> **Triển khai bằng Docker trên VPS riêng**, lộ ra internet qua **Cloudflare Tunnel** tại `https://ancom-api.sumflow.online`.

---

## ⚡ Cách hoạt động của số liệu

- Số liệu là **số liệu chung toàn cầu** — mọi người bấm vào cùng một bộ đếm thật trên server, không phải số ảo và không mất khi tải lại trang.
- Mỗi thiết bị (`deviceToken` lưu trong `localStorage`) chỉ được bình chọn **1 lần/ngày** — server từ chối nếu bình chọn trùng trong cùng ngày.
- **Tự động reset về 0 lúc 00:00 giờ Việt Nam (UTC+7) mỗi ngày**, chạy trên server (`backend/server.js`, dùng `node-cron` với timezone `Asia/Ho_Chi_Minh`, có thêm cơ chế kiểm tra dự phòng mỗi phút phòng khi server restart đúng lúc gần nửa đêm).
- Frontend gọi `GET /api/stats` (polling mỗi 10 giây) và `POST /api/vote` tới backend qua [`frontend/src/lib/api.ts`](frontend/src/lib/api.ts).

---

## 🌟 Tính Năng Nổi Bật

- 🍎 **Giao diện chuẩn Apple Aesthetic**: nền trắng sạch, hiệu ứng kính mờ `backdrop-blur`, bo góc mềm (`rounded-3xl`), micro-animation mượt bằng `framer-motion`.
- 🌓 **Tự động Dark Mode**: theo hệ thống thiết bị, cho phép chuyển đổi thủ công.
- 🌐 **Đa ngôn ngữ (i18n)**: 🇻🇳 Tiếng Việt & 🇺🇸 English, tự nhận diện ngôn ngữ trình duyệt, lưu lựa chọn vào `localStorage`.
- ⚡ **Số liệu chung toàn cầu, thời gian thực, tự reset hàng ngày** (xem mục trên).
- 🚫 **Chống spam**: mỗi thiết bị chỉ bình chọn được 1 lần/ngày (kiểm tra ở backend) + rate-limit theo IP (`express-rate-limit`).
- 🔍 **Tối Ưu SEO & AdSense Ready**: Meta Title/Description/Open Graph/Twitter Cards, `robots.txt` & `sitemap.xml`, trang Chính sách bảo mật & Điều khoản sử dụng.

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend (`/frontend`)
- **Core**: React 18 + Vite + TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Custom Apple Design Tokens
- **Icons & Animation**: Lucide React + Framer Motion
- **i18n**: `i18next` + `react-i18next` + `i18next-browser-languagedetector`
- **SEO**: `react-helmet-async`

### Backend (`/backend`)
- **Core**: Node.js + Express
- **Lưu trữ**: file JSON trên đĩa (atomic write), đủ dùng cho quy mô bộ đếm này — không cần database ngoài
- **Lịch reset**: `node-cron` (`Asia/Ho_Chi_Minh`) + kiểm tra dự phòng mỗi 60s
- **Bảo mật**: CORS giới hạn origin, `express-rate-limit`
- **Triển khai**: Docker (`Dockerfile` + `docker-compose.yml`), chạy trên VPS, chỉ bind `127.0.0.1:4000` — lộ ra internet qua Cloudflare Tunnel (không mở port nào ra ngoài)

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Local)

### Frontend
```bash
npm run install:all   # cài dependencies cho frontend
npm run dev            # chạy dev server tại http://localhost:5173
```
Mặc định frontend gọi thẳng vào backend production (`https://ancom-api.sumflow.online/api`). Muốn trỏ vào backend chạy local thì tạo file `.env.local` trong `frontend/` với `VITE_API_BASE_URL=http://localhost:4000/api`.

### Backend (tuỳ chọn, chỉ cần khi phát triển backend)
```bash
cd backend
npm install
npm start   # chạy tại http://localhost:4000
```

## 🧱 Build

```bash
npm run build           # build frontend ra frontend/dist
```

---

## ☁️ Triển Khai Production

### Frontend -> Vercel
Repo được kết nối Git với Vercel — mỗi lần push lên nhánh `main` sẽ tự động build & deploy. Cấu hình build nằm sẵn trong [`vercel.json`](vercel.json):
- **Build Command**: `npm run build --prefix frontend`
- **Output Directory**: `frontend/dist`

### Backend -> VPS riêng (Docker + Cloudflare Tunnel)
1. Copy thư mục `backend/` lên server.
2. (Tuỳ chọn) Tạo file `backend/.env` từ [`backend/.env.example`](backend/.env.example) để bật tính năng AI gợi ý món ăn — cần `DEEPSEEK_API_KEY`.
3. `docker compose -p ancom-backend up -d --build`
4. Thêm 1 **Public Hostname** trong Cloudflare Zero Trust Tunnel dashboard trỏ `ancom-api.sumflow.online` -> `http://localhost:4000` (không cần mở port nào trên server).

---

## 🍽️ Điểm danh sức khoẻ & AI gợi ý món ăn

Ngoài câu hỏi "Đã ăn cơm chưa?" và "Đã tập thể dục chưa?", site còn có:
- **Đã uống đủ nước chưa?** / **Đã ngủ đủ giấc chưa?** — 2 câu điểm danh cùng cơ chế (1 lượt/thiết bị/ngày, reset 00:00 giờ VN), dùng chung 1 hệ thống backend tổng quát (`CHECKINS` trong [`backend/server.js`](backend/server.js)) và 1 component frontend tổng quát ([`CheckinCard.tsx`](frontend/src/components/CheckinCard.tsx)) thay vì copy riêng từng câu.
- **AI tư vấn** (`POST /api/advice/:type`, `type` ∈ `rice|water|exercise|sleep`) — mỗi khảo sát có nút "AI tư vấn" riêng: ăn cơm nhập nguyên liệu + ngân sách để AI gợi ý món; nước nhập tuổi + mức vận động để AI tư vấn lượng nước; vận động nhập mục tiêu + thời gian rảnh để AI gợi ý lịch tập; giấc ngủ nhập số giờ ngủ hiện tại + vấn đề gặp phải để AI tư vấn cải thiện. Cả 4 loại dùng chung 1 hạn mức: 8 lượt/thiết bị/ngày và trần tổng site-wide (mặc định 400/ngày) để kiểm soát chi phí; tắt hoàn toàn (trả về 503) nếu chưa cấu hình `DEEPSEEK_API_KEY`.
- Mỗi khảo sát còn có nút **"Thông tin hữu ích"** — nội dung tham khảo tĩnh (không gọi AI, không tốn phí) về dinh dưỡng/lượng nước/thời điểm tập luyện/giờ giấc ngủ theo khuyến nghị chung.
