import { supabase } from "../database.js";

export const createUser = async (data) => {
  const { data: createdUser, error } = await supabase
    .from('user')
    .insert([
      {
        name: data.name,
        username: data.username,
        password: data.password
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return createdUser;
};


export const getUserByUsername = async (username) => {
  const { data: user, error } = await supabase
    .from('user')
    .select()
    .eq('username', username)
    .single();

  if (error && error.code !== "PGRST116") throw error;  
  return user ?? null;
};


export const getUserById = async (id) => {
  const { data: user, error } = await supabase
    .from('user')
    .select()
    .eq('id', id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return user ?? null;
};
