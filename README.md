# Express E-Commerce Store Stripe

Backend API untuk toko e-commerce dengan pembayaran Stripe, dibuat dengan Node.js, Express, dan TypeScript memakai arsitektur MVC. Frontend-nya ada di project `next-e-commerce-store-stripe`.

## Struktur Project

```
src/
├── controllers/     # Controller layer - menangani HTTP requests
│   └── authController.ts
├── services/        # Service layer - business logic
│   └── AuthService.ts
├── models/          # Model layer - data structures dan repository
│   ├── User.ts
│   └── UserRepository.ts
├── middleware/      # Middleware untuk validasi dan authentication
│   └── authMid.ts
├── routes/          # Route definitions
│   ├── authRoute.ts
│   ├── index.ts
│   └── v1/
│       └── index.ts
└── server.ts        # Entry point aplikasi
```

## Fitur yang Tersedia

### Authentication API

#### 1. Register User
- **Endpoint**: `POST /api/v1/register`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "token": "jwt_token_here"
    }
  }
  ```

#### 2. Login User
- **Endpoint**: `POST /api/v1/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "token": "jwt_token_here"
    }
  }
  ```

#### 3. Get User Profile (Protected)
- **Endpoint**: `GET /api/v1/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Profile retrieved successfully",
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  }
  ```

## Arsitektur dan Best Practices

### 1. **MVC Pattern**
- **Models**: Mendefinisikan struktur data dan interface
- **Controllers**: Menangani HTTP requests dan responses
- **Services**: Mengandung business logic
- **Repository Pattern**: Abstraksi untuk data access

### 2. **Middleware Pattern**
- **Validation Middleware**: Validasi input sebelum masuk ke controller
- **Authentication Middleware**: Verifikasi JWT token
- **Error Handling**: Centralized error handling

### 3. **Security Features**
- Password hashing menggunakan crypto PBKDF2
- JWT token untuk authentication
- Input validation dan sanitization
- Rate limiting dan security headers

### 4. **Path Aliases**
- Menggunakan `@/` untuk import absolute paths
- Konfigurasi di `tsconfig.json`

## Instalasi dan Menjalankan

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Jalankan development server**:
   ```bash
   npm run dev
   ```

3. **Build untuk production**:
   ```bash
   npm run build
   npm start
   ```

## Testing API

Anda bisa menggunakan tools seperti Postman, Insomnia, atau curl untuk testing:

```bash
# Register user baru
curl -X POST http://localhost:3000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get profile (ganti <token> dengan token dari login)
curl -X GET http://localhost:3000/api/v1/profile \
  -H "Authorization: Bearer <token>"
```

## Pembelajaran dan Best Practices

### 1. **Separation of Concerns**
Setiap layer memiliki tanggung jawab yang jelas:
- Controller hanya menangani HTTP
- Service mengandung business logic
- Repository menangani data access

### 2. **Dependency Injection**
Service dan repository di-inject ke controller untuk memudahkan testing dan maintainability.

### 3. **Error Handling**
Menggunakan try-catch dan return response yang konsisten.

### 4. **Type Safety**
Menggunakan TypeScript interfaces untuk type safety.

### 5. **Security**
- Tidak pernah menyimpan password plain text
- Menggunakan JWT untuk stateless authentication
- Validasi input yang ketat

Project ini dibuat sebagai contoh pembelajaran untuk memahami struktur backend yang baik dan scalable.