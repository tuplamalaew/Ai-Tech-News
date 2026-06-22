import { getHistory } from "@/services/storage";
import { DigestCard } from "@/components/digest-card";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const history = await getHistory();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
        
        <header className="mb-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            AI-Driven Curation
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Tech Trend Digest
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl">
            Daily curated top stories from Hacker News and Dev.to, summarized by AI to save your time.
          </p>
        </header>

        {!history || history.articles.length === 0 ? (
          <div className="text-center py-20 border border-slate-800 border-dashed rounded-2xl bg-slate-900/20">
            <h2 className="text-2xl font-semibold text-slate-300 mb-3">No data available yet</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Please trigger the API to fetch and summarize the latest news.
            </p>
            <div className="mt-6">
              <a 
                href="/api/cron" 
                target="_blank"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2"
              >
                Trigger /api/cron
              </a>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M3 15h6"/><path d="M3 18h6"/></svg>
                ข่าวสารล่าสุด (Latest Stories)
              </h2>
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-md border border-slate-800">
                  อัปเดตล่าสุด: <span className="text-slate-300">{new Date(history.lastUpdated).toLocaleString('th-TH')}</span>
                </div>
                <a 
                  href="/api/cron" 
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2 whitespace-nowrap"
                >
                  อัปเดตข่าวใหม่
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.articles.map((article, index) => (
                <div key={article.url} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}>
                  <DigestCard article={article} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
