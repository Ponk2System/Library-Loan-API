# 📚 Library Loan API

API RESTful untuk mengelola **peminjaman buku perpustakaan** oleh anggota. Dibangun menggunakan **Node.js + Express.js** dengan database **Supabase (PostgreSQL)**, dan di-deploy ke **Vercel**.

> Proyek ini merupakan tugas Responsi Praktikum **Pemrograman Perangkat Bergerak (PPB) – Modul 1**.

---

## 🌐 Link Deployment

**Base URL (Production):** `https://library-loan-api-nine.vercel.app`

---

## 🎯 Deskripsi & Tujuan Proyek

API ini dirancang untuk mengelola tiga entitas utama dalam sistem perpustakaan:

| Entitas | Endpoint | Deskripsi |
|---------|----------|-----------|
| **Books** | `/api/books` | Data buku yang tersedia di perpustakaan |
| **Members** | `/api/members` | Data anggota yang terdaftar |
| **Loans** | `/api/loans` | Data peminjaman buku oleh anggota |

**Tujuan utama proyek:**
- Mengimplementasikan operasi **CRUD** (Create, Read, Update, Delete) untuk setiap entitas
- Mendukung **filter query** pada data peminjaman (contoh: `GET /api/loans?status=Terlambat`)
- Mengintegrasikan **Supabase** sebagai backend database berbasis PostgreSQL
- Men-deploy API ke **Vercel** agar dapat diakses secara publik

---

## 🗂️ Struktur Data / Schema

### Tabel `books`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | `uuid` | Primary key (auto-generated) |
| `title` | `text` | Judul buku |
| `author` | `text` | Nama pengarang |
| `isbn` | `text` | Kode ISBN buku |
| `stock` | `integer` | Jumlah stok buku |
| `created_at` | `timestamp` | Waktu data dibuat (auto) |

### Tabel `members`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | `uuid` | Primary key (auto-generated) |
| `name` | `text` | Nama lengkap anggota |
| `email` | `text` | Email anggota (unik, wajib ada `@`) |
| `phone` | `text` | Nomor telepon (minimal 10 karakter) |
| `address` | `text` | Alamat anggota |
| `created_at` | `timestamp` | Waktu data dibuat (auto) |

### Tabel `loans`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | `uuid` | Primary key (auto-generated) |
| `member_id` | `uuid` | Foreign key → `members.id` |
| `book_id` | `uuid` | Foreign key → `books.id` |
| `loan_date` | `date` | Tanggal peminjaman |
| `due_date` | `date` | Tanggal jatuh tempo |
| `return_date` | `date` | Tanggal pengembalian aktual (nullable) |
| `status` | `text` | `Dipinjam` / `Dikembalikan` / `Terlambat` |
| `created_at` | `timestamp` | Waktu data dibuat (auto) |

### SQL — Membuat Tabel di Supabase

```sql
-- Tabel books
CREATE TABLE books (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  author text NOT NULL,
  isbn text,
  stock integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabel members
CREATE TABLE members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  address text,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabel loans
CREATE TABLE loans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  loan_date date NOT NULL,
  due_date date NOT NULL,
  return_date date,
  status text DEFAULT 'Dipinjam' CHECK (status IN ('Dipinjam', 'Dikembalikan', 'Terlambat')),
  created_at timestamp with time zone DEFAULT now()
);

-- Nonaktifkan RLS agar API dapat mengakses data
ALTER TABLE books DISABLE ROW LEVEL SECURITY;
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE loans DISABLE ROW LEVEL SECURITY;
```

---

## 📁 Struktur Proyek

```
Sales-API/
├── src/
│   ├── config/
│   │   └── supabaseClient.js     # Koneksi ke Supabase
│   ├── models/
│   │   ├── bookModel.js          # Query DB untuk buku
│   │   ├── memberModel.js        # Query DB untuk anggota
│   │   └── loanModel.js          # Query DB untuk peminjaman
│   ├── controllers/
│   │   ├── bookController.js     # Handler request buku
│   │   ├── memberController.js   # Handler request anggota
│   │   └── loanController.js     # Handler request peminjaman
│   ├── routes/
│   │   ├── bookRoutes.js         # Rute /api/books
│   │   ├── memberRoutes.js       # Rute /api/members
│   │   └── loanRoutes.js         # Rute /api/loans
│   └── index.js                  # Entry point aplikasi
├── .env.example                  # Contoh variabel lingkungan
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

---

## ⚙️ Panduan Instalasi & Cara Menjalankan Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) v18+
- Akun [Supabase](https://supabase.com/) dengan project aktif
- [Git](https://git-scm.com/)

### Langkah-langkah

**1. Clone repository**
```bash
git clone https://github.com/<username>/<repo-name>.git
cd <repo-name>
```

**2. Install dependensi**
```bash
npm install
```

**3. Konfigurasi environment variable**
```bash
cp .env.example .env
```

Edit file `.env`:
```env
SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here
PORT=3000
```

> Kredensial Supabase: **Dashboard → Project Settings → API**

**4. Buat tabel di Supabase**

Jalankan SQL di atas melalui **Supabase SQL Editor**.

**5. Jalankan server**
```bash
npm run dev
```
Server berjalan di `http://localhost:3000`

---

## 🔗 Endpoint API & Contoh Request/Response

### 📘 BOOKS — `/api/books`

#### `POST /api/books` — Tambah Buku

**Request Body:**
```json
{
  "title": "Laskar Pelangi",
  "author": "Andrea Hirata",
  "isbn": "978-979-1260-14-5",
  "stock": 100
}
```

**Response `201 Created`:**
```json
{
  "id": "92096351-027f-4706-97e6-7e3b9da0fb21",
  "title": "Laskar Pelangi",
  "author": "Andrea Hirata",
  "isbn": "978-979-1260-14-5",
  "stock": 100,
  "created_at": "2026-10-10T16:41:03.999241+00:00"
}
```

---

#### `GET /api/books` — Ambil Semua Buku

**Response `200 OK`:**
```json
[
  {
    "id": "92096351-027f-4706-97e6-7e3b9da0fb21",
    "title": "Laskar Pelangi",
    "author": "Andrea Hirata",
    "isbn": "978-979-1260-14-5",
    "stock": 100,
    "created_at": "2026-10-10T16:41:03.999241+00:00"
  }
]
```

---

#### `PUT /api/books/:id` — Update Buku

**Request Body:**
```json
{
  "title": "Laskar Pelangi (Prequel)",
  "author": "Andrea Hirata",
  "isbn": "978-979-1260-14-5",
  "stock": 50
}
```

**Response `200 OK`:**
```json
{
  "id": "92096351-027f-4706-97e6-7e3b9da0fb21",
  "title": "Laskar Pelangi (Prequel)",
  "author": "Andrea Hirata",
  "isbn": "978-979-1260-14-5",
  "stock": 50,
  "created_at": "2026-10-10T16:41:03.999241+00:00"
}
```

---

#### `DELETE /api/books/:id` — Hapus Buku

**Response `200 OK`:**
```json
{
  "message": "Buku berhasil dihapus"
}
```

---

### 👤 MEMBERS — `/api/members`

#### `POST /api/members` — Tambah Anggota

**Request Body:**
```json
{
  "name": "Budi Dozemi",
  "email": "budi@example.com",
  "phone": "081234567890",
  "address": "Jl. Jalan Cuman Kita Berdua, Semarang"
}
```

**Response `201 Created`:**
```json
{
  "id": "cffc5c10-d426-4bf8-a0ab-610ab3e32ffc",
  "name": "Budi Dozemi",
  "email": "budi@example.com",
  "phone": "081234567890",
  "address": "Jl. Jalan Cuman Kita Berdua, Semarang",
  "created_at": "2026-10-10T17:47:30.935579+00:00"
}
```

---

#### `GET /api/members` — Ambil Semua Anggota

Query params opsional: `?name=Budi`, `?page=1&limit=10`

**Response `200 OK`:**
```json
[
  {
    "id": "cffc5c10-d426-4bf8-a0ab-610ab3e32ffc",
    "name": "Budi Dozemi",
    "email": "budi@example.com",
    "phone": "081234567890",
    "address": "Jl. Jalan Cuman Kita Berdua, Semarang",
    "created_at": "2026-10-10T17:47:30.935579+00:00"
  }
]
```

---

#### `PUT /api/members/:id` — Update Anggota

**Request Body:**
```json
{
  "name": "Budi Dozemi",
  "email": "budi.baru@example.com",
  "phone": "081234567890",
  "address": "Jl. Jalan Cuman Kita Berdua, Semarang"
}
```

**Response `200 OK`:**
```json
{
  "id": "cffc5c10-d426-4bf8-a0ab-610ab3e32ffc",
  "name": "Budi Dozemi",
  "email": "budi.baru@example.com",
  "phone": "081234567890",
  "address": "Jl. Jalan Cuman Kita Berdua, Semarang",
  "created_at": "2026-10-10T17:47:30.935579+00:00"
}
```

---

#### `DELETE /api/members/:id` — Hapus Anggota

**Response `200 OK`:**
```json
{
  "message": "Anggota berhasil dihapus"
}
```

---

### 📋 LOANS — `/api/loans`

#### `POST /api/loans` — Buat Peminjaman

**Request Body:**
```json
{
  "member_id": "cffc5c10-d426-4bf8-a0ab-610ab3e32ffc",
  "book_id": "92096351-027f-4706-97e6-7e3b9da0fb21",
  "loan_date": "2026-10-10",
  "due_date": "2026-10-24",
  "status": "Dipinjam"
}
```

**Response `201 Created`:**
```json
{
  "id": "14b30c2c-3984-406e-b094-66fb49604262",
  "member_id": "cffc5c10-d426-4bf8-a0ab-610ab3e32ffc",
  "book_id": "92096351-027f-4706-97e6-7e3b9da0fb21",
  "loan_date": "2026-10-10",
  "due_date": "2026-10-24",
  "return_date": null,
  "status": "Dipinjam",
  "created_at": "2026-10-10T17:02:46.561214+00:00"
}
```

---

#### `GET /api/loans` — Ambil Semua Peminjaman

**Response `200 OK`:**
```json
[
  {
    "id": "14b30c2c-3984-406e-b094-66fb49604262",
    "loan_date": "2026-10-10",
    "due_date": "2026-10-24",
    "return_date": null,
    "status": "Dipinjam",
    "members": {
      "id": "cffc5c10-d426-4bf8-a0ab-610ab3e32ffc",
      "name": "Budi Dozemi",
      "email": "budi.baru@example.com"
    },
    "books": {
      "id": "92096351-027f-4706-97e6-7e3b9da0fb21",
      "title": "Laskar Pelangi (Prequel)",
      "author": "Andrea Hirata"
    }
  }
]
```

---

#### `GET /api/loans?status=Terlambat` — Filter by Status

**Response `200 OK`:**
```json
[
  {
    "id": "14b30c2c-3984-406e-b094-66fb49604262",
    "loan_date": "2026-10-10",
    "due_date": "2026-10-24",
    "return_date": "2026-10-10",
    "status": "Terlambat",
    "members": {
      "id": "cffc5c10-d426-4bf8-a0ab-610ab3e32ffc",
      "name": "Budi Dozemi",
      "email": "budi.baru@example.com"
    },
    "books": {
      "id": "92096351-027f-4706-97e6-7e3b9da0fb21",
      "title": "Laskar Pelangi (Prequel)",
      "author": "Andrea Hirata"
    }
  }
]
```

> **Nilai status yang valid:** `Dipinjam` | `Dikembalikan` | `Terlambat`

---

#### `PUT /api/loans/:id` — Kembalikan Buku

**Request Body:**
```json
{
  "return_date": "2026-10-10",
  "status": "Dikembalikan"
}
```

**Response `200 OK`:**
```json
{
  "id": "14b30c2c-3984-406e-b094-66fb49604262",
  "member_id": "cffc5c10-d426-4bf8-a0ab-610ab3e32ffc",
  "book_id": "92096351-027f-4706-97e6-7e3b9da0fb21",
  "loan_date": "2026-10-10",
  "due_date": "2026-10-24",
  "return_date": "2026-10-10",
  "status": "Dikembalikan",
  "created_at": "2026-10-10T17:02:46.561214+00:00"
}
```

---

#### `PUT /api/loans/:id` — Tandai Terlambat

**Request Body:**
```json
{
  "status": "Terlambat"
}
```

**Response `200 OK`:**
```json
{
  "id": "14b30c2c-3984-406e-b094-66fb49604262",
  "member_id": "cffc5c10-d426-4bf8-a0ab-610ab3e32ffc",
  "book_id": "92096351-027f-4706-97e6-7e3b9da0fb21",
  "loan_date": "2026-10-10",
  "due_date": "2026-10-24",
  "return_date": "2026-10-10",
  "status": "Terlambat",
  "created_at": "2026-10-10T17:02:46.561214+00:00"
}
```

---

#### `DELETE /api/loans/:id` — Hapus Peminjaman

**Response `200 OK`:**
```json
{
  "message": "Data peminjaman berhasil dihapus"
}
```

---

## 🚀 Deployment ke Vercel

Proyek dikonfigurasi melalui `vercel.json`.

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Tambahkan **Environment Variables** di Vercel Dashboard:
- `SUPABASE_URL`
- `SUPABASE_KEY`

---

## 🛠️ Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Node.js | ≥ 18 | Runtime JavaScript |
| Express.js | ^5.2.1 | Framework web server |
| Supabase JS | ^2.115.0 | Client database (PostgreSQL) |
| dotenv | ^17.4.2 | Manajemen environment variable |
| nodemon | ^3.1.14 | Auto-reload saat development |
| Vercel | - | Platform deployment |
