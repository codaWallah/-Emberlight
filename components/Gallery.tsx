import React, { useState, useEffect, useCallback } from 'react';
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

interface GalleryProps {
  images: string[];
  onClose: () => void;
}

const Lightbox: React.FC<{
  images: string[];
  startIndex: number;
  onClose: () => void;
}> = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext, onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center animate-fade-in-fast"
      onClick={onClose}
    >
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20"
        aria-label="Close lightbox"
      >
        <CloseIcon />
      </button>

      {images.length > 1 && (
        <>
           <button 
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeftIcon />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors"
            aria-label="Next image"
          >
            <ChevronRightIcon />
          </button>
        </>
      )}

      <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <img 
          src={images[currentIndex]} 
          alt={`Gallery image ${currentIndex + 1}`} 
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      </div>
    </div>
  );
};


export const Gallery: React.FC<GalleryProps> = ({ images, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in-fast" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-title"
      >
        <div 
          className="bg-gray-900/80 border border-fuchsia-500/30 rounded-lg w-full max-w-6xl max-h-[90vh] p-6 shadow-2xl shadow-fuchsia-500/20 relative" 
          onClick={e => e.stopPropagation()}
        >
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Close gallery"
          >
            <CloseIcon />
          </button>
          <h2 
            id="gallery-title"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400 mb-6"
          >
            My Gallery
          </h2>
          {images.length === 0 ? (
            <div className="flex items-center justify-center h-96 text-gray-500">
              <p>Your saved creations will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto max-h-[calc(90vh-100px)]">
              {images.map((img, index) => (
                <div 
                  key={index} 
                  className="aspect-square rounded-md overflow-hidden group relative border-2 border-transparent hover:border-cyan-400 transition-all cursor-pointer"
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={img} alt={`Generated image ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 text-sm bg-cyan-500/80 text-white rounded-md">View</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedImageIndex !== null && (
        <Lightbox 
          images={images} 
          startIndex={selectedImageIndex} 
          onClose={() => setSelectedImageIndex(null)} 
        />
      )}
    </>
  );
};


// Add keyframes for the fade-in animation
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeInFast {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in-fast {
  animation: fadeInFast 0.3s ease-in-out;
}
`;
document.head.appendChild(style);