import { MemberModel } from "../models/memberModel.js";

// Helper fungsi validasi anggota
const validateMemberInput = (data) => {
  if (!data.email || !data.email.includes("@")) {
    throw new Error("Email wajib memiliki karakter @");
  }
  if (!data.phone || data.phone.length < 10) {
    throw new Error("Phone (nomor telepon) harus diisi minimal 10 karakter");
  }
};

export const MemberController = {
  async getAll(req, res) {
    try {
      // Mengambil parameter dari req.query (GET URL params)
      const { name, page, limit } = req.query;
      const members = await MemberModel.getAll(name, page, limit);
      res.json(members);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const member = await MemberModel.getById(req.params.id);
      res.json(member);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      console.log("Memulai validasi input anggota ...");
      // 1. Panggil helper fungsi validasi
      validateMemberInput(req.body);

      // 2. Simpan ke database jika lolos validasi
      const member = await MemberModel.create(req.body);
      res.status(201).json(member);
    } catch (err) {
      // 3. Tangkap error validasi (status 400)
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;

      // 1. Panggil helper fungsi validasi
      validateMemberInput(req.body);

      // 2. Update database jika lolos validasi
      const member = await MemberModel.update(id, req.body);
      res.json(member);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      await MemberModel.remove(req.params.id);
      res.json({ message: "Anggota berhasil dihapus" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
