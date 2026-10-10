import { supabase } from "../config/supabaseClient.js";

export const MemberModel = {
  async getAll(name = "", page, limit) {
    let query = supabase.from("members").select("*");

    // Filter pencarian berdasarkan nama
    if (name) query = query.ilike("name", `%${name}%`);

    // Pagination
    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      const from = (pageNum - 1) * limitNum;
      const to = from + limitNum - 1;

      query = query.range(from, to);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(member) {
    const { data, error } = await supabase
      .from("members")
      .insert([member])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, member) {
    const { data, error } = await supabase
      .from("members")
      .update(member)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) throw error;
    return { message: "Anggota berhasil dihapus" };
  },
};
