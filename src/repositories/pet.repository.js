import { supabase } from "../database.js";

export const createPet = async ({
  name,
  type,
  breed,
  age,
  weight,
  tutor_name,
}) => {
  const { data: createdPet, error } = await supabase
    .from('pet')
    .insert([
      {
        name,
        type,
        breed,
        age,
        weight,
        tutor_name,
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return createdPet;
};

export const updatePet = async (id, data) => {
  const { data: updated, error } = await supabase
    .from("pet")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return updated;
};

