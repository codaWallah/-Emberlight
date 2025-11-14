import React from 'react';

const STYLES = ['Cinematic', 'Cyberpunk', 'Retro-futurism', 'Biopunk', 'Photorealistic', 'Anime', 'Minimalist'];

interface AdvancedToolsProps {
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
  selectedStyle: string;
  setSelectedStyle: (value: string) => void;
}

export const AdvancedTools: React.FC<AdvancedToolsProps> = ({ negativePrompt, setNegativePrompt, selectedStyle, setSelectedStyle }) => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <label htmlFor="negative-prompt-input" className="text-lime-400/80 text-sm font-semibold tracking-wider mb-2 block">
          NEGATIVE PROMPT (ELEMENTS TO AVOID)
        </label>
        <textarea
          id="negative-prompt-input"
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          placeholder="e.g., blurry, text, watermark, oversaturated..."
          className="bg-gray-900/50 border-b-2 border-fuchsia-500/50 focus:outline-none focus:border-lime-400 caret-lime-400 p-3 w-full h-24 resize-none text-gray-300 transition-colors duration-300 rounded-t-md"
          rows={3}
        />
      </div>
      <div>
        <label className="text-lime-400/80 text-sm font-semibold tracking-wider mb-3 block">
          STYLE MODIFIERS
        </label>
        <div className="flex flex-wrap gap-2">
          {STYLES.map(style => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-3 py-1 text-sm border rounded-full transition-all duration-300 ${selectedStyle === style ? 'bg-lime-400 text-gray-900 border-lime-400' : 'bg-transparent border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/20 hover:border-cyan-400'}`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};