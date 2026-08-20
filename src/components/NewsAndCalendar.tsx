import React, { useState } from 'react';
import { 
  Newspaper, 
  Calendar, 
  MapPin, 
  Heart, 
  Share2, 
  ExternalLink, 
  Clock, 
  Flame, 
  Trophy,
  CheckCircle2,
  Tv
} from 'lucide-react';
import { NewsArticle, TournamentEvent } from '../types';
import { NEWS_ARTICLES, TOURNAMENT_CALENDAR } from '../data/news';

export const NewsAndCalendar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'noticias' | 'calendario'>('noticias');
  const [articles, setArticles] = useState<NewsArticle[]>(NEWS_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [likedArticles, setLikedArticles] = useState<string[]>([]);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedArticles.includes(id)) {
      setLikedArticles(likedArticles.filter((item) => item !== id));
      setArticles(articles.map((a) => (a.id === id ? { ...a, likes: a.likes - 1 } : a)));
    } else {
      setLikedArticles([...likedArticles, id]);
      setArticles(articles.map((a) => (a.id === id ? { ...a, likes: a.likes + 1 } : a)));
    }
  };

  return (
    <div id="news-calendar-section" className="space-y-6">
      {/* Header Bar */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-amber-400" />
              Notícias do Tatame & Calendário de Campeonatos
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Acompanhe as novidades do circuito mundial da IBJJF, ADCC, superlutas profissionais e eventos nacionais.
            </p>
          </div>

          <div className="inline-flex rounded-xl bg-zinc-950 p-1 border border-zinc-800 shrink-0">
            <button
              onClick={() => setActiveTab('noticias')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'noticias' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Notícias & Artigos</span>
            </button>
            <button
              onClick={() => setActiveTab('calendario')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'calendario' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Calendário de Torneios</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: News Articles */}
      {activeTab === 'noticias' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => {
            const isLiked = likedArticles.includes(article.id);
            return (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-xl cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                      {article.category}
                    </span>
                    <span className="text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors leading-tight">
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-300 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {article.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <span>Por {article.author} • {article.date}</span>

                  <button
                    onClick={(e) => handleLike(article.id, e)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                      isLiked ? 'text-red-500 bg-red-950/30' : 'text-zinc-400 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{article.likes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Tournament Calendar */}
      {activeTab === 'calendario' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOURNAMENT_CALENDAR.map((event) => (
              <div
                key={event.id}
                className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black px-3 py-1 rounded-lg bg-amber-500 text-zinc-950">
                      {event.organization}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-semibold">
                      {event.modality}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white leading-tight">
                    {event.name}
                  </h3>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-1.5 pt-2 text-xs">
                    <div className="flex items-center gap-2 text-amber-400 font-semibold">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <MapPin className="w-4 h-4 text-red-400" />
                      <span>{event.location}</span>
                    </div>
                    {event.livestreamInfo && (
                      <div className="flex items-center gap-2 text-blue-400">
                        <Tv className="w-4 h-4" />
                        <span>{event.livestreamInfo}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Inscrições em breve no portal oficial
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-zinc-800 pb-4">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                {selectedArticle.category}
              </span>
              <h2 className="text-2xl font-black text-white mt-2 leading-tight">
                {selectedArticle.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Por {selectedArticle.author} • {selectedArticle.date} • {selectedArticle.readTime}
              </p>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-zinc-200 leading-relaxed">
              {selectedArticle.content.map((para, idx) => (
                <p key={idx} className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/50">
                  {para}
                </p>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <div className="flex flex-wrap gap-1">
                {selectedArticle.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                    #{t}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400"
              >
                Fechar Artigo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
