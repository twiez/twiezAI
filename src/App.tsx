/// code by twiez <>:

import React, { useState, useEffect, useCallback } from 'react';
import { Wand2, Github, Download, X } from 'lucide-react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const generateImage = useCallback(() => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setLoadingProgress(0);

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    const url = `https://text-to-image.bjcoderx.workers.dev/?text="${encodeURIComponent(prompt)}"`;
    setImageUrl(url);

    setTimeout(() => {
      clearInterval(interval);
      setLoadingProgress(100);
      setIsLoading(false);
    }, 2000);
  }, [prompt]);

  const downloadImage = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${prompt.slice(0, 30)}-ai-generated.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isImageExpanded) {
        setIsImageExpanded(false);
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'Enter') {
          e.preventDefault();
          generateImage();
        }
        if (e.key === 's' && imageUrl) {
          e.preventDefault();
          downloadImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageExpanded, generateImage, imageUrl]);

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col backdrop-blur-sm">
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 pt-8">
            <h1 className="text-5xl font-bold mb-4">
              What do you want to build?
            </h1>
            <p className="text-gray-400 text-lg">
              Enter your text and instantly <span className="text-white">generate</span> images <span className="text-white">with</span> AI.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              This site is still under construction.
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/10 relative">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.ctrlKey && generateImage()}
                  placeholder="How can TwiezAİ help you today?"
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30 focus:outline-none transition-colors text-white placeholder-gray-500"
                />
              </div>
              <button
                onClick={generateImage}
                disabled={!prompt.trim() || isLoading}
                className="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wand2 className="w-5 h-5" />
                Generate
              </button>
            </div>
          </div>

          {(imageUrl || isLoading) && (
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <div 
                className={`relative rounded-lg overflow-hidden bg-black/50 ${isImageExpanded ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90' : 'aspect-video'}`}
              >
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-lg">
                      Generating... {loadingProgress}%
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={imageUrl}
                      alt="AI Generated"
                      className={`${isImageExpanded ? 'max-h-[90vh] max-w-[90vw] object-contain cursor-zoom-out' : 'w-full h-full object-contain cursor-zoom-in'}`}
                      onClick={() => setIsImageExpanded(!isImageExpanded)}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                    {!isImageExpanded && (
                      <button
                        onClick={downloadImage}
                        className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm hover:bg-black/75 rounded-lg transition-colors"
                        title="Download image"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                    {isImageExpanded && (
                      <div className="fixed top-4 right-4 flex gap-2">
                        <button
                          onClick={downloadImage}
                          className="p-2 bg-black/50 backdrop-blur-sm hover:bg-black/75 rounded-lg transition-colors"
                          title="Download image"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setIsImageExpanded(false)}
                          className="p-2 bg-black/50 backdrop-blur-sm hover:bg-black/75 rounded-lg transition-colors"
                          title="Close fullscreen"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-sm">
                code by 
                <a 
                  href="https://github.com/twiez" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors"
                >
                  twiez
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
