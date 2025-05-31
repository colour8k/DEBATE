import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles, 
  HelpCircle, 
  ThumbsUp, 
  X, 
  Lightbulb,
  Eye,
  MessageCircle,
  Smile,
  Laugh,
  Frown,
  AlertCircle,
  Search,
  Zap,
  Heart,
  Coffee,
  Target,
  Telescope
} from 'lucide-react';

interface AnimatedAvatarProps {
  philosopher: 'levin' | 'barandes';
  emotion: EmotionType;
  size?: 'sm' | 'md' | 'lg';
}

export type EmotionType = 
  | 'thinking' 
  | 'excited' 
  | 'confused' 
  | 'agreeing' 
  | 'disagreeing' 
  | 'insight' 
  | 'observing' 
  | 'speaking'
  | 'smiling'
  | 'laughing'
  | 'surprised'
  | 'contemplating'
  | 'searching'
  | 'eureka'
  | 'focused'
  | 'analyzing'
  | 'pondering'
  | null;

const emotionIcons = {
  thinking: Brain,
  excited: Sparkles,
  confused: HelpCircle,
  agreeing: ThumbsUp,
  disagreeing: X,
  insight: Lightbulb,
  observing: Eye,
  speaking: MessageCircle,
  smiling: Smile,
  laughing: Laugh,
  surprised: AlertCircle,
  contemplating: Coffee,
  searching: Search,
  eureka: Zap,
  focused: Target,
  analyzing: Telescope,
  pondering: Brain
};

const emotionColors = {
  thinking: 'text-blue-500 bg-blue-100',
  excited: 'text-yellow-500 bg-yellow-100',
  confused: 'text-orange-500 bg-orange-100',
  agreeing: 'text-green-500 bg-green-100',
  disagreeing: 'text-red-500 bg-red-100',
  insight: 'text-purple-500 bg-purple-100',
  observing: 'text-gray-500 bg-gray-100',
  speaking: 'text-blue-500 bg-blue-100',
  smiling: 'text-green-400 bg-green-50',
  laughing: 'text-yellow-400 bg-yellow-50',
  surprised: 'text-orange-400 bg-orange-50',
  contemplating: 'text-brown-500 bg-amber-100',
  searching: 'text-indigo-500 bg-indigo-100',
  eureka: 'text-yellow-600 bg-yellow-200',
  focused: 'text-red-500 bg-red-100',
  analyzing: 'text-violet-500 bg-violet-100',
  pondering: 'text-slate-500 bg-slate-100'
};

const emotionAnimations = {
  thinking: 'animate-pulse',
  excited: 'animate-bounce',
  confused: 'animate-ping',
  agreeing: 'animate-pulse',
  disagreeing: 'animate-shake',
  insight: 'animate-ping',
  observing: 'animate-pulse',
  speaking: 'animate-pulse',
  smiling: '',
  laughing: 'animate-bounce',
  surprised: 'animate-ping',
  contemplating: 'animate-pulse',
  searching: 'animate-spin',
  eureka: 'animate-bounce',
  focused: 'animate-pulse',
  analyzing: 'animate-spin',
  pondering: 'animate-pulse'
};

export default function AnimatedAvatar({ philosopher, emotion, size = 'md' }: AnimatedAvatarProps) {
  const [showEmotion, setShowEmotion] = useState(false);
  const [emotionKey, setEmotionKey] = useState(0);

  useEffect(() => {
    if (emotion) {
      setShowEmotion(true);
      setEmotionKey(prev => prev + 1); // Force re-render for animation
    } else {
      setShowEmotion(false);
    }
  }, [emotion]);

  const sizeClasses = {
    sm: { avatar: 'w-10 h-10', emotion: 'w-5 h-5', iconSize: 'w-3 h-3' },
    md: { avatar: 'w-12 h-12', emotion: 'w-6 h-6', iconSize: 'w-3.5 h-3.5' },
    lg: { avatar: 'w-16 h-16', emotion: 'w-7 h-7', iconSize: 'w-4 h-4' }
  };

  const sizes = sizeClasses[size];
  const EmotionIcon = emotion ? emotionIcons[emotion] : null;
  const emotionColorClass = emotion ? emotionColors[emotion] : '';
  const animationClass = emotion ? emotionAnimations[emotion] : '';

  return (
    <div className="relative">
      <img 
        src={philosopher === 'levin' ? '/michael-levin.jpg' : '/jacob-barandes.jpg'}
        alt={philosopher === 'levin' ? 'Michael Levin' : 'Jacob Barandes'}
        className={`${sizes.avatar} rounded-full object-cover border-2 ${
          philosopher === 'levin' ? 'border-emerald-200' : 'border-blue-200'
        } transition-all duration-300 ${
          emotion === 'excited' ? 'scale-105' : 
          emotion === 'confused' ? 'scale-95' : 
          emotion === 'surprised' ? 'scale-110' : ''
        }`}
      />
      
      {/* Emotion indicator */}
      {showEmotion && EmotionIcon && (
        <div 
          key={emotionKey}
          className={`absolute -top-1 -right-1 ${sizes.emotion} rounded-full ${emotionColorClass} 
                     flex items-center justify-center border-2 border-white shadow-lg
                     animate-in zoom-in-50 duration-500`}
        >
          <EmotionIcon 
            className={`${sizes.iconSize} ${animationClass}`}
          />
        </div>
      )}

      {/* Special effects for certain emotions */}
      {emotion === 'eureka' && (
        <div className="absolute -inset-2 rounded-full border-2 border-yellow-400 animate-ping opacity-75" />
      )}
      
      {emotion === 'excited' && (
        <div className="absolute -inset-1 rounded-full bg-yellow-200 opacity-20 animate-pulse" />
      )}
    </div>
  );
}