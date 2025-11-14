import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onSubmit, isLoading }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <label htmlFor="prompt-input" className="text-lime-400 text-sm font-semibold tracking-wider">
        PROMPT TERMINAL
      </label>
      <textarea
        id="prompt-input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write Your thought which you want to see!!!!....."
        className="bg-gray-900/50 border-b-2 border-fuchsia-500 focus:outline-none focus:border-lime-400 caret-lime-400 p-3 w-full h-48 resize-none text-gray-200 transition-colors duration-300 rounded-t-md"
        rows={6}
      />
      <button
        onClick={onSubmit}
        disabled={isLoading || !prompt}
        className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-fuchsia-500 to-cyan-400 group-hover:from-fuchsia-500 group-hover:to-cyan-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-300"
      >
        <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
          {isLoading ? 'GENERATING...' : 'GENERATE'}
        </span>
      </button>
    </div>
  );
};
