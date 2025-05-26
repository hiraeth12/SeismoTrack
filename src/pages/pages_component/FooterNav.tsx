// src/components/footer/FooterNav.tsx
export default function FooterNav() {
  return (
    <div>
      <h4 className="font-semibold text-black mb-4">Navigasi</h4>
      <ul className="space-y-2 text-slate-600 text-sm">
        <li><a href="#beranda" className="hover:text-[#6A7D5A]">Home</a></li>
        <li><a href="#fitur" className="hover:text-[#6A7D5A]">Fitur</a></li>
        <li><a href="#grafik" className="hover:text-[#6A7D5A]">Grafik</a></li>
        <li><a href="#about" className="hover:text-[#6A7D5A]">Tentang Kami</a></li>
      </ul>
    </div>
  );
}
