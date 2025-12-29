'use client';

import Image from 'next/image';

const features = [
  {
    title: "Capture everything.\nMiss nothing.",
    description: "The brain is for having ideas, not holding them. Capture tasks, notes, and random thoughts instantly. Let Fulcrum organize the chaos so you can focus on execution.",
    image: "/women_checklist.jpg", // Placeholder for user's image
    align: "right"
  },
  {
    title: "Deep work,\nby default.",
    description: "Distractions are the enemy. Enter flow state with built-in focus timers, blocked calendars, and a ruthless prioritization engine that hides what doesn't matter right now.",
    image: "/man_charts_illustration.jpg", // Placeholder for user's image
    align: "left"
  },
  {
    title: "See the big picture.",
    description: "Don't just do tasks—move mountains. Visualize your progress with beautiful analytics and Kanban boards that turn your daily grind into a strategic game.",
    image: "/illustration_bigger_picture.jpg", // Placeholder for user's image
    align: "right"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-32 bg-white text-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col gap-32">
        
        {features.map((feature, index) => (
          <div key={index} className={`flex flex-col ${feature.align === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24`}>
            
            {/* Text Content */}
            <div className="md:w-1/2 flex flex-col gap-6">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.9] whitespace-pre-line">
                {feature.title}
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed max-w-lg">
                {feature.description}
              </p>
            </div>

            {/* Illustration */}
            <div className="md:w-1/2 w-full relative aspect-square md:aspect-[4/3]">
              <div className="absolute inset-0 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-center overflow-hidden group">
                {/* Fallback text if image missing */}
                <span className="text-gray-400 font-mono text-sm absolute z-0">
                   Add {feature.image} to /public
                </span>
                
                {/* Actual Image Component - User needs to add files */}
                <Image 
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-contain p-8 z-10 "
                />
              </div>
            </div>

          </div>
        ))}

      </div>
    </section>
  );
}
