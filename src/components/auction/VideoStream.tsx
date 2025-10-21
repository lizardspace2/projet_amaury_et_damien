import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, Settings } from 'lucide-react';

interface VideoStreamProps {
  streamUrl?: string;
  isLive?: boolean;
  title?: string;
  className?: string;
}

const VideoStream: React.FC<VideoStreamProps> = ({
  streamUrl,
  isLive = false,
  title = "Salle d'enchères en direct",
  className = ""
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Simuler une connexion au flux vidéo
    const connectToStream = async () => {
      try {
        setConnectionStatus('connecting');
        
        // Pour la démo, on utilise une vidéo de test
        // En production, vous utiliseriez une vraie URL de stream (WebRTC, HLS, etc.)
        if (streamUrl) {
          video.src = streamUrl;
        } else {
          // URL de test - remplacez par votre vraie source de stream
          video.src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
        }
        
        await video.play();
        setConnectionStatus('connected');
      } catch (error) {
        console.error('Erreur de connexion au stream:', error);
        setConnectionStatus('disconnected');
      }
    };

    connectToStream();

    // Gestionnaire d'événements pour les changements de statut
    const handleLoadStart = () => setConnectionStatus('connecting');
    const handleCanPlay = () => setConnectionStatus('connected');
    const handleError = () => setConnectionStatus('disconnected');

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [streamUrl]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      videoRef.current.style.display = isVideoEnabled ? 'none' : 'block';
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'En direct';
      case 'connecting': return 'Connexion...';
      case 'disconnected': return 'Hors ligne';
      default: return 'Inconnu';
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className="relative bg-black">
          {/* Header avec titre et statut */}
          <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge 
                variant="destructive" 
                className={`${getStatusColor()} text-white animate-pulse`}
              >
                {getStatusText()}
              </Badge>
              <h3 className="text-white font-semibold text-sm bg-black/50 px-2 py-1 rounded">
                {title}
              </h3>
            </div>
          </div>

          {/* Conteneur vidéo */}
          <div className="relative aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              controls={false}
              autoPlay
              muted={isMuted}
              playsInline
            />
            
            {/* Overlay de chargement */}
            {connectionStatus === 'connecting' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Connexion au stream...</p>
                </div>
              </div>
            )}

            {/* Overlay d'erreur */}
            {connectionStatus === 'disconnected' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-red-500 mb-4">
                    <VideoOff className="h-12 w-12 mx-auto" />
                  </div>
                  <p>Impossible de se connecter au stream</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    Réessayer
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Contrôles vidéo */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="flex justify-between items-center bg-black/50 backdrop-blur-sm rounded-lg p-2">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleVideo}
                  className="text-white hover:bg-white/20"
                >
                  {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoStream;
