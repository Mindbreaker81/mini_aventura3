"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Play, CheckCircle, Monitor, ChevronDown, ChevronUp } from 'lucide-react';
import useLaboratorioFlipStore from './useLaboratorioFlipStore';

// Importar ReactPlayer dinámicamente para evitar problemas de SSR
const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg" />
});

interface VideoCardProps {
  onVideoEnd: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ onVideoEnd }) => {
  const { lessons, currentLesson, finishVideo, videoWatched } = useLaboratorioFlipStore();
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(0); // Índice del video seleccionado
  const [showVideoOptions, setShowVideoOptions] = useState(false);
  
  const lesson = lessons[currentLesson];

  if (!lesson) return null;

  // Soporte para el formato antiguo (videoUrl directo) y nuevo (array de videos)
  const videos = lesson.videos || [{ 
    id: "video1", 
    title: lesson.title, 
    url: lesson.videoUrl, 
    canal: "Canal Educativo", 
    duracion: "3:00", 
    descripcion: `Video educativo sobre ${lesson.title}` 
  }];
  
  const currentVideo = videos[selectedVideo];

  const handlePlay = () => {
    setPlaying(true);
    setHasStarted(true);
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const handleEnded = () => {
    setPlaying(false);
    finishVideo();
    onVideoEnd();
  };

  const handleProgress = (progress: { played: number }) => {
    // Considerar el video como "visto" si se ha reproducido al menos el 80%
    if (progress.played >= 0.8 && !videoWatched) {
      finishVideo();
    }
  };

  const handleVideoSelect = (videoIndex: number) => {
    setSelectedVideo(videoIndex);
    setShowVideoOptions(false);
    // Reiniciar el estado del video si se cambia
    if (hasStarted) {
      setHasStarted(false);
      setPlaying(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          🧪 {lesson.title}
        </h2>
        
        {/* Selector de video si hay múltiples opciones */}
        {videos.length > 1 && (
          <div className="mb-4">
            <button
              onClick={() => setShowVideoOptions(!showVideoOptions)}
              className="flex items-center justify-between w-full p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Monitor size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  {currentVideo.title} - {currentVideo.canal}
                </span>
              </div>
              {showVideoOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {showVideoOptions && (
              <div className="mt-2 space-y-2">
                {videos.map((video, index) => (
                  <button
                    key={video.id}
                    onClick={() => handleVideoSelect(index)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      selectedVideo === index
                        ? 'bg-blue-100 border-blue-300 ring-2 ring-blue-200'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium text-gray-800">{video.title}</div>
                    <div className="text-sm text-gray-600">
                      {video.canal} • {video.duracion}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{video.descripcion}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>📹 {currentVideo.canal}</span>
          <span>⏱️ {currentVideo.duracion}</span>
          {videoWatched && (
            <span className="flex items-center gap-1 text-green-600 font-semibold">
              <CheckCircle size={16} />
              Video completado
            </span>
          )}
        </div>
      </div>

      <div className="relative bg-black rounded-lg overflow-hidden">
        {!hasStarted ? (
          // Thumbnail con botón de play
          <div 
            className="relative w-full h-64 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center cursor-pointer group"
            onClick={handlePlay}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative z-10 flex flex-col items-center text-white">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-700 transition-colors shadow-lg">
                <Play size={32} className="ml-1" fill="white" />
              </div>
              <h3 className="text-lg font-semibold text-center">{currentVideo.title}</h3>
              <p className="text-gray-300 text-center mt-2">Haz clic para reproducir</p>
              <p className="text-gray-400 text-sm mt-1">{currentVideo.canal}</p>
            </div>
            
            {/* Duración del video */}
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
              {currentVideo.duracion}
            </div>
          </div>
        ) : (
          // Player de video
          <div className="w-full h-64">
            <ReactPlayer
              url={currentVideo.url}
              width="100%"
              height="100%"
              playing={playing}
              controls={true}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleEnded}
              onProgress={handleProgress}
              config={{
                youtube: {
                  playerVars: {
                    showinfo: 1,
                    modestbranding: 1,
                    rel: 0,
                  }
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Descripción y estado */}
      <div className="mt-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">📖 Sobre esta lección:</h4>
          <p className="text-blue-700 text-sm">
            {currentVideo.descripcion}
          </p>
          <p className="text-blue-600 text-sm mt-2">
            Al finalizar el video, responderás 3 preguntas sobre el contenido.
          </p>
        </div>

        {videoWatched && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              <CheckCircle size={20} />
              <span className="font-semibold">¡Listo para el quiz!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;