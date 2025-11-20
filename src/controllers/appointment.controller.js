import { createAppointment, getAppointments, getAppointmentById, deleteAppointment, updateAppointment, updateAppointmentStage } from '../repositories/appointment.repository.js';
import { AppointmentStage } from '../enums/appointmentStage.enum.js';
import { AppointmentPriority, AppointmentPriorityMap } from '../enums/appointmentPriority.enum.js';
import { createPet, updatePet } from '../repositories/pet.repository.js';
import { PetType } from '../enums/petType.enum.js';
import { name2Code, code2Name} from "../helpers/priorityMapping.js";


const validatePetData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new TypeError('Invalid pet data: Data should be an object');
  }

  const requiredFields = ['name', 'type'];
  const isValid = requiredFields.every(field => data.hasOwnProperty(field));
  if (!isValid) {
    throw new TypeError('Invalid pet data: Missing required fields');
  }

  if (!Object.values(PetType).includes(data.type)) {
    throw new TypeError(`Invalid pet data: Unknown pet type ${data.type}`);
  }
};

const validateAppointmentData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new TypeError('Invalid appointment data: Data should be an object');
  }

  const requiredFields = ['stage'];
  const isValid = requiredFields.every(field => data.hasOwnProperty(field));
  if (!isValid) {
    throw new TypeError('Invalid appointment data: Missing required fields');
  }

  if (!Object.values(AppointmentStage).includes(data.stage)) {
    throw new TypeError(`Invalid appointment data: Unknown appointment stage ${data.stage}`);
  }

  if (!AppointmentPriorityMap[data.priority]) {
    throw new TypeError(`Invalid appointment data: Unknown appointment priority ${data.priority}`);
  }
};

export const postAppointmentController = async (req, res) => {
  const reqBody = req.body;
  try {
    const petData = reqBody.pet;
    validatePetData(petData);
    validateAppointmentData(reqBody);

    const pet = await createPet({
      name: petData.name,
      type: petData.type,
      breed: petData.breed,
      age: petData.age,
      weight: petData.weight,
      tutor_name: petData.tutor_name
    });

    const appointmentData = {
      petId: pet.id,
      description: reqBody.description,
      arrivalAt: reqBody.arrival_at,
      stage: reqBody.stage,
      priority: AppointmentPriorityMap[reqBody.priority] ,
    };
    
    const appointment =  await createAppointment(appointmentData);
    res.status(201).json(appointment);
  } catch (err) {
    console.error('Error creating appointment:', err);
    if (err instanceof TypeError) {
      res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error creating appointment' });
  }
};

export const getAppointmentsController = async (req, res) => {
  try {
    const appointments = await getAppointments();
    res.status(200).json(appointments.map(appointment => {
      return {
        id: appointment.id,
        priority: code2Name(appointment.priority),
        arrival_at: appointment.arrival_at,
        stage: appointment.stage,
        description: appointment.description,
        pet: appointment.pet
      }
    }));
  } catch (err) {
    console.error('Error getting appointment:', err);
    res.status(500).json({ error: 'Error getting appointments' });
  }
};

export const getAppointmentController = async (req, res) => {
  try {
    const appointment = await getAppointmentById(req.params.id);
    res.status(200).json({
        id: appointment.id,
        priority: code2Name(appointment.priority),
        arrival_at: appointment.arrival_at,
        stage: appointment.stage,
        description: appointment.description,
        pet: appointment.pet
      
    });
  } catch (err) {
    console.error('Error getting appointment:', err);
    res.status(500).json({ error: 'Error creating appointment' });
  }
};

export const putAppointmentController = async (req, res) => {
  const appointmentId = req.params.id;
  const body = req.body;

  try {
    // Buscar o appointment existente (para saber o pet_id)
    const appointment = await getAppointmentById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const petId = appointment.pet_id;

    // =============================
    // 1) VALIDAR appointment
    // =============================
    if (body.stage !== undefined) {
      if (!Object.values(AppointmentStage).includes(body.stage)) {
        throw new TypeError(`Invalid appointment stage ${body.stage}`);
      }
    }

    if (body.priority !== undefined) {
      if (!AppointmentPriorityMap[body.priority]) {
        throw new TypeError(`Invalid appointment priority ${body.priority}`);
      }
    }

    // =============================
    // 2) VALIDAR pet (se enviado)
    // =============================
    if (body.pet !== undefined) {
      validatePetData(body.pet);
    }

    // =============================
    // 3) Atualizar PET (se enviado)
    // =============================
    if (body.pet) {
      await updatePet(petId, {
        name: body.pet.name,
        type: body.pet.type,
        breed: body.pet.breed,
        age: body.pet.age,
        weight: body.pet.weight,
        tutor_name: body.pet.tutor_name,
      });
    }

    // =============================
    // 4) Atualizar appointment
    // =============================
    const updatedAppointment = await updateAppointment(appointmentId, {
      description: body.description,
      arrivalAt: body.arrival_at,
      stage: body.stage,
      priority: name2Code(body.priority),
    });

    // =============================
    // 5) Resposta
    // =============================
    res.status(200).json({
      id: updatedAppointment.id,
      priority: code2Name(updatedAppointment.priority),
      arrival_at: updatedAppointment.arrival_at,
      stage: updatedAppointment.stage,
      description: updatedAppointment.description,
      pet: updatedAppointment.pet
    });

  } catch (err) {
    console.error("Error updating appointment:", err);

    if (err instanceof TypeError) {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: "Error updating appointment" });
  }
};


export const deleteAppointmentController = async (req, res) => {
  const appointmentId = req.params.id;

  try {
    await deleteAppointment(appointmentId);

    res.status(204).send(); // Sem conteúdo
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ error: 'Error deleting appointment' });
  }
};

const validateStagePatch = (stage) => {
  if (!stage) {
    throw new TypeError('Invalid appointment data: stage is required');
  }

  if (!Object.values(AppointmentStage).includes(stage)) {
    throw new TypeError(`Invalid appointment data: Unknown appointment stage ${stage}`);
  }
};

export const patchAppointmentStageController = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;

    // valida campo enviado
    validateStagePatch(stage);

    // atualiza somente o stage
    const appointment = await updateAppointmentStage(id, stage);

    // retorna no mesmo formato do GET
    res.status(200).json({
      id: appointment.id,
      priority: Object.values(AppointmentPriority).find(
        key => AppointmentPriority[key] === appointment.priority
      ),
      arrival_at: appointment.arrival_at,
      stage: appointment.stage,
      description: appointment.description,
      pet: appointment.pet
    });

  } catch (err) {
    console.error('Error updating appointment stage:', err);

    if (err instanceof TypeError) {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: 'Error updating appointment stage' });
  }
};
