import { supabase } from "../database.js";
import { AppointmentPriority, AppointmentPriorityMap } from "../enums/appointmentPriority.enum.js";
import { AppointmentStage } from "../enums/appointmentStage.enum.js";

export const createAppointment = async ({
  petId,
  description,
  arrivalAt,
  stage=AppointmentStage.WAITING_FOR_ATTENDANCE,
  priority=AppointmentPriority.NORMAL,
}) => {
  const { data: createdAppointment, error } = await supabase
    .from('appointment')
    .insert([
      {
        pet_id: petId,
        description,
        arrival_at: arrivalAt,
        stage,
        priority
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return createdAppointment;
};

export const getAppointments = async () => {
  const { data: appointments, error } = await supabase
    .from('appointment')
    .select(`
      id,
      priority,
      arrival_at,
      stage,
      description,
      pet(id, name, tutor_name, type, breed)
    `)
    .order('arrival_at', { ascending: true })
    .order('priority', { ascending: true });

  if (error) throw error;
  return appointments;
};

export const getAppointmentById = async (id) => {
  const { data: appointments, error } = await supabase
    .from('appointment')
    .select(`
      id,
      pet_id,
      priority,
      arrival_at,
      stage,
      description,
      pet(id, name, tutor_name, type, breed)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return appointments;
};

export const updateAppointment = async (id, data) => {
  const payload = {
    description: data.description,
    arrival_at: data.arrivalAt,
    stage: data.stage,
    priority: data.priority
  };

  if (data.priority !== undefined) {
    payload.priority = AppointmentPriorityMap[data.priority];
  }

  Object.keys(payload).forEach(
    key => payload[key] === undefined && delete payload[key]
  );

  const { data: updated, error } = await supabase
    .from("appointment")
    .update(payload)
    .eq("id", id)
    .select(`
      *,
      pet(*)
    `)
    .single();

  if (error) throw error;

  return updated;
};


export const deleteAppointment = async (id) => {
  const { error } = await supabase
    .from('appointment')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return true;
};


export const updateAppointmentStage = async (id, stage) => {
  const { data, error } = await supabase
    .from('appointment')
    .update({ stage })
    .eq('id', id)
    .select(`
      id,
      priority,
      arrival_at,
      stage,
      description,
      pet:pet_id (*)
    `)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
