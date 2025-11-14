import React, { useState, useCallback, useEffect, useRef } from 'react';
import { PromptInput } from './components/PromptInput';
import { ImageDisplay } from './components/ImageDisplay';
import { generateImage } from './services/geminiService';
import { AdvancedTools } from './components/AdvancedTools';
import { Gallery } from './components/Gallery';
import { GalleryIcon, ImportIcon } from './components/icons';

const INITIAL_PROMPT = ``;

type AspectRatio = "1:1" | "16:9" | "9:16";

const ActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}> = ({ icon, label, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex flex-col items-center justify-center gap-1 text-cyan-300 hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed group w-20"
    aria-label={label}
  >
    <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:border-cyan-400 transition-all">
      {icon}
    </div>
    <span className="text-xs tracking-wider">{label}</span>
  </button>
);


function App() {
  const [prompt, setPrompt] = useState<string>(INITIAL_PROMPT);
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [style, setStyle] = useState<string>('Cinematic');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('imageGallery');
      if (saved) {
        setGalleryImages(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to parse gallery from localStorage", e);
    }
  }, []);

  const saveToGallery = useCallback((url: string) => {
    setGalleryImages(prev => {
      if (prev.includes(url)) return prev;
      const updatedGallery = [url, ...prev];
      localStorage.setItem('imageGallery', JSON.stringify(updatedGallery));
      return updatedGallery;
    });
  }, []);


  const handleGenerate = useCallback(async () => {
    if (!prompt || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImageUrls([]);

    try {
      const fullPrompt = `${prompt}, ${style} style${negativePrompt ? `, negative prompt: ${negativePrompt}` : ''}`;
      const generatedImageUrls = await generateImage(fullPrompt, aspectRatio);
      setImageUrls(generatedImageUrls);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, negativePrompt, style, aspectRatio, isLoading]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For now, we'll just log it. In the future, this could
      // set the image for an image-to-image feature.
      console.log('File imported:', file.name);
      alert(`Image "${file.name}" imported! Feature coming soon.`);
    }
  };

  const ASPECT_RATIOS: { label: string, value: AspectRatio }[] = [
      { label: '1:1', value: '1:1' },
      { label: '16:9', value: '16:9' },
  ];

  return (
    <div 
      className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden"
      style={{
        backgroundImage: `url('https://i.ibb.co/1GV9gV2z/Gemini-Generated-Image-xsaq2pxsaq2pxsaq.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      {/* Background elements for futuristic feel */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-blue-500/[0.05]"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lime-400/10 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
      
      {isGalleryOpen && <Gallery images={galleryImages} onClose={() => setIsGalleryOpen(false)} />}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      <main className="z-10 w-full max-w-7xl flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">
              Emberlight- A Futuristic Image Generator
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mb-8">
            Enter the nexus of creativity. Describe your vision, and our AI will manifest it into stunning visual reality.
          </p>
          <div className="w-full max-w-xl bg-black/30 backdrop-blur-sm border border-fuchsia-500/30 rounded-lg p-6 shadow-2xl shadow-fuchsia-500/10">
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              onSubmit={handleGenerate}
              isLoading={isLoading}
            />
            <div className="my-6 border-t border-fuchsia-500/20"></div>
            <AdvancedTools
              negativePrompt={negativePrompt}
              setNegativePrompt={setNegativePrompt}
              selectedStyle={style}
              setSelectedStyle={setStyle}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="flex justify-center items-center gap-2 p-1 bg-gray-900/50 border border-cyan-500/30 rounded-full">
            {ASPECT_RATIOS.map(({ label, value }) => (
                <button 
                  key={value} 
                  onClick={() => setAspectRatio(value)} 
                  disabled={isLoading}
                  className={`px-4 py-1 text-sm rounded-full transition-colors duration-300 ${aspectRatio === value ? 'bg-cyan-400 text-gray-900' : 'text-cyan-300 hover:bg-cyan-400/20'}`}
                >
                    {label}
                </button>
            ))}
          </div>
          <ImageDisplay
            imageUrls={imageUrls}
            isLoading={isLoading}
            error={error}
            aspectRatio={aspectRatio}
            onSave={saveToGallery}
          />
          <div className="flex justify-center items-center gap-4 h-16 w-full max-w-xl">
             <ActionButton icon={<ImportIcon />} label="Import" onClick={handleImportClick} />
             <ActionButton icon={<GalleryIcon />} label="Gallery" onClick={() => setIsGalleryOpen(true)} />
          </div>
        </div>
      </main>
      <br />
      <br />
  
      <footer className="absolute bottom-4 text-center text-gray-600 text-xs z-10">
        <p>&copy; 2025 Emberlight,Powered nd Created by <b><a href="https://www.linkedin.com/in/mohd-anash">Mohd.Anash(aka)</a></b>.All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;