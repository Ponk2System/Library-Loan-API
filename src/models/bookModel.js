import { supabase } from "../config/supabaseClient.js";

export const BookModel = {
  async create(title, author, isbn, stock) {
    const { data, error } = await supabase
      .from("books")
      .insert([{ title, author, isbn, stock }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase.from("books").select("*");
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, title, author, isbn, stock) {
    const { data, error } = await supabase
      .from("books")
      .update({ title, author, isbn, stock })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) throw error;
    return { message: "Buku berhasil dihapus" };
  },
};
