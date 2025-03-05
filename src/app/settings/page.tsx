"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useUIStore } from '@/store/ui';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const { user } = useSupabaseAuth();
  const { isDarkMode, toggleDarkMode } = useUIStore();
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [timeZone, setTimeZone] = useState('Europe/Paris');
  const [calendarView, setCalendarView] = useState('week');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSaveNotificationSettings = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    
    try {
      // Mise u00e0 jour des pru00e9fu00e9rences de notification dans la base de donnu00e9es
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          email_notifications: emailNotifications,
          sms_notifications: smsNotifications,
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      setSuccessMessage('Paramu00e8tres de notification mis u00e0 jour avec succu00e8s');
      
      // Simuler la disparition du message apru00e8s 3 secondes
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde des paramu00e8tres:', error.message);
      setErrorMessage('Une erreur est survenue lors de la sauvegarde des paramu00e8tres');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDisplaySettings = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    
    try {
      // Mise u00e0 jour des pru00e9fu00e9rences d'affichage dans la base de donnu00e9es
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          language,
          timezone: timeZone,
          calendar_view: calendarView,
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      setSuccessMessage('Paramu00e8tres d\'affichage mis u00e0 jour avec succu00e8s');
      
      // Simuler la disparition du message apru00e8s 3 secondes
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde des paramu00e8tres:', error.message);
      setErrorMessage('Une erreur est survenue lors de la sauvegarde des paramu00e8tres');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Paramu00e8tres</h1>

      <div className="space-y-8">
        {/* Section thu00e8me */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Apparence</h2>
            <p className="text-sm text-gray-500">Personnalisez l'apparence de l'application</p>
          </Card.Header>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Mode sombre</h3>
                <p className="text-sm text-gray-500">Activer le mode sombre pour ru00e9duire la fatigue oculaire</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                  type="checkbox" 
                  name="darkMode" 
                  id="darkMode" 
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label 
                  htmlFor="darkMode" 
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${isDarkMode ? 'bg-primary-600' : 'bg-gray-300'}`}
                ></label>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Section notifications */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Notifications</h2>
            <p className="text-sm text-gray-500">Gu00e9rez vos pru00e9fu00e9rences de notification</p>
          </Card.Header>
          <Card.Body className="space-y-6">
            {successMessage && (
              <div className="p-3 rounded-md bg-green-50 text-green-500 text-sm">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                {errorMessage}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notifications par email</h3>
                  <p className="text-sm text-gray-500">Recevoir des emails pour les rendez-vous et messages</p>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input 
                    type="checkbox" 
                    name="emailNotifications" 
                    id="emailNotifications" 
                    checked={emailNotifications}
                    onChange={() => setEmailNotifications(!emailNotifications)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label 
                    htmlFor="emailNotifications" 
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${emailNotifications ? 'bg-primary-600' : 'bg-gray-300'}`}
                  ></label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notifications par SMS</h3>
                  <p className="text-sm text-gray-500">Recevoir des SMS pour les rappels de rendez-vous</p>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input 
                    type="checkbox" 
                    name="smsNotifications" 
                    id="smsNotifications" 
                    checked={smsNotifications}
                    onChange={() => setSmsNotifications(!smsNotifications)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label 
                    htmlFor="smsNotifications" 
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${smsNotifications ? 'bg-primary-600' : 'bg-gray-300'}`}
                  ></label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                variant="primary" 
                onClick={handleSaveNotificationSettings}
                isLoading={isSaving}
                disabled={isSaving}
              >
                Enregistrer les paramu00e8tres
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Section d'affichage */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Paramu00e8tres d'affichage</h2>
            <p className="text-sm text-gray-500">Personnalisez votre expu00e9rience utilisateur</p>
          </Card.Header>
          <Card.Body className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="language" className="block text-sm font-medium">Langue</label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="fr">Franu00e7ais</option>
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="timezone" className="block text-sm font-medium">Fuseau horaire</label>
                <select
                  id="timezone"
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                  <option value="Europe/London">Europe/London (UTC+0)</option>
                  <option value="America/New_York">America/New_York (UTC-5)</option>
                  <option value="Asia/Dubai">Asia/Dubai (UTC+4)</option>
                  <option value="Africa/Casablanca">Africa/Casablanca (UTC+0)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="calendarView" className="block text-sm font-medium">Vue du calendrier par du00e9faut</label>
                <select
                  id="calendarView"
                  value={calendarView}
                  onChange={(e) => setCalendarView(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="day">Jour</option>
                  <option value="week">Semaine</option>
                  <option value="month">Mois</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                variant="primary" 
                onClick={handleSaveDisplaySettings}
                isLoading={isSaving}
                disabled={isSaving}
              >
                Enregistrer les paramu00e8tres
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Section de su00e9curitu00e9 du compte */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Su00e9curitu00e9 du compte</h2>
            <p className="text-sm text-gray-500">Gu00e9rez les paramu00e8tres de su00e9curitu00e9 de votre compte</p>
          </Card.Header>
          <Card.Body className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-medium">Modifier le mot de passe</h3>
              <p className="text-sm text-gray-500">Mettez u00e0 jour votre mot de passe pour su00e9curiser votre compte</p>
              <Button variant="outline" className="mt-2">
                Changer le mot de passe
              </Button>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-medium text-red-600">Zone dangereuse</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">Les actions suivantes sont permanentes et ne peuvent pas u00eatre annulu00e9es</p>
              
              <Button variant="danger">
                Supprimer mon compte
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>

      <style jsx global>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #ffffff;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #3b82f6;
        }
        .toggle-checkbox {
          right: 6px;
          top: -1px;
          transition: all 0.3s;
          z-index: 2;
        }
        .toggle-label {
          transition: all 0.3s;
        }
      `}</style>
    </div>
  );
}
