import { Suspense } from "react";
import { getTestimonials } from "@/lib/notion";
import type { Testimonial } from "@/lib/notion";
import TestimoniClient from "@/components/TestimoniClient";

export const revalidate = 60;

function TestimonialsSkeleton() {
  return (
    <div className="w-full max-w-7xl px-0 md:px-16 mb-20 md:mb-32">
      <div className="flex gap-4 md:gap-6">
        <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-brand-brown/5 flex flex-col w-[80vw] max-w-[300px] md:max-w-none md:w-[420px] snap-start shrink-0 animate-pulse">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="w-12 h-12 rounded-full bg-brand-brown/10 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-brand-brown/10 rounded w-24" />
              <div className="h-3 bg-brand-brown/5 rounded w-16" />
            </div>
          </div>
          <div className="space-y-2 flex-grow">
            <div className="h-3 bg-brand-brown/5 rounded w-full" />
            <div className="h-3 bg-brand-brown/5 rounded w-3/4" />
            <div className="h-3 bg-brand-brown/5 rounded w-5/6" />
          </div>
          <div className="h-3 bg-brand-brown/5 rounded w-20 mt-8" />
        </div>
        <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-brand-brown/5 flex flex-col w-[80vw] max-w-[300px] md:max-w-none md:w-[420px] snap-start shrink-0 animate-pulse">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="w-12 h-12 rounded-full bg-brand-brown/10 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-brand-brown/10 rounded w-24" />
              <div className="h-3 bg-brand-brown/5 rounded w-16" />
            </div>
          </div>
          <div className="space-y-2 flex-grow">
            <div className="h-3 bg-brand-brown/5 rounded w-full" />
            <div className="h-3 bg-brand-brown/5 rounded w-3/4" />
            <div className="h-3 bg-brand-brown/5 rounded w-5/6" />
          </div>
          <div className="h-3 bg-brand-brown/5 rounded w-20 mt-8" />
        </div>
        <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-brand-brown/5 flex flex-col w-[80vw] max-w-[300px] md:max-w-none md:w-[420px] snap-start shrink-0 animate-pulse">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="w-12 h-12 rounded-full bg-brand-brown/10 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-brand-brown/10 rounded w-24" />
              <div className="h-3 bg-brand-brown/5 rounded w-16" />
            </div>
          </div>
          <div className="space-y-2 flex-grow">
            <div className="h-3 bg-brand-brown/5 rounded w-full" />
            <div className="h-3 bg-brand-brown/5 rounded w-3/4" />
            <div className="h-3 bg-brand-brown/5 rounded w-5/6" />
          </div>
          <div className="h-3 bg-brand-brown/5 rounded w-20 mt-8" />
        </div>
      </div>
    </div>
  );
}

export default async function TestimoniPage() {
  return (
    <Suspense fallback={<TestimonialsSkeleton />}>
      <TestimoniContent />
    </Suspense>
  );
}

async function TestimoniContent() {
  const testimonials = await getTestimonials();
  return <TestimoniClient testimonials={testimonials} />;
}