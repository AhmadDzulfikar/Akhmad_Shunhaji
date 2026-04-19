import { Navbar } from "@/components/navbar";

const placeholderCards = Array.from({ length: 9 }, (_, index) => index);
const placeholderPagination = Array.from({ length: 7 }, (_, index) => index);

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navbar />

      <div className="pt-20 pb-6 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold text-[#f5f1e8] tracking-tight">Shunhaji Blog</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-[#4a9d6f] to-[#2d6a4f] mt-6" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {placeholderCards.map((item) => (
            <div key={item} className="overflow-hidden rounded-lg border border-[#3a3a3a] bg-[#262727] animate-pulse">
              <div className="h-48 bg-[#1f2020]" />
              <div className="space-y-4 p-6">
                <div className="h-6 rounded bg-[#343636]" />
                <div className="h-4 rounded bg-[#343636]" />
                <div className="h-4 w-5/6 rounded bg-[#343636]" />
                <div className="mt-6 flex items-center justify-between">
                  <div className="h-4 w-24 rounded bg-[#343636]" />
                  <div className="h-4 w-16 rounded bg-[#343636]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 px-4 pb-20">
        {placeholderPagination.map((item) => (
          <div key={item} className="h-10 w-10 rounded-lg border border-[#3a3a3a] bg-[#262727] animate-pulse" />
        ))}
      </div>
    </div>
  );
}
