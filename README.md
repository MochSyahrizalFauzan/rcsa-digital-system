# RCSA Manrisk

Sistem manajemen risiko dan RCSA berbasis Next.js, Express, dan MySQL.

## Fitur

- Autentikasi JWT dengan access/refresh token berbasis HttpOnly Cookie.
- Manajemen user, role, permission, dan unit kerja.
- Master RCSA dengan assignment, approval, publish, dan archive.
- Assessment RCSA dengan draft, submit, review, dan histori.
- Risk register dan master risk.
- Dashboard monitoring RCSA dan aktivitas login.
- Integrasi Genkit dengan Google Gemini untuk pengembangan fitur AI risk summary.

## Arsitektur

```text
Browser
  -> Next.js frontend (port 9002)
  -> Express modular monolith (port 5001)
  -> MySQL
```

Backend menggunakan pola:

```text
Routes -> Middleware -> Controller -> Service -> Repository -> MySQL
```

Module backend berada di [`service/modules`](./service/modules):

- `auth`: login, refresh token, logout, session, profile.
- `users`: users, roles, permissions, units, audit login.
- `rcsa-master`: lifecycle master RCSA dan approval.
- `rcsa-assessment`: draft, submit, review, dan report assessment.
- `dashboard`: agregasi statistik dan progress.
- `risks`: CRUD risk register dan generate risk dari master.

## Prasyarat

- Node.js 20 atau lebih baru.
- MySQL 8 atau kompatibel.
- Database `smart_database` beserta tabel aplikasi.

## Konfigurasi environment

Buat file `.env` di root proyek:

```env
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=smart_database
DB_PORT=3306

JWT_SECRET=replace-with-a-long-random-secret
REFRESH_SECRET=replace-with-a-different-long-random-secret
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

REFACTOR_PORT=5001
NEXT_PUBLIC_API_URL=http://localhost:5001
```

Jangan commit file `.env` atau secret ke repository.

## Instalasi dan menjalankan aplikasi

```bash
npm install
npm run server:new
```

Backend refactor berjalan di `http://localhost:5001`.

Pada terminal lain:

```bash
npm run dev
```

Frontend berjalan di `http://localhost:9002`.

Endpoint pemeriksaan kesehatan:

```text
GET http://localhost:5001/health
```

Response yang diharapkan:

```json
{
  "status": "UP",
  "database": "CONNECTED"
}
```

Backend lama tersedia untuk kompatibilitas sementara melalui:

```bash
npm run server:old
```

Backend lama menggunakan port `5000`; gunakan backend refactor untuk pengembangan utama.

## Endpoint utama

### Auth

```text
POST /login
POST /refresh-token
POST /logout
GET  /me
GET  /profile
```

### Users

```text
GET  /users
POST /users
PUT  /users/:id/status
GET  /roles
GET  /roles/:roleId/permissions
GET  /user-logins
GET  /units
GET  /units/:id
```

### RCSA master

```text
GET    /rcsa/master/list
GET    /rcsa/master/:id/detail
POST   /rcsa/master
PUT    /rcsa/master/:id
DELETE /rcsa/master/:id
POST   /rcsa/master/:id/assign-units
POST   /rcsa/master/:id/submit
POST   /rcsa/master/:id/decision
POST   /rcsa/master/:id/publish
POST   /rcsa/master/:id/archive
GET    /rcsa/master/approval/inbox
GET    /rcsa/master/active
GET    /rcsa/master/by-unit/:unitId
```

### RCSA assessment

```text
GET  /rcsa/assessment
GET  /rcsa/assessment/drafts
GET  /rcsa/assessment/:id
POST /rcsa/assessment
PUT  /rcsa/assessment/:id
PUT  /rcsa/assessment/:id/submit
GET  /rcsa/review/queue
POST /rcsa/review/:assessmentId
GET  /rcsa/review/:assessmentId/notes
GET  /rcsa/assessment/reviewed
GET  /rcsa/report/reviewed
GET  /rcsa/assessment/mine-reviewed
```

### Dashboard dan risk

```text
GET    /dashboard/summary
GET    /risks
POST   /risks
PUT    /risks/:id
DELETE /risks/:id
GET    /risks/masters
POST   /risks/master
POST   /risks/generate
```

Sebagian besar endpoint selain login, refresh token, roles, dan units memerlukan autentikasi serta permission RBAC.

## Validasi

Perintah validasi yang tersedia:

```bash
npm run typecheck
npm run build
```

Validasi backend:

```powershell
Get-ChildItem -Recurse -File service -Filter *.js |
  ForEach-Object { node --check $_.FullName }
```

Health check hanya memvalidasi aplikasi Express dan koneksi database. Pengujian end-to-end tetap perlu dilakukan menggunakan akun dan data MySQL nyata untuk login, permission, workflow RCSA, dashboard, dan risk register.

## Deployment

Konfigurasi Firebase App Hosting berada di [`apphosting.yaml`](./apphosting.yaml). Secret production harus disediakan melalui environment/secret manager dan tidak menggunakan nilai default.
