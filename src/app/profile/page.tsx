"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userProfileSchema, type UserProfile } from '@/schemas/user';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const { user } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UserProfile>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: '',
      avatar_url: null,
      bio: null,
      birthdate: null,
      phone: null,
      address: null,
    },
  });

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setAvatarUrl(data.avatar_url);
        // Mettre à jour les champs du formulaire
        Object.entries(data).forEach(([key, value]) => {
          // @ts-ignore - Le type dynamique est difficile à typer correctement ici
          setValue(key, value);
        });
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement du profil:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: UserProfile) => {
    if (!user) return;

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...data,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setSaveSuccess(true);
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde du profil:', error.message);
      setSaveError(error.message || 'Une erreur est survenue lors de la sauvegarde du profil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${user.id}/${Math.random()}.${fileExt}`;

    setIsSaving(true);
    setSaveError(null);

    try {
      // Uploader le fichier
      const { error: uploadError } = await supabase.storage
        .from('user-content')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: urlData } = await supabase.storage
        .from('user-content')
        .getPublicUrl(filePath);

      setAvatarUrl(urlData.publicUrl);
      setValue('avatar_url', urlData.publicUrl);

      // Mettre à jour le profil avec le nouvel avatar
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;
    } catch (error: any) {
      console.error('Erreur lors du changement d\'avatar:', error.message);
      setSaveError(error.message || 'Une erreur est survenue lors du changement d\'avatar');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Profil utilisateur</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Colonne avatar */}
        <div className="md:col-span-1">
          <Card>
            <Card.Body className="flex flex-col items-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4 bg-gray-200 dark:bg-gray-700">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <label className="w-full cursor-pointer">
                <span className="block w-full py-2 px-3 text-center text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors">
                  Changer d'avatar
                </span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarChange}
                  disabled={isSaving}
                />
              </label>
              
              <div className="text-sm text-gray-500 mt-4 text-center">
                <p>JPG, PNG ou GIF</p>
                <p>Taille max: 2 MB</p>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Colonne informations */}
        <div className="md:col-span-2">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">Informations personnelles</h2>
              <p className="text-sm text-gray-500">Mettez à jour vos informations personnelles</p>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {saveError && (
                  <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                    {saveError}
                  </div>
                )}
                
                {saveSuccess && (
                  <div className="p-3 rounded-md bg-green-50 text-green-500 text-sm">
                    Profil mis à jour avec succès!
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="bio" className="block text-sm font-medium">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    {...register('bio')}
                    className={`w-full px-3 py-2 border rounded-md ${errors.bio ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800`}
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="birthdate" className="block text-sm font-medium">
                      Date de naissance
                    </label>
                    <input
                      id="birthdate"
                      type="date"
                      {...register('birthdate')}
                      className={`w-full px-3 py-2 border rounded-md ${errors.birthdate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800`}
                    />
                    {errors.birthdate && (
                      <p className="mt-1 text-sm text-red-500">{errors.birthdate.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium">
                      Téléphone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+33 6 12 34 56 78"
                      {...register('phone')}
                      className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-medium">
                    Adresse
                  </label>
                  <textarea
                    id="address"
                    rows={2}
                    {...register('address')}
                    className={`w-full px-3 py-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => reset()}
                    disabled={isSaving}
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    isLoading={isSaving}
                    disabled={isSaving}
                  >
                    Enregistrer
                  </Button>
                </div>
              </form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
