import AppShell from '../components/AppShell';
import MaterialIcon from '../components/MaterialIcon';

const privacySections = [
  {
    title: 'Data akun',
    body: 'Aplikasi menggunakan data akun dari Dicoding Forum API, seperti nama, email, avatar, dan token autentikasi untuk menjaga sesi login.',
  },
  {
    title: 'Konten komunitas',
    body: 'Thread, komentar, dan vote yang Anda buat dikirim ke Dicoding Forum API dan dapat ditampilkan kepada pengguna lain sesuai fungsi forum.',
  },
  {
    title: 'Penyimpanan lokal',
    body: 'Token akses disimpan di localStorage browser agar Anda tetap login. Token dihapus ketika Anda menekan tombol sign out.',
  },
  {
    title: 'Batasan aplikasi',
    body: 'Supatechia Forum adalah client React untuk API latihan. Pengelolaan data utama, autentikasi, dan respons API mengikuti layanan Dicoding Forum API.',
  },
];

function PrivacyPage() {
  return (
    <AppShell active="privacy">
      <section className="info-page">
        <header className="page-heading">
          <div>
            <h1>Privacy Policy</h1>
            <p>Ringkasan cara aplikasi memakai data untuk menjalankan fitur forum diskusi.</p>
          </div>
        </header>

        <section className="privacy-hero">
          <div>
            <MaterialIcon name="verified_user" />
          </div>
          <div>
            <h2>Transparan dan seperlunya</h2>
            <p>
              Data hanya digunakan untuk autentikasi, menampilkan profil pembuat konten, menyimpan sesi,
              serta menjalankan fitur thread, komentar, leaderboard, dan vote.
            </p>
          </div>
        </section>

        <div className="info-grid info-grid--privacy">
          {privacySections.map((section) => (
            <article className="info-card" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </div>

        <section className="info-panel">
          <h2>Kontrol pengguna</h2>
          <p>
            Anda dapat keluar kapan saja melalui tombol sign out di top bar. Setelah keluar, token akses lokal
            dihapus sehingga tindakan yang memerlukan autentikasi tidak dapat dilakukan sampai Anda login lagi.
          </p>
        </section>
      </section>
    </AppShell>
  );
}

export default PrivacyPage;
