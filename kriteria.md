# Tujuan Akhir
Buat pengujian mulai dari Unit, Integration, dan End-to-End pada Aplikasi Forum Diskusi.
Deploy Aplikasi Forum Diskusi dengan teknik CI/CD.
Memanfaatkan salah satu React Ecosystem pada Aplikasi Forum Diskusi.
## Kriteria Utama 1: Automation Testing

1. Buat minimal dua pengujian fungsi Reducer.
2. Buat minimal dua pengujian Thunk Function.
3. Buat minimal dua pengujian React Components.
4. Buat minimal satu pengujian End-to-End untuk alur login aplikasi.
5. Wajib menulis skenario pengujian pada masing-masing berkas pengujian.
6. Pengujian dapat dijalankan dengan perintah npm test dan npm run e2e.
### Catatan penting.
Anda bisa tentukan sendiri fungsi reducer, thunk, dan React component yang hendak diuji. Untuk mengasah kemampuan, kami sarankan untuk menguji unit yang kompleks. Contonya, fungsi reducer yang memiliki banyak kondisi atau fungsi thunk yang men-dispatch banyak action.

## Kriteria Utama 2: Deployment Aplikasi

1. Deploy aplikasi dengan menggunakan teknik CI/CD.
2. Continuous Integration diterapkan dengan GitHub Actions.
3. Continuous Deployment diterapkan dengan Vercel.
4. Memproteksi branch master.
5. Melampirkan URL Vercel aplikasi Anda pada catatan submission.
6. Melampirkan screenshot sebagai bukti telah menerapkan konfigurasi CI/CD dan branch protection dengan benar. Screenshot yang perlu dilampirkan:
    - 1_ci_check_error: menunjukkan CI check error karena pengujian gagal, contohnya.
    - 2_ci_check_pass: menunjukkan CI check pass karena pengujian lolos, contohnya.
    - 3_branch_protection: menunjukkan branch proteksi pada halaman PR, contohnya.

### Catatan penting.
- Screenshot dilampirkan di dalam berkas ZIP proyek. Berikut contoh struktur folder proyeknya.
- Branch protection hanya bisa dilakukan di repository public, tetapi untuk meminimalisir tingkat plagiarism ke depannya, kami sarankan untuk mengubah repository menjadi private setelah proses penilaian submission selesai.

## Kriteria Utama 3: Memanfaatkan Salah Satu Ecosystem React
1. Memanfaatkan minimal satu React Ecosystem pada daftar berikut. https://github.com/dicodingacademy/awesome-react-ecosystem#react-tools
2. Berikut penggunaan Ecosystem React yang tidak kami pertimbangkan untuk memenuhi kriteria.
    - Create React Apps
    - Vite
    - React Router
    - React Icons
    - Redux
    - Redux Thunk 
    - Redux Toolkit
    - Jest
    - Vitest
    - React Testing Library

## Kriteria Utama 4: Mempertahankan Kriteria Submission Sebelumnya

Aplikasi harus tetap mempertahankan kriteria utama yang ada di submission sebelumnya.

1. Fungsionalitas Aplikasi
2. Bugs Highlighting
3. Arsitektur Aplikasi