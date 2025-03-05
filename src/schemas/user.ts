// src/schemas/user.ts
import { z } from 'zod';

export const userProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit comporter au moins 2 caractu00e8res')
    .max(50, 'Le nom ne doit pas du00e9passer 50 caractu00e8res'),
  avatar_url: z
    .string()
    .url('URL d\'avatar invalide')
    .nullable()
    .optional(),
  bio: z
    .string()
    .max(500, 'La bio ne doit pas du00e9passer 500 caractu00e8res')
    .nullable()
    .optional(),
  birthdate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)')
    .nullable()
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, 'Numu00e9ro de tu00e9lu00e9phone invalide')
    .nullable()
    .optional(),
  address: z
    .string()
    .max(200, 'L\'adresse ne doit pas du00e9passer 200 caractu00e8res')
    .nullable()
    .optional(),
});

export const appointmentSchema = z.object({
  title: z
    .string()
    .min(3, 'Le titre doit comporter au moins 3 caractu00e8res')
    .max(255, 'Le titre ne doit pas du00e9passer 255 caractu00e8res'),
  description: z
    .string()
    .max(1000, 'La description ne doit pas du00e9passer 1000 caractu00e8res')
    .nullable()
    .optional(),
  start_time: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Format de date invalide (YYYY-MM-DDTHH:MM)'),
  end_time: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Format de date invalide (YYYY-MM-DDTHH:MM)'),
  status: z
    .enum(['pending', 'confirmed', 'canceled', 'completed'])
    .default('pending'),
  location: z
    .string()
    .max(200, 'L\'emplacement ne doit pas du00e9passer 200 caractu00e8res')
    .nullable()
    .optional(),
}).refine((data) => new Date(data.start_time) < new Date(data.end_time), {
  message: 'L\'heure de fin doit u00eatre postu00e9rieure u00e0 l\'heure de du00e9but',
  path: ['end_time'],
});

export const goalSchema = z.object({
  title: z
    .string()
    .min(3, 'Le titre doit comporter au moins 3 caractu00e8res')
    .max(255, 'Le titre ne doit pas du00e9passer 255 caractu00e8res'),
  description: z
    .string()
    .max(1000, 'La description ne doit pas du00e9passer 1000 caractu00e8res')
    .nullable()
    .optional(),
  target_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)')
    .nullable()
    .optional(),
  progress: z
    .number()
    .min(0, 'Le progrès doit u00eatre entre 0 et 100')
    .max(100, 'Le progrès doit u00eatre entre 0 et 100')
    .default(0),
  status: z
    .enum(['active', 'completed', 'abandoned'])
    .default('active'),
});

// Types pour la ru00e9utilisation
export type UserProfile = z.infer<typeof userProfileSchema>;
export type Appointment = z.infer<typeof appointmentSchema>;
export type Goal = z.infer<typeof goalSchema>;
