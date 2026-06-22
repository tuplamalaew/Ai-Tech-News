import { ProcessedArticle } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export function DigestCard({ article }: { article: ProcessedArticle }) {
  const isHN = article.source === 'Hacker News';

  return (
    <Card className="group flex flex-col h-full border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:-translate-y-1">
      <CardHeader className="pb-3 flex-none">
        <div className="flex justify-between items-start gap-4 mb-3">
          <Badge 
            variant={isHN ? "default" : "secondary"} 
            className={isHN ? "bg-orange-600 hover:bg-orange-700 text-white" : "bg-slate-700 text-slate-100 hover:bg-slate-600"}
          >
            {article.source}
          </Badge>
        </div>
        <CardTitle className="text-xl text-slate-100 leading-tight group-hover:text-blue-400 transition-colors">
          <span className="mr-2">{article.emoji}</span>
          {article.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col md:flex-row gap-4">
        {article.imageUrl && (
          <div className="shrink-0 w-full md:w-32 h-32 rounded-md overflow-hidden bg-slate-800 border border-slate-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}
        <CardDescription className="text-slate-400 text-sm md:text-base leading-relaxed">
          {article.summary}
        </CardDescription>
      </CardContent>
      
      <CardFooter className="flex-none pt-4">
        <a 
          href={article.url} 
          target="_blank" 
          rel="noreferrer" 
          className={buttonVariants({ variant: "outline", className: "w-full border-slate-700 bg-transparent text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors" })}
        >
          อ่านบทความเต็ม (Read Full Article)
        </a>
      </CardFooter>
    </Card>
  );
}
