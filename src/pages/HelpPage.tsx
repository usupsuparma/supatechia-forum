import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell';
import MaterialIcon from '../components/MaterialIcon';

const helpTopics = [
  {
    icon: 'person_add',
    title: 'Mendaftar dan masuk',
    body: 'Buat akun baru lewat halaman register, lalu gunakan email dan password yang sama untuk login ke Supatechia Forum.',
  },
  {
    icon: 'edit_square',
    title: 'Membuat thread',
    body: 'Gunakan tombol Create Thread, isi judul, kategori, dan isi diskusi. Thread yang baik biasanya punya judul spesifik dan konteks yang cukup.',
  },
  {
    icon: 'forum',
    title: 'Membalas diskusi',
    body: 'Buka detail thread, tulis komentar pada area reply, lalu kirim. Komentar akan muncul bersama nama, avatar, dan waktu pembuatan.',
  },
  {
    icon: 'how_to_vote',
    title: 'Memberi vote',
    body: 'Gunakan tombol panah atas atau bawah pada thread dan komentar. Tombol akan berubah warna sesuai vote aktif dan skor diperbarui langsung.',
  },
];

function HelpPage() {
  return (
    <AppShell active="help">
      <section className="info-page">
        <header className="page-heading">
          <div>
            <h1>Help Center</h1>
            <p>Panduan cepat untuk menggunakan fitur utama Supatechia Forum.</p>
          </div>
          <Link className="button button--primary" to="/threads/new">
            <MaterialIcon name="add" />
            Create Thread
          </Link>
        </header>

        <div className="info-grid">
          {helpTopics.map((topic) => (
            <article className="info-card" key={topic.title}>
              <div className="info-card__icon">
                <MaterialIcon name={topic.icon} />
              </div>
              <h2>{topic.title}</h2>
              <p>{topic.body}</p>
            </article>
          ))}
        </div>

        <section className="info-panel">
          <h2>Alur penggunaan yang disarankan</h2>
          <div className="timeline-list">
            <div>
              <span>1</span>
              <p>Login agar dapat membuat thread, komentar, dan vote.</p>
            </div>
            <div>
              <span>2</span>
              <p>Gunakan filter kategori atau pencarian untuk menemukan diskusi yang relevan.</p>
            </div>
            <div>
              <span>3</span>
              <p>Buka thread untuk membaca detail, memberi vote, atau menambahkan komentar.</p>
            </div>
            <div>
              <span>4</span>
              <p>Lihat leaderboard untuk mengetahui kontributor dengan score tertinggi.</p>
            </div>
          </div>
        </section>
      </section>
    </AppShell>
  );
}

export default HelpPage;
