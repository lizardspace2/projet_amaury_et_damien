import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle, CheckCircle, Pause, Play } from 'lucide-react';

interface AuctionTimerProps {
  endTime: Date;
  onTimeUp?: () => void;
  onWarning?: (timeLeft: number) => void;
  warningThreshold?: number; // en secondes
  className?: string;
  isPaused?: boolean;
  onPauseToggle?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const AuctionTimer: React.FC<AuctionTimerProps> = ({
  endTime,
  onTimeUp,
  onWarning,
  warningThreshold = 300, // 5 minutes par défaut
  className = "",
  isPaused = false,
  onPauseToggle
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });
  const [isWarning, setIsWarning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const now = new Date().getTime();
    const end = endTime.getTime();
    const difference = end - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return {
        days,
        hours,
        minutes,
        seconds,
        total: difference
      };
    } else {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0
      };
    }
  }, [endTime]);

  useEffect(() => {
    const updateTimer = () => {
      if (isPaused) return;

      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Vérifier si le temps est écoulé
      if (newTimeLeft.total <= 0 && !isExpired) {
        setIsExpired(true);
        onTimeUp?.();
        return;
      }

      // Vérifier l'avertissement
      if (newTimeLeft.total <= warningThreshold * 1000 && !isWarning) {
        setIsWarning(true);
        onWarning?.(newTimeLeft.total / 1000);
      }
    };

    // Mise à jour immédiate
    updateTimer();

    // Mise à jour toutes les secondes
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft, isPaused, isExpired, isWarning, onTimeUp, onWarning, warningThreshold]);

  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  const getStatusColor = () => {
    if (isExpired) return 'bg-red-500';
    if (isWarning) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (isExpired) return 'Terminé';
    if (isWarning) return 'Attention';
    return 'En cours';
  };

  const getStatusIcon = () => {
    if (isExpired) return <CheckCircle className="h-4 w-4" />;
    if (isWarning) return <AlertTriangle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  if (isExpired) {
    return (
      <Card className={`border-red-200 bg-red-50 ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <CheckCircle className="h-5 w-5" />
            Enchère terminée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-2xl font-bold text-red-600 mb-2">
              Temps écoulé
            </div>
            <p className="text-red-600">
              Cette enchère est maintenant fermée
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${isWarning ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'} ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            <span className={isWarning ? 'text-orange-700' : 'text-green-700'}>
              {getStatusText()}
            </span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor()}>
              {getStatusText()}
            </Badge>
            {onPauseToggle && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onPauseToggle}
                className="h-8 w-8 p-0"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 text-center">
          {timeLeft.days > 0 && (
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-2xl font-bold text-gray-900">
                {formatTime(timeLeft.days)}
              </div>
              <div className="text-xs text-gray-600 uppercase">
                {timeLeft.days === 1 ? 'Jour' : 'Jours'}
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg p-3 border">
            <div className={`text-2xl font-bold ${isWarning ? 'text-orange-600' : 'text-gray-900'}`}>
              {formatTime(timeLeft.hours)}
            </div>
            <div className="text-xs text-gray-600 uppercase">
              {timeLeft.hours === 1 ? 'Heure' : 'Heures'}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 border">
            <div className={`text-2xl font-bold ${isWarning ? 'text-orange-600' : 'text-gray-900'}`}>
              {formatTime(timeLeft.minutes)}
            </div>
            <div className="text-xs text-gray-600 uppercase">
              {timeLeft.minutes === 1 ? 'Minute' : 'Minutes'}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 border">
            <div className={`text-2xl font-bold ${isWarning ? 'text-orange-600 animate-pulse' : 'text-gray-900'}`}>
              {formatTime(timeLeft.seconds)}
            </div>
            <div className="text-xs text-gray-600 uppercase">
              {timeLeft.seconds === 1 ? 'Seconde' : 'Secondes'}
            </div>
          </div>
        </div>

        {isWarning && (
          <div className="mt-4 p-3 bg-orange-100 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Attention ! L'enchère se termine bientôt
              </span>
            </div>
          </div>
        )}

        {isPaused && (
          <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700">
              <Pause className="h-4 w-4" />
              <span className="text-sm font-medium">
                Enchère en pause
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuctionTimer;
