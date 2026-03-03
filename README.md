# Link Bio Products (React + Vite + TypeScript + Firebase)

Web app gồm 2 route:

- `/`: Web link-bio hiển thị card sản phẩm (ảnh + tên), click card để mở link sản phẩm
- `/admin`: Web admin để đẩy sản phẩm lên Firestore

## Clean architecture đang dùng

- `src/domain`: entity + repository interface
- `src/application`: use-cases
- `src/infrastructure`: Firebase config + repository implementation
- `src/presentation`: pages/components/hooks/styles

## 1) Cài đặt

```bash
npm install
```

## 2) Cấu hình Firebase

1. Tạo Firebase project
2. Bật Firestore Database
3. Bật Authentication -> Sign-in method -> Email/Password
4. Copy file `.env.example` thành `.env`
5. Điền thông tin Firebase
6. Điền `VITE_ADMIN_EMAIL` là email của duy nhất 1 tài khoản admin

Ví dụ rules để đọc public, chỉ 1 admin được ghi:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == "admin@example.com";
    }
  }
}
```

## 3) Chạy local

```bash
npm run dev
```

## 4) Build

```bash
npm run build
npm run preview
```

## Troubleshooting khi không lưu được sản phẩm

- Kiểm tra đã tạo `.env` từ `.env.example` và điền đúng toàn bộ biến `VITE_FIREBASE_*`
- Sau khi sửa `.env`, cần restart `npm run dev`
- Kiểm tra Firestore Rules có cho phép `read` và yêu cầu `request.auth` cho `write`
- Kiểm tra Firebase Authentication đã bật provider Email/Password
- Kiểm tra đã set đúng `VITE_ADMIN_EMAIL` trong `.env`
- Mở Console browser để xem lỗi chi tiết (ví dụ `permission-denied`)
- Vào `/admin`, kiểm tra ô trạng thái kết nối:
  - Nếu báo thiếu biến, sửa `.env`
  - Nếu config hợp lệ mà vẫn lỗi, gần như chắc chắn do Firestore Rules/Auth

## Firestore collection

Collection: `products`

Document fields:

- `name: string`
- `imageUrl: string`
- `linkUrl: string`
- `createdAt: serverTimestamp`
