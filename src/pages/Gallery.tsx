import { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, Play, Image as ImageIcon, Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: string;
  folder: string;
  file_name: string;
  file_url: string;
  media_type: "image" | "video";
  display_order: number;
}

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoOpen, setVideoOpen] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("display_order", { ascending: true });
      if (!error && data) setItems(data as GalleryItem[]);
      setLoading(false);
    };
    fetchItems();
  }, []);

  const folders = [...new Set(items.map((i) => i.folder))];
  const currentItems = selectedFolder
    ? items.filter((i) => i.folder === selectedFolder)
    : items;
  const images = currentItems.filter((i) => i.media_type === "image");
  const videos = currentItems.filter((i) => i.media_type === "video");

  const openSlideshow = (index: number) => {
    setCurrentIndex(index);
    setSlideshowOpen(true);
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!slideshowOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      else if (e.key === "ArrowLeft") prevSlide();
      else if (e.key === "Escape") setSlideshowOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [slideshowOpen, nextSlide, prevSlide]);

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    if (!slideshowOpen) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slideshowOpen, nextSlide]);

  return (
    <Layout>
      <section className="section-padding bg-gradient-soft min-h-screen">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Gallery
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Relive the beautiful moments from our events and gatherings.
            </p>
          </div>

          {/* Folder filters */}
          {folders.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              <Button
                variant={selectedFolder === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFolder(null)}
              >
                All
              </Button>
              {folders.map((f) => (
                <Button
                  key={f}
                  variant={selectedFolder === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFolder(f)}
                >
                  {f}
                </Button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Loading gallery...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p>No gallery items yet. Check back soon!</p>
            </div>
          ) : (
            <>
              {/* Photos section */}
              {images.length > 0 && (
                <div className="mb-12">
                  <h2 className="font-display text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" /> Photos
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                      <div
                        key={img.id}
                        className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative"
                        onClick={() => openSlideshow(idx)}
                      >
                        <img
                          src={img.file_url}
                          alt={img.file_name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos section */}
              {videos.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Film className="h-5 w-5 text-primary" /> Videos
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((vid) => (
                      <div
                        key={vid.id}
                        className="aspect-video rounded-xl overflow-hidden cursor-pointer group relative bg-muted"
                        onClick={() => setVideoOpen(vid.file_url)}
                      >
                        <video
                          src={vid.file_url}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 group-hover:bg-foreground/30 transition-colors">
                          <div className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center">
                            <Play className="h-6 w-6 text-primary-foreground ml-1" />
                          </div>
                        </div>
                        <p className="absolute bottom-2 left-3 text-sm text-primary-foreground font-medium drop-shadow">
                          {vid.file_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Photo slideshow dialog */}
      <Dialog open={slideshowOpen} onOpenChange={setSlideshowOpen}>
        <DialogContent className="max-w-5xl w-full p-0 bg-foreground/95 border-none [&>button]:hidden">
          <div className="relative flex items-center justify-center min-h-[60vh] max-h-[90vh]">
            <button
              onClick={() => setSlideshowOpen(false)}
              className="absolute top-4 right-4 z-10 text-primary-foreground/80 hover:text-primary-foreground"
            >
              <X className="h-6 w-6" />
            </button>
            {images.length > 0 && (
              <img
                src={images[currentIndex]?.file_url}
                alt={images[currentIndex]?.file_name}
                className="max-h-[85vh] max-w-full object-contain"
              />
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/20 hover:bg-background/40 flex items-center justify-center text-primary-foreground"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/20 hover:bg-background/40 flex items-center justify-center text-primary-foreground"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={cn(
                        "h-2 rounded-full transition-all",
                        i === currentIndex ? "w-6 bg-primary" : "w-2 bg-primary-foreground/40"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Video player dialog */}
      <Dialog open={!!videoOpen} onOpenChange={() => setVideoOpen(null)}>
        <DialogContent className="max-w-4xl w-full p-0 bg-foreground border-none [&>button]:hidden">
          <div className="relative">
            <button
              onClick={() => setVideoOpen(null)}
              className="absolute -top-10 right-0 text-primary-foreground/80 hover:text-primary-foreground"
            >
              <X className="h-6 w-6" />
            </button>
            {videoOpen && (
              <video
                src={videoOpen}
                controls
                autoPlay
                className="w-full rounded-xl"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Gallery;
