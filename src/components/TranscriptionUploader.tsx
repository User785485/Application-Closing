// src/components/TranscriptionUploader.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { UploadCloud, X, FileAudio, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { supabase } from '@/lib/supabase';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',        // .mp3
  'audio/wav',         // .wav
  'audio/ogg',         // .ogg
  'audio/x-m4a',       // .m4a
  'audio/mp4',         // .mp4 (audio)
  'audio/aac',         // .aac
  'audio/flac',        // .flac
  'audio/webm',        // .webm
];

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  status: 'uploading' | 'processing' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface TranscriptionUploaderProps {
  onUploadComplete?: (fileData: UploadedFile) => void;
}

export function TranscriptionUploader({ onUploadComplete }: TranscriptionUploaderProps) {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
      return 'Type de fichier non pris en charge. Veuillez uploader un fichier audio.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return `Taille de fichier trop grande. La taille maximale est de ${MAX_FILE_SIZE / (1024 * 1024)}MB.`;
    }
    return null;
  };

  const processFile = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast({
        title: 'Erreur de fichier',
        description: error,
        variant: 'destructive',
      });
      return;
    }

    const fileId = crypto.randomUUID();
    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: '',
      status: 'uploading',
      progress: 0,
    };

    setFiles(prev => [...prev, newFile]);
    setIsUploading(true);

    try {
      // Création du chemin de stockage
      const userId = user?.id || 'anonymous';
      const timestamp = new Date().getTime();
      const filePath = `audio/${userId}/${timestamp}_${file.name}`;
      
      // Upload du fichier à Supabase Storage
      const { data, error } = await supabase.storage
        .from('transcriptions')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (error) throw error;
      
      // Récupération de l'URL publique du fichier
      const { data: { publicUrl } } = supabase.storage
        .from('transcriptions')
        .getPublicUrl(filePath);
      
      // Mise à jour des informations du fichier
      const updatedFile: UploadedFile = {
        ...newFile,
        url: publicUrl,
        status: 'processing',
        progress: 100,
      };
      
      setFiles(prev => prev.map(f => f.id === fileId ? updatedFile : f));
      
      // Démarrage du processus de transcription (simulation)
      setTimeout(() => {
        const successFile: UploadedFile = {
          ...updatedFile,
          status: 'success',
        };
        
        setFiles(prev => prev.map(f => f.id === fileId ? successFile : f));
        if (onUploadComplete) {
          onUploadComplete(successFile);
        }
        
        toast({
          title: 'Transcription terminée',
          description: `Le fichier ${file.name} a été transcrit avec succès.`,
        });
      }, 3000); // Simuler un délai de traitement
      
    } catch (err: any) {
      console.error('Erreur lors de l\'upload:', err.message);
      
      // Mise à jour du statut du fichier en erreur
      const errorFile: UploadedFile = {
        ...newFile,
        status: 'error',
        progress: 0,
        error: err.message,
      };
      
      setFiles(prev => prev.map(f => f.id === fileId ? errorFile : f));
      
      toast({
        title: 'Échec de l\'upload',
        description: `Erreur lors de l'upload de ${file.name}. ${err.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]; // Traiter un seul fichier à la fois
      await processFile(file);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]; // Traiter un seul fichier à la fois
      await processFile(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transcription Audio</CardTitle>
        <CardDescription>
          Uploadez un fichier audio pour le transcrire en texte automatiquement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`
            border-2 border-dashed rounded-lg p-6
            flex flex-col items-center justify-center
            transition-colors duration-200
            cursor-pointer
            ${dragActive ? 'border-primary bg-primary/10' : 'border-border'}
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_AUDIO_TYPES.join(',')}
            className="hidden"
            onChange={handleFileInputChange}
            disabled={isUploading}
          />
          
          <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
          
          <div className="text-center space-y-2">
            <h3 className="font-medium">Glissez-déposez votre fichier audio ici ou cliquez pour parcourir</h3>
            <p className="text-sm text-muted-foreground">
              Formats supportés: MP3, WAV, OGG, M4A, AAC, FLAC, WEBM (Max. 100MB)
            </p>
          </div>
          
          <Button
            variant="outline"
            className="mt-4"
            onClick={(e) => {
              e.stopPropagation();
              triggerFileInput();
            }}
            disabled={isUploading}
          >
            Sélectionner un fichier
          </Button>
        </div>

        {files.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-medium">Fichiers téléchargés</h3>
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="rounded-full p-2 bg-muted">
                    <FileAudio className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {file.status === 'uploading' && (
                    <div className="w-24 mr-3">
                      <Progress value={file.progress} className="h-2" />
                    </div>
                  )}
                  
                  {file.status === 'processing' && (
                    <span className="text-sm text-blue-600 mr-3">Traitement...</span>
                  )}
                  
                  {file.status === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  )}
                  
                  {file.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    disabled={file.status === 'uploading'}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
