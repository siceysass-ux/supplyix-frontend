import React from 'react';

const YouTubeSection: React.FC = () => {
  // NOTE: In a real-world application, you would use a backend service and the 
  // YouTube Data API to fetch the latest video ID for the channel dynamically.
  // For security and simplicity in this environment, we are using a hardcoded video ID.
  const latestVideoId = 'L-wBH-o24n0'; // Example Video ID from Supplyix Channel

  return (
    <section id="latest-video" className="py-16 md:py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            En Güncel Videomuz
          </h2>
          <p className="mt-3 text-lg text-dark-blue dark:text-slate-300">
            YouTube kanalımızdan en son gelişmeleri ve ipuçlarını izleyin.
          </p>
        </div>

        {/* Video Player with Corporate Frame */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border-4 border-primary p-3 shadow-2xl shadow-primary/20">
            <div className="aspect-video w-full">
                <iframe
                    className="w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${latestVideoId}`}
                    title="En Son Supplyix YouTube Videosu"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;