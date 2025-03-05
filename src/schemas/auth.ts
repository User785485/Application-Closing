// src/schemas/auth.ts
import { z } from 'zod';

// Validation u00e9mail avec regex spu00e9cifique
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide')
    .regex(emailRegex, 'Format d\'email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(8, 'Le mot de passe doit comporter au moins 8 caractu00e8res'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Le nom est requis')
      .min(2, 'Le nom doit comporter au moins 2 caractu00e8res')
      .max(50, 'Le nom ne doit pas du00e9passer 50 caractu00e8res'),
    email: z
      .string()
      .min(1, 'L\'email est requis')
      .email('Format d\'email invalide')
      .regex(emailRegex, 'Format d\'email invalide'),
    password: z
      .string()
      .min(1, 'Le mot de passe est requis')
      .min(8, 'Le mot de passe doit comporter au moins 8 caractu00e8res')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
      .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
      .regex(/[^a-zA-Z0-9]/, 'Le mot de passe doit contenir au moins un caractu00e8re spu00e9cial'),
    confirmPassword: z
      .string()
      .min(1, 'La confirmation du mot de passe est requise'),
    terms: z
      .boolean()
      .refine((val) => val === true, {
        message: 'Vous devez accepter les conditions gu00e9nu00e9rales',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide')
    .regex(emailRegex, 'Format d\'email invalide'),
});

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Le mot de passe est requis')
      .min(8, 'Le mot de passe doit comporter au moins 8 caractu00e8res')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
      .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
      .regex(/[^a-zA-Z0-9]/, 'Le mot de passe doit contenir au moins un caractu00e8re spu00e9cial'),
    confirmPassword: z
      .string()
      .min(1, 'La confirmation du mot de passe est requise'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

// Types pour la ru00e9utilisation
export type LoginFormType = z.infer<typeof loginSchema>;
export type RegisterFormType = z.infer<typeof registerSchema>;
export type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordFormType = z.infer<typeof updatePasswordSchema>;
