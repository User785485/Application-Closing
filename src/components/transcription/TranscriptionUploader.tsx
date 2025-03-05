// src/components/transcription/TranscriptionUploader.tsx
'use client';

import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TranscriptionUploaderProps {
  onTranscriptionComplete?: (transcriptionData: any) => void;
}

export default function TranscriptionUploader({ onTranscriptionComplete }: TranscriptionUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files?.[0] || null;
    if (droppedFile && isAudioFile(droppedFile)) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Veuillez du00e9poser un fichier audio valide');
    }
  };

  const isAudioFile = (file: File) => {
    const acceptedTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/webm', 'audio/aac', 'audio/m4a'];
    return acceptedTypes.includes(file.type);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Veuillez su00e9lectionner un fichier audio');
      return;
    }

    if (!user) {
      setError('Vous devez u00eatre connectu00e9 pour effectuer une transcription');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setError(null);

    try {
      // 1. Tu00e9lu00e9charger le fichier audio vers Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `audio/${user.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 50);
            setProgress(percent); // Premiu00e8re moitiu00e9 du progru00e8s pour l'upload
          },
        });

      if (uploadError) throw uploadError;

      // 2. Obtenir l'URL du fichier tu00e9lu00e9chargu00e9
      const { data: urlData } = await supabase.storage
        .from('audio-files')
        .getPublicUrl(filePath);

      // 3. Envoyer une requu00eate u00e0 votre API pour traiter la transcription
      // Simulation d'une API de transcription
      setProgress(60); // Commencer la deuxiu00e8me moitiu00e9 du progru00e8s

      // Simulation d'un traitement qui prend du temps
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress(80);
      
      // Simulation de fin de traitement
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(100);

      // 4. Enregistrer les informations de transcription dans la base de donnu00e9es
      const { data: transcriptionData, error: dbError } = await supabase
        .from('transcriptions')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_url: urlData.publicUrl,
          status: 'complete',
          duration: 0, // À remplacer par la durée réelle du fichier
          // Le contenu de la transcription sera ajouté par le webhook de l'API
        })
        .select();

      if (dbError) throw dbError;

      // 5. Informer le parent que la transcription est terminu00e9e
      if (onTranscriptionComplete && transcriptionData) {
        onTranscriptionComplete(transcriptionData[0]);
      }

    } catch (err: any) {
      console.error('Erreur lors de la transcription:', err);
      setError(err.message || 'Une erreur est survenue lors de la transcription');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card>
      <Card.Header>
        <h2 className="text-xl font-semibold">Transcription Audio</h2>
        <p className="text-sm text-gray-500">Tu00e9lu00e9chargez un fichier audio pour le transcrire</p>
      </Card.Header>
      
      <Card.Body>
        <div
          className={`border-2 border-dashed p-8 rounded-md text-center cursor-pointer transition-colors ${file ? 'bg-green-50 border-green-200' : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="audio/*"
            className="hidden"
          />

          {file ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-medium">Cliquez ou du00e9posez un fichier audio ici</p>
              <p className="text-sm text-gray-500">Formats pris en charge: MP3, WAV, OGG, AAC, M4A</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 rounded bg-red-50 text-red-500 text-sm">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="mt-4 space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 text-center">
              {progress < 50 ? 'Tu00e9lu00e9chargement...' : 
               progress < 80 ? 'Traitement...' : 
               'Finalisation...'}
              {progress}%
            </p>
          </div>
        )}
      </Card.Body>

      <Card.Footer className="flex justify-end">
        <Button 
          onClick={handleUpload} 
          disabled={!file || isLoading}
          isLoading={isLoading}
        >
          {isLoading ? 'Transcription en cours...' : 'Lancer la transcription'}
        </Button>
      </Card.Footer>
    </Card>
  );
}
