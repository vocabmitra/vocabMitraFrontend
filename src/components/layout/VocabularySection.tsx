export function VocabularySection() {
  const words = [
    { word: 'Lassitude', next: 'Next practice in 2 days', progress: '20%' },
    { word: 'Obstinate', next: 'Next practice in 2 days', progress: '30%' },
    { word: 'Alacrity', next: 'Next practice in 2 days', progress: '50%' },
    { word: 'Candid', next: 'Next practice in 2 days', progress: '60%' },
  ];

  return (
    <section className="w-full bg-cream py-24 border-b-2 border-ink overflow-hidden">
      <div className="vv-container flex flex-col items-center">
        
        {/* Header Content */}
        <div className="max-w-[700px] w-full text-center mb-6">
          <h3 className="font-space text-upsc text-sm font-bold tracking-[0.1em] uppercase mb-4">
            My Vocabulary
          </h3>
          <h2 className="font-bricolage text-[clamp(36px,5vw,52px)] font-extrabold text-ink leading-[1.1] tracking-[-0.03em] mb-6">
            Your words, growing quietly in the background.
          </h2>
          <p className="text-[17.5px] text-ink-soft font-medium leading-[1.65]">
            Two honest states: still learning, and mastered. Nothing labelled weak or forgotten.
          </p>
        </div>

        {/* UI Mockup Container */}
        <div className="w-full max-w-[700px] mx-auto mt-16 bg-cream-card rounded-[24px] border-2 border-ink shadow-[8px_8px_0_var(--ink)] sm:shadow-[16px_16px_0_var(--ink)] overflow-hidden transition-transform duration-300 hover:-translate-y-1">
          
          {/* Top Toggle */}
          <div className="flex border-b-2 border-ink p-4 sm:p-5 bg-white gap-3">
            <button className="flex-1 py-3 sm:py-3.5 text-center rounded-[12px] bg-upsc text-white font-bold text-[15px] border-2 border-ink shadow-[2px_2px_0_var(--ink)] hover:translate-y-px hover:shadow-[1px_1px_0_var(--ink)] transition-all active:translate-y-[2px] active:shadow-none">
              Learning
            </button>
            <button className="flex-1 py-3 sm:py-3.5 text-center rounded-[12px] bg-transparent text-ink-soft font-bold text-[15px] hover:text-ink hover:bg-ink/5 transition-colors">
              Mastered
            </button>
          </div>

          {/* List Area */}
          <div className="flex flex-col">
            {words.map((item, index) => (
              <div 
                key={item.word}
                className={`flex justify-between items-center p-6 sm:px-8 sm:py-7 hover:bg-white transition-colors cursor-pointer ${
                  index !== words.length - 1 ? 'border-b-2 border-ink/20' : ''
                }`}
              >
                <div>
                  <h4 className="font-bricolage text-[20px] sm:text-[22px] font-bold text-ink uppercase mb-1 tracking-[-0.01em]">
                    {item.word}
                  </h4>
                  <p className="text-[14px] sm:text-[14.5px] text-ink-soft font-medium">
                    {item.next}
                  </p>
                </div>

                <div className="w-[100px] sm:w-[140px] h-3 bg-ink/10 rounded-full border border-ink/20 overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-upsc rounded-full" 
                    style={{ width: item.progress }} 
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
