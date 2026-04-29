const listKontainer = document.getElementById('kuliner-list');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.btn-filter');

// Variabel penampung data agar bisa diakses secara global oleh filter & search
let dataKulinerGlobal = [];

async function muatDataKuliner() {
    try {
        // Mengambil data dari file json (pastikan nama file sesuai, misal: data.json)
        const response = await fetch('data.json');
        dataKulinerGlobal = await response.json();
        
        // Tampilkan semua data saat pertama kali dimuat
        tampilkanKeLayar(dataKulinerGlobal);

    } catch (error) {
        console.error("Terjadi kesalahan saat memuat data:", error);
        // Fallback jika fetch gagal (opsional: isi dengan data manual jika perlu)
    }
}

function tampilkanKeLayar(kuliner) {
    const listKontainer = document.getElementById('kuliner-list');
    listKontainer.innerHTML = ""; 

    kuliner.forEach(item => {
        // Langsung gunakan string dari JSON
        const labelHarga = item.harga_estimasi;

        const kartuHTML = `
        <div class="card" onclick="bukaDetail(${item.id})">
            <img src="${item.gambar}" alt="${item.nama}">
            <div class="card-content">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="category">${item.kategori}</span>
                    <span class="rating" style="color: #fbc02d; font-weight: bold;">⭐ ${item.rating}</span>
                </div>
                <h3>${item.nama}</h3>
                <p style="color: #666; font-size: 0.85rem;">📍 ${item.asal}</p>
                <hr>
                <span class="price">${labelHarga}</span>
            </div>
        </div>
        `;
    
        listKontainer.innerHTML += kartuHTML;
    });

    // Update Hero Background secara otomatis dari data pertama
    if (kuliner.length > 0) {
        const hero = document.querySelector('.hero');
        hero.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${kuliner[0].gambar}')`;
    }
}

// Pastikan fungsi bukaDetail juga menampilkan harga yang sama
function bukaDetail(id) {
    const item = dataKulinerGlobal.find(d => d.id === id);
    const modalBody = document.getElementById('modalBody');

    if (item) {
        modalBody.innerHTML = `
            <img src="${item.gambar}" style="width:100%; border-radius: 10px; height: 250px; object-fit: cover;">
            <h2>${item.nama}</h2>
            <p><strong>Estimasi Harga:</strong> ${item.harga_estimasi}</p>
            <p><strong>Asal:</strong> ${item.asal}</p>
            <p><strong>Rating:</strong> ⭐ ${item.rating}</p>
        `;
        document.getElementById('detailModal').style.display = "block";
    }
}

// Fitur Pencarian
searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const hasilCari = dataKulinerGlobal.filter(item =>
        item.nama.toLowerCase().includes(keyword) ||
        item.asal.toLowerCase().includes(keyword)
    );
    tampilkanKeLayar(hasilCari);
});

// Fitur Filter Kategori
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Atur tombol aktif
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const kategoriTerpilih = btn.dataset.category;

        if (kategoriTerpilih === "Semua") {
            tampilkanKeLayar(dataKulinerGlobal);
        } else {
            const hasilFilter = dataKulinerGlobal.filter(item => item.kategori === kategoriTerpilih);
            tampilkanKeLayar(hasilFilter);
        }
    });
});

// Fungsi Modal Detail
function bukaDetail(id) {
    const item = dataKulinerGlobal.find(d => d.id === id);
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');

    if (item) {
        modalBody.innerHTML = `
            <img src="${item.gambar}" style="width:100%; border-radius: 10px; margin-bottom: 15px; height: 300px; object-fit: cover;">
            <h2>${item.nama}</h2>
            <p><strong>Kategori:</strong> ${item.kategori}</p>
            <p><strong>Asal Daerah:</strong> ${item.asal}</p>
            <p><strong>Estimasi Harga:</strong> ${item.harga_estimasi}</p>
            <p><strong>Rating:</strong> ⭐ ${item.rating} / 5.0</p>
            <p style="margin-top: 10px; line-height: 1.6;">Nikmati kelezatan autentik ${item.nama} yang merupakan warisan kuliner khas dari ${item.asal}.</p>
        `;
        modal.style.display = "block";
    }
}

// Menutup Modal
document.querySelector('.close-btn').onclick = () => {
    document.getElementById('detailModal').style.display = "none";
};

// Menutup modal jika area luar modal diklik
window.onclick = (event) => {
    const modal = document.getElementById('detailModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// Jalankan fungsi muat data
muatDataKuliner();