import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import logger from "@/lib/logger";

interface GallerySlide {
  id: string;
  folder: string;
  file_name: string;
  file_url: string;
  media_type: "image" | "video";
}

const shuffleSlides = (slides: GallerySlide[]) => {
  const remaining = [...slides];
  const shuffled: GallerySlide[] = [];

  while (remaining.length > 0) {
    const randomIndex = Math.floor(Math.random() * remaining.length);
    const [slide] = remaining.splice(randomIndex, 1);
    if (slide) shuffled.push(slide);
  }

  return shuffled;
};

export const HomeGalleryCarousel = () => {
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [isPaused, setIsPaused] = useState(reducedMotion);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState<GallerySlide | null>(null);

  const { data: slides = [], isLoading, isError } = useQuery({
    queryKey: ["homepage-gallery"],
    queryFn: async (): Promise<GallerySlide[]> => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("id, folder, file_name, file_url, media_type");

      if (error) {
        logger.error("Unable to load homepage gallery:", error);
        throw error;
      }

      const supportedMedia = (data ?? []).filter(
        (item) => item.media_type === "image" || item.media_type === "video",
      ) as GallerySlide[];

      return shuffleSlides(supportedMedia);
    },
  });

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) setIsPaused(true);
    };

    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || isPaused || reducedMotion || activeVideo) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [activeVideo, isPaused, reducedMotion, slides.length]);

  if (isError || (!isLoading && slides.length === 0)) return null;

  const currentSlide = slides[currentIndex];
  const previousSlide = () => setCurrentIndex((index) => (index - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentIndex((index) => (index + 1) % slides.length);

  return (
    <section className="section-padding bg-gradient-soft">
      <div className="container-custom mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            From our community
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mt-4">
            Moments of Sisterhood
          </h2>
        </div>

        {isLoading ? (
          <div
            role="status"
            aria-label="Loading community photos and videos"
            className="aspect-video w-full max-w-5xl mx-auto rounded-md bg-muted animate-pulse"
          />
        ) : currentSlide ? (
          <div className="mx-auto max-w-5xl" role="region" aria-label="Her Frequency community gallery">
            <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
              {currentSlide.media_type === "image" ? (
                <img
                  src={currentSlide.file_url}
                  alt={`Photo from ${currentSlide.folder}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute inset-0 h-full w-full rounded-none p-0 hover:bg-foreground/10"
                  onClick={() => setActiveVideo(currentSlide)}
                  aria-label={`Play video from ${currentSlide.folder}`}
                >
                  <video
                    src={currentSlide.file_url}
                    muted
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-foreground/20 text-primary-foreground transition-colors group-hover:bg-foreground/30">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90">
                      <Play className="ml-1 h-7 w-7" />
                    </span>
                  </span>
                </Button>
              )}

              {slides.length > 1 && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/85"
                    onClick={previousSlide}
                    aria-label="Previous gallery item"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/85"
                    onClick={nextSlide}
                    aria-label="Next gallery item"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>

            {slides.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <Button type="button" variant="outline" size="icon" onClick={previousSlide} aria-label="Previous gallery item">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="min-w-16 text-center text-sm text-muted-foreground" aria-live="polite">
                  {currentIndex + 1} of {slides.length}
                </span>
                {!reducedMotion && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setIsPaused((paused) => !paused)}
                    aria-label={isPaused ? "Resume automatic slideshow" : "Pause automatic slideshow"}
                  >
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                )}
                <Button type="button" variant="outline" size="icon" onClick={nextSlide} aria-label="Next gallery item">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            <Dialog open={Boolean(activeVideo)} onOpenChange={(open) => !open && setActiveVideo(null)}>
              <DialogContent className="w-[calc(100vw-2rem)] max-w-5xl p-3 sm:p-5">
                {activeVideo && (
                  <>
                    <DialogTitle className="sr-only">Video from {activeVideo.folder}</DialogTitle>
                    <video
                      src={activeVideo.file_url}
                      controls
                      autoPlay
                      playsInline
                      className="max-h-[80vh] w-full rounded-md"
                    >
                      Your browser does not support video playback.
                    </video>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        ) : null}
      </div>
    </section>
  );
};