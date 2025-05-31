import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageSquare, Brain, Dna, Atom, Sparkles, Users, PenTool, Send, User } from 'lucide-react';
import Whiteboard from './components/Whiteboard';
import AnimatedAvatar, { EmotionType } from './components/AnimatedAvatar';

interface DuelMessage {
  id: number;
  philosopher: 'levin' | 'barandes' | 'user';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export default function PhilosophicalDuel() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [messages, setMessages] = useState<DuelMessage[]>([]);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<'levin' | 'barandes'>('levin');
  const [levinEmotion, setLevinEmotion] = useState<EmotionType>(null);
  const [barandesEmotion, setBarandesEmotion] = useState<EmotionType>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [messageIdCounter, setMessageIdCounter] = useState(1);
  const [canUserParticipate, setCanUserParticipate] = useState(false);
  const [debatePhase, setDebatePhase] = useState<'opening' | 'active' | 'paused' | 'waiting_for_user'>('opening');



  // Helper function to set emotions with automatic clearing
  const setPhilosopherEmotion = (philosopher: 'levin' | 'barandes', emotion: EmotionType, duration: number = 3000) => {
    if (philosopher === 'levin') {
      setLevinEmotion(emotion);
      if (emotion !== null) {
        setTimeout(() => setLevinEmotion(null), duration);
      }
    } else {
      setBarandesEmotion(emotion);
      if (emotion !== null) {
        setTimeout(() => setBarandesEmotion(null), duration);
      }
    }
  };

  // Handle starting a custom duel with user's topic
  const handleStartCustomDuel = () => {
    if (!userInput.trim()) return;
    
    const customTopic = userInput.trim();
    setSelectedTopic(customTopic);
    setUserInput(''); // Clear input for use in debate
    startCustomDuel(customTopic);
  };

  // Function to generate philosopher responses to user input
  const generateResponse = (userMessage: string, philosopher: 'levin' | 'barandes'): string => {
    if (philosopher === 'levin') {
      if (userMessage.toLowerCase().includes('consciousness')) {
        return "Fascinating question! Consciousness emerges from the collective intelligence of cellular networks. Each cell has primitive cognition, and when they coordinate through bioelectric signals, we get higher-order awareness. It's like a biological internet!";
      } else if (userMessage.toLowerCase().includes('information') || userMessage.toLowerCase().includes('data')) {
        return "Information is the key! Biology is fundamentally about information processing. Cells store, transmit, and compute with bioelectric patterns. What we call 'life' is really sophisticated biological software running on cellular hardware.";
      } else if (userMessage.toLowerCase().includes('quantum')) {
        return "Quantum effects in biology are intriguing, but I focus on the computational aspects. Cells solve complex problems through bioelectric networks - they don't need quantum mechanics to exhibit collective intelligence and goal-directed behavior.";
      } else {
        return "That's a thought-provoking point! From my perspective, biological systems approach this through collective problem-solving. Cells coordinate through bioelectric networks to navigate morphospace and achieve complex goals.";
      }
    } else {
      if (userMessage.toLowerCase().includes('consciousness')) {
        return "Consciousness might emerge from the mathematical structure of indivisible stochastic processes. Rather than computational networks, it could be the integration of fundamental random events into unified experiential wholes.";
      } else if (userMessage.toLowerCase().includes('information') || userMessage.toLowerCase().includes('data')) {
        return "I'd caution against conflating our mathematical descriptions with ontological reality. Information might be a useful tool for modeling systems, but the substrate could be indivisible stochastic processes, not information itself.";
      } else if (userMessage.toLowerCase().includes('quantum')) {
        return "Exactly! Quantum mechanics reveals the stochastic foundations of reality. My work shows that quantum phenomena emerge from indivisible random processes - no mysterious 'collapse' needed, just pure mathematical realism.";
      } else {
        return "Interesting observation! I approach this through the lens of mathematical foundations. We must distinguish between our descriptive tools and the underlying ontological reality - which I believe consists of indivisible stochastic processes.";
      }
    }
  };

  // Handle user message submission
  const handleUserSubmit = () => {
    if (!userInput.trim() || !canUserParticipate || isTyping) return;
    
    const newMessageId = messageIdCounter;
    setMessageIdCounter(prev => prev + 1);
    
    // Add user message
    const userMessage: DuelMessage = {
      id: newMessageId,
      philosopher: 'user',
      content: userInput.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setCanUserParticipate(false); // Disable further input during response
    setDebatePhase('active');
    
    // Show philosophers thinking
    setPhilosopherEmotion('levin', 'thinking', 3000);
    setPhilosopherEmotion('barandes', 'thinking', 3000);
    setIsTyping(true);
    
    // Generate responses
    setTimeout(() => {
      playEmotionSequence('levin', 'barandes');
      
      setTimeout(() => {
        const levinResponse: DuelMessage = {
          id: newMessageId + 1,
          philosopher: 'levin',
          content: generateResponse(userInput.trim(), 'levin'),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, levinResponse]);
        setMessageIdCounter(prev => prev + 2);
        
        setTimeout(() => {
          playEmotionSequence('barandes', 'levin');
          
          setTimeout(() => {
            const barandesResponse: DuelMessage = {
              id: newMessageId + 2,
              philosopher: 'barandes',
              content: generateResponse(userInput.trim(), 'barandes'),
              timestamp: new Date()
            };
            setMessages(prev => [...prev, barandesResponse]);
            setMessageIdCounter(prev => prev + 1);
            setIsTyping(false);
            
            // After both respond, allow user input again after a pause
            setTimeout(() => {
              setDebatePhase('waiting_for_user');
              setCanUserParticipate(true);
            }, 2000);
          }, 3000);
        }, 1000);
      }, 3000);
    }, 1500);
  };
  const playEmotionSequence = (speaker: 'levin' | 'barandes', listener: 'levin' | 'barandes') => {
    // Speaker starts thinking
    setPhilosopherEmotion(speaker, 'thinking', 2000);
    setPhilosopherEmotion(listener, 'observing', 2000);
    
    setTimeout(() => {
      // Speaker gets insight
      setPhilosopherEmotion(speaker, 'insight', 1500);
      setPhilosopherEmotion(listener, 'focused', 1500);
    }, 1000);
    
    setTimeout(() => {
      // Speaker starts speaking with excitement
      setPhilosopherEmotion(speaker, 'speaking', 3000);
      setPhilosopherEmotion(listener, 'confused', 2000);
    }, 2000);
    
    setTimeout(() => {
      // Listener shows understanding or disagreement
      const reactions = ['agreeing', 'pondering', 'surprised'] as EmotionType[];
      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
      setPhilosopherEmotion(listener, randomReaction, 2000);
    }, 4000);
  };

  // Generate opening arguments for custom topics
  const generateOpeningArgument = (topic: string, philosopher: 'levin' | 'barandes'): string => {
    if (philosopher === 'levin') {
      if (topic.toLowerCase().includes('consciousness') || topic.toLowerCase().includes('mind')) {
        return `Fascinating question about consciousness! From my research, consciousness emerges from the collective intelligence of cellular networks. Each cell has primitive cognition, and when they coordinate through bioelectric signals, we get higher-order awareness. It's fundamentally about information processing at multiple scales.`;
      } else if (topic.toLowerCase().includes('information') || topic.toLowerCase().includes('data')) {
        return `This touches on something fundamental - information is the key to understanding reality! Biology shows us that life is essentially sophisticated information processing. Cells store, transmit, and compute with bioelectric patterns. What we call 'physical' reality is really biological software running on cellular hardware.`;
      } else if (topic.toLowerCase().includes('emergence') || topic.toLowerCase().includes('complex')) {
        return `Emergence is absolutely real and irreducible! When cells coordinate electrically, they create collective intelligence that cannot be predicted from individual cell behavior. The whole genuinely transcends its parts - this is what I see in morphogenetic processes every day.`;
      } else if (topic.toLowerCase().includes('reality') || topic.toLowerCase().includes('nature')) {
        return `Reality is fundamentally computational! Every biological system, from cells to organisms, processes information to solve problems. What we perceive as 'physical' is really the hardware running sophisticated biological software. Life shows us that information processing is the deepest level of reality.`;
      } else {
        return `This is a profound question that goes to the heart of how biological systems work. From my perspective studying morphogenesis and bioelectricity, I see that living systems approach such questions through collective problem-solving. Cells coordinate through bioelectric networks to navigate complex possibility spaces and achieve sophisticated goals.`;
      }
    } else {
      if (topic.toLowerCase().includes('consciousness') || topic.toLowerCase().includes('mind')) {
        return `Consciousness presents a deep puzzle that might require rethinking our foundations. Rather than computational networks, consciousness might emerge from the mathematical structure of indivisible stochastic processes - the integration of fundamental random events into unified experiential wholes.`;
      } else if (topic.toLowerCase().includes('information') || topic.toLowerCase().includes('data')) {
        return `I'd caution against conflating our mathematical descriptions with ontological reality. Information might be a useful tool for modeling systems, but the actual substrate could be indivisible stochastic processes, not information itself. We must distinguish our descriptive tools from what's really there.`;
      } else if (topic.toLowerCase().includes('emergence') || topic.toLowerCase().includes('complex')) {
        return `Apparent emergence often reflects our incomplete understanding rather than genuine irreducibility. Mathematical frameworks can bridge different scales without requiring true emergence. Stochastic foundations might generate seemingly emergent behaviors through purely reductionist mechanisms.`;
      } else if (topic.toLowerCase().includes('reality') || topic.toLowerCase().includes('nature')) {
        return `Reality consists of indivisible stochastic processes - that's the fundamental level. What we perceive as 'computation' or 'information' are just useful mathematical descriptions, not the actual nature of reality itself. The mathematics is our tool, not the territory.`;
      } else {
        return `This question touches on fundamental issues that require careful mathematical and philosophical analysis. I approach such problems by examining the foundational assumptions we make and asking whether alternative mathematical frameworks might provide deeper insight into the underlying reality.`;
      }
    }
  };

  const startCustomDuel = (customTopic: string) => {
    setMessages([]);
    setCurrentTurn('levin');
    setIsTyping(false);
    setMessageIdCounter(1);
    setCanUserParticipate(false);
    setDebatePhase('opening');
    
    // Reset emotions
    setLevinEmotion(null);
    setBarandesEmotion(null);
    
    // Initial excitement about the custom topic
    setPhilosopherEmotion('levin', 'excited', 2000);
    setPhilosopherEmotion('barandes', 'excited', 2000);
    
    // Add opening messages with emotion sequences
    setTimeout(() => {
      playEmotionSequence('levin', 'barandes');
      setIsTyping(true);
      setDebatePhase('active');
      
      setTimeout(() => {
        setMessages([
          {
            id: 1,
            philosopher: 'levin',
            content: generateOpeningArgument(customTopic, 'levin'),
            timestamp: new Date()
          }
        ]);
        setMessageIdCounter(2);
        setIsTyping(false);
      }, 3000);
      
      setTimeout(() => {
        playEmotionSequence('barandes', 'levin');
        setIsTyping(true);
        
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: 2,
            philosopher: 'barandes',
            content: generateOpeningArgument(customTopic, 'barandes'),
            timestamp: new Date()
          }]);
          setCurrentTurn('levin');
          setMessageIdCounter(3);
          setIsTyping(false);
          
          // After both opening statements, pause and allow user input
          setTimeout(() => {
            setDebatePhase('waiting_for_user');
            setCanUserParticipate(true);
            
            // Show contemplation emotions
            setPhilosopherEmotion('levin', 'pondering', 4000);
            setPhilosopherEmotion('barandes', 'pondering', 4000);
          }, 2000);
        }, 3000);
      }, 6000);
    }, 1000);
  };



  if (selectedTopic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Philosophical Duel: {selectedTopic}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    A custom philosophical inquiry
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowWhiteboard(!showWhiteboard)}
                  className={showWhiteboard ? 'bg-blue-50' : ''}
                >
                  <PenTool className="w-4 h-4 mr-2" />
                  Whiteboard
                </Button>
                <Button variant="outline" onClick={() => {
                  setSelectedTopic(null);
                  setCanUserParticipate(false);
                  setDebatePhase('opening');
                  setMessages([]);
                  setUserInput('');
                  setIsTyping(false);
                  setLevinEmotion(null);
                  setBarandesEmotion(null);
                }}>
                  Back to Topics
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Debate Arena */}
            <div className="lg:col-span-2 space-y-4">
              {messages.map((msg) => (
                <Card key={msg.id} className={`${
                  msg.philosopher === 'levin' ? 'border-emerald-200 bg-emerald-50/50' : 
                  msg.philosopher === 'barandes' ? 'border-blue-200 bg-blue-50/50' :
                  'border-gray-200 bg-gray-50/50'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      {msg.philosopher === 'user' ? (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      ) : (
                        <AnimatedAvatar 
                          philosopher={msg.philosopher}
                          emotion={msg.philosopher === 'levin' ? levinEmotion : barandesEmotion}
                          size="md"
                        />
                      )}
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {msg.philosopher === 'levin' ? (
                            <>
                              <Dna className="w-5 h-5" />
                              Michael Levin
                            </>
                          ) : msg.philosopher === 'barandes' ? (
                            <>
                              <Atom className="w-5 h-5" />
                              Jacob Barandes
                            </>
                          ) : (
                            <>
                              <User className="w-5 h-5" />
                              You
                            </>
                          )}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {msg.timestamp.toLocaleTimeString()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed animate-in slide-in-from-left duration-500">
                      {msg.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
              
              {/* User Input */}
              <Card className={`border-2 ${canUserParticipate ? 'border-green-300 bg-green-50/50' : 'border-gray-300 bg-gray-50/50'} transition-all duration-500`}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      canUserParticipate ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gradient-to-r from-gray-400 to-gray-600'
                    }`}>
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="space-y-2">
                        {!canUserParticipate && debatePhase === 'opening' && (
                          <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                            🎭 The philosophers are making their opening statements. Please wait for them to finish before joining the debate.
                          </div>
                        )}
                        {!canUserParticipate && debatePhase === 'active' && (
                          <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
                            💬 The philosophers are actively debating. Please wait for a natural pause to ask your question.
                          </div>
                        )}
                        {canUserParticipate && debatePhase === 'waiting_for_user' && (
                          <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200 animate-pulse">
                            ✨ The philosophers have paused and are ready to hear your question or thoughts!
                          </div>
                        )}
                      </div>
                      <Input
                        placeholder={canUserParticipate ? "Ask a question or share your perspective..." : "Wait for the right moment to join..."}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && canUserParticipate && handleUserSubmit()}
                        className="text-base"
                        disabled={!canUserParticipate}
                      />
                      <Button 
                        onClick={handleUserSubmit} 
                        disabled={!userInput.trim() || !canUserParticipate || isTyping}
                        className="w-full"
                        variant={canUserParticipate ? "default" : "secondary"}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {!canUserParticipate ? 'Wait for your turn...' :
                         isTyping ? 'Philosophers are responding...' : 'Ask Your Question'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center">
                {debatePhase === 'opening' && (
                  <Badge variant="outline" className="text-sm animate-pulse">
                    Opening statements in progress...
                  </Badge>
                )}
                {debatePhase === 'active' && isTyping && (
                  <Badge variant="outline" className="text-sm animate-pulse">
                    Both philosophers are formulating responses...
                  </Badge>
                )}
                {debatePhase === 'waiting_for_user' && !isTyping && (
                  <Badge variant="outline" className="text-sm bg-green-50 text-green-700">
                    Your turn to join the conversation!
                  </Badge>
                )}
              </div>
            </div>

            {/* Philosopher Profiles */}
            <div className="space-y-4">
              <Card className="border-emerald-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <AnimatedAvatar 
                      philosopher="levin"
                      emotion={levinEmotion}
                      size="lg"
                    />
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Dna className="w-5 h-5" />
                        Michael Levin
                      </CardTitle>
                      <CardDescription>Biologist & Computer Scientist</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">• Bioelectric networks in development</p>
                    <p className="text-sm">• Collective intelligence in biology</p>
                    <p className="text-sm">• Morphogenetic information processing</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <AnimatedAvatar 
                      philosopher="barandes"
                      emotion={barandesEmotion}
                      size="lg"
                    />
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Atom className="w-5 h-5" />
                        Jacob Barandes
                      </CardTitle>
                      <CardDescription>Physicist & Philosopher</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">• Stochastic quantum mechanics</p>
                    <p className="text-sm">• Mathematical foundations of physics</p>
                    <p className="text-sm">• Ontological realism</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Whiteboard */}
          {showWhiteboard && (
            <div className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Whiteboard
                  title="Levin's Sketches"
                  philosopher="levin"
                  color="#10b981"
                />
                <Whiteboard
                  title="Barandes' Diagrams"
                  philosopher="barandes"
                  color="#3b82f6"
                />
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Philosophical Duel
              </h1>
              <p className="text-sm text-muted-foreground">AI Personas in Intellectual Combat</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card 
            className="border-2 border-emerald-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setPhilosopherEmotion('levin', 'smiling', 2000)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <AnimatedAvatar 
                  philosopher="levin"
                  emotion={levinEmotion}
                  size="lg"
                />
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Dna className="w-6 h-6" />
                    Michael Levin
                  </CardTitle>
                  <CardDescription className="text-base">Biologist & Computer Scientist</CardDescription>
                  <p className="text-sm text-muted-foreground">Tufts University, Harvard Wyss Institute</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Pioneer of bioelectricity and collective intelligence in biological systems</p>
              <div className="space-y-2">
                <h4 className="font-semibold">Key Insights:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Biology as information processing</li>
                  <li>• Cells as problem-solving agents</li>
                  <li>• Morphospace navigation</li>
                  <li>• Bioelectric software of life</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border-2 border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setPhilosopherEmotion('barandes', 'smiling', 2000)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <AnimatedAvatar 
                  philosopher="barandes"
                  emotion={barandesEmotion}
                  size="lg"
                />
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Atom className="w-6 h-6" />
                    Jacob Barandes
                  </CardTitle>
                  <CardDescription className="text-base">Physicist & Philosopher</CardDescription>
                  <p className="text-sm text-muted-foreground">Harvard University</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Redefining quantum mechanics through stochastic foundations</p>
              <div className="space-y-2">
                <h4 className="font-semibold">Key Insights:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Reality as indivisible stochastic processes</li>
                  <li>• Reconceptualizing quantum foundations</li>
                  <li>• Mathematics as ontological bridge</li>
                  <li>• Realism through re-foundation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Start Your Philosophical Duel
            </CardTitle>
            <CardDescription>
              Ask any philosophical question or pose a topic for these brilliant minds to debate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 space-y-3">
                  <Input
                    placeholder="e.g., 'What is the nature of consciousness?' or 'How does information relate to reality?'"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleStartCustomDuel()}
                    className="text-base"
                  />
                  <Button 
                    onClick={handleStartCustomDuel} 
                    disabled={!userInput.trim()}
                    className="w-full"
                    size="lg"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Begin Philosophical Duel
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded border border-blue-200">
                💡 <strong>Examples:</strong> "What is the relationship between mind and matter?", "How does emergence work in complex systems?", "Is information fundamental to reality?"
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}