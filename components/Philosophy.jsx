export default function Philosophy() {
  return (
    <section id="philosophy" className="py-32 md:py-48 bg-black text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.9] mb-16">
            Chaos is the default.
            <br />
            <span className="text-white/60">Clarity is a choice.</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 text-xl md:text-2xl font-medium leading-relaxed text-white/80">
            <p>
              Your potential is limitless, but your focus isn't. Most tools just help you check boxes faster, but true productivity isn't about speed—it's about direction.
            </p>
            <p>
              Fulcrum doesn't just manage your tasks; it aligns your daily actions with your life's ambition. Stop reacting to the noise and start designing a life of intent.
            </p>
          </div>
        </div>
      </div>
      
      {/* Background Element */}
      <div className="absolute top-1/2 -right-64 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
