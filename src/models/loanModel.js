import { supabase } from "../config/supabaseClient.js";

export const LoanModel = {
  async getAll(status = null, member_id = null) {
    let query = supabase
      .from("loans")
      .select(
        `
        id, loan_date, due_date, return_date, status,
        members ( id, name, email ),
        books ( id, title, author )
        `
      );

    // Filter berdasarkan status (contoh: Dipinjam, Dikembalikan, Terlambat)
    if (status) query = query.eq("status", status);

    // Filter berdasarkan member_id
    if (member_id) query = query.eq("member_id", member_id);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("loans")
      .select(
        `
        id, loan_date, due_date, return_date, status,
        members ( id, name, email, phone ),
        books ( id, title, author, isbn )
        `
      )
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from("loans")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from("loans")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from("loans").delete().eq("id", id);
    if (error) throw error;
    return { message: "Data peminjaman berhasil dihapus" };
  },
};
