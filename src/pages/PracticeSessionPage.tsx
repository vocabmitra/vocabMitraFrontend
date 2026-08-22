import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trophy } from 'lucide-react';
import { usePracticeStore } from '../store/usePracticeStore';
import { PracticeFlashcard } from '../components/vocab/PracticeFlashcard';

export default function PracticeSessionPage() {
  const navigate = useNavigate();
  const { session, endSession } = usePracticeStore();

  // If someone hits this route directly without starting a session, kick them back
  useEffect(() => {
    if (!session.isActive) {
      navigate('/profile');
    }
  }, [session.isActive, navigate]);

  const handleEndSession = () => {
    endSession();
    navigate('/profile');
  };

  const isFinished = session.currentIndex >= session.cards.length;

  return (
    <div className="min-h-screen bg-[#0F1219] flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] aspect-square bg-[#E8734A]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] aspect-square bg-[#5B7FDE]/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
        <div className="font-space font-bold text-white/50 tracking-widest text-[13px] uppercase">
          Practice Mode
        </div>
        <button
          onClick={handleEndSession}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors p-2"
        >
          <span className="font-inter text-sm font-medium hidden sm:block">End Session</span>
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="z-10 w-full px-4 flex flex-col items-center">
        {!isFinished ? (
          <>
            {/* Progress indicator */}
            <div className="font-space text-[14px] font-bold text-white/40 tracking-[0.2em] mb-8">
              {session.currentIndex + 1} / {session.cards.length}
            </div>

            <PracticeFlashcard 
              key={`${session.cards[session.currentIndex].vocab.id}-${session.currentIndex}`}
              card={session.cards[session.currentIndex]} 
            />
          </>
        ) : (
          <div className="flex flex-col items-center text-center animate-fade-up">
            <div className="w-24 h-24 rounded-full bg-[#27C93F]/10 border-2 border-[#27C93F]/30 flex items-center justify-center mb-6">
              <Trophy size={40} className="text-[#27C93F]" />
            </div>
            <h1 className="font-bricolage text-[48px] font-extrabold text-white mb-4">
              Session Complete!
            </h1>
            <p className="font-inter text-[18px] text-white/70 max-w-[400px] mb-10 leading-relaxed">
              You've successfully reviewed all the cards in this session. Great job building those memory hooks!
            </p>
            <button
              onClick={handleEndSession}
              className="px-10 py-4 rounded-full bg-white text-[#0F1219] font-bold font-inter text-[18px] hover:scale-105 transition-transform"
            >
              Return to Profile
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
}
