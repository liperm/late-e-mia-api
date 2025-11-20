import { AppointmentPriorityMap, AppointmentPriority } from '../enums/appointmentPriority.enum.js';


export const name2Code = (name) => {
  return Object.keys(AppointmentPriorityMap).find(key => key === name.toLowerCase());
};

export const code2Name = (code) => {
  const name = Object.keys(AppointmentPriority).find(
    (key) => AppointmentPriority[key] === code
  );
  return name ? name.toLowerCase() : null;
};