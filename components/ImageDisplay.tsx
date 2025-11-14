import React from 'react';
import { LoadingSpinner, PlaceholderIcon, SaveIcon, UpscaleIcon, ExportIcon } from './icons';

type AspectRatio = "1:1" | "16:9" | "9:16";

interface ImageDisplayProps {
  imageUrls: string[];
  isLoading: boolean;
  error: string | null;
  aspectRatio: AspectRatio;
  onSave: (url: string) => void;
}

const ImageAction: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-md hover:bg-cyan-500 transition-colors text-xs" aria-label={label}>
        <div className="w-4 h-4">{icon}</div>
        <span>{label}</span>
    </button>
);


export const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrls, isLoading, error, aspectRatio, onSave }) => {
  
  const aspectRatioClasses: Record<AspectRatio, string> = {
    '1:1': 'aspect-square',
    '16:9': 'aspect-video',
    '9:16': 'aspect-[9/16]',
  };

  const handleExport = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `emberlight-creation-${index + 1}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <LoadingSpinner />
          <p className="mt-4 text-cyan-400 animate-pulse">Initializing quantum synthesizer...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-red-400 p-4">
          <h3 className="font-bold text-lg mb-2">Generation Failed</h3>
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    
    if (imageUrls.length > 0) {
        return (
            <div className="grid grid-cols-2 gap-2 w-full h-full">
                {imageUrls.map((url, index) => (
                    <div key={index} className="relative group rounded-md overflow-hidden">
                        <img
                            src={url}
                            alt={`Generated variation ${index + 1}`}
                            className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-2">
                            <ImageAction icon={<SaveIcon />} label="Save" onClick={() => onSave(url)} />
                            <ImageAction icon={<ExportIcon />} label="Export" onClick={() => handleExport(url, index)} />
                            <ImageAction icon={<UpscaleIcon />} label="Upscale" onClick={() => alert('Upscale feature coming soon!')} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
        <PlaceholderIcon />
        <p className="mt-4 text-center">Your 4 creations will appear here</p>
      </div>
    );
  };

  return (
    <div className={`w-full max-w-xl ${aspectRatioClasses[aspectRatio]} bg-black/30 backdrop-blur-sm rounded-lg border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 flex items-center justify-center p-2 transition-all duration-500`}>
      <div className="w-full h-full relative">
        {renderContent()}
      </div>
    </div>
  );
};