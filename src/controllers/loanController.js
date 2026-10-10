import { LoanModel } from "../models/loanModel.js";

// Helper fungsi validasi data peminjaman
const validateLoanInput = (data) => {
  if (!data.member_id) {
    throw new Error("member_id wajib diisi");
  }
  if (!data.book_id) {
    throw new Error("book_id wajib diisi");
  }
  if (!data.loan_date) {
    throw new Error("loan_date (tanggal pinjam) wajib diisi");
  }
  if (!data.due_date) {
    throw new Error("due_date (tanggal jatuh tempo) wajib diisi");
  }
};

export const LoanController = {
  async getAll(req, res) {
    try {
      // Filter query: GET /loans?status=Terlambat&member_id=xxx
      const { status, member_id } = req.query;
      const loans = await LoanModel.getAll(status, member_id);
      res.json(loans);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const loan = await LoanModel.getById(req.params.id);
      res.json(loan);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      console.log("Memulai validasi input peminjaman ...");
      // 1. Validasi input
      validateLoanInput(req.body);

      // 2. Set status default jika tidak disertakan
      const payload = {
        ...req.body,
        status: req.body.status || "Dipinjam",
      };

      // 3. Simpan ke database
      const loan = await LoanModel.create(payload);
      res.status(201).json(loan);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;

      // Update data peminjaman (misal: kembalikan buku / ubah status)
      const loan = await LoanModel.update(id, req.body);
      res.json(loan);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      await LoanModel.remove(req.params.id);
      res.json({ message: "Data peminjaman berhasil dihapus" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
