import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, Trash2, Image as ImageIcon, Film, FolderPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logger from "@/lib/logger";

interface GalleryItem {
  id: string;
  folder: string;
  file_name: string;
  file_url: string;
  media_type: "image" | "video";
  display_order: number;
}

export function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await supabase.functions.invoke("admin-events", {
        body: { action: "get_gallery_items" },
      });
      if (response.error) throw response.error;
      setItems(response.data.items || []);
    } catch (error) {
      logger.error("Error fetching gallery items:", error);
      toast.error("Failed to load gallery items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const folders = [...new Set(items.map((i) => i.folder))];
  const filteredItems = selectedFolder === "all" ? items : items.filter((i) => i.folder === selectedFolder);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const folder = selectedFolder === "all" || selectedFolder === ""
      ? (newFolderName.trim() || "General")
      : selectedFolder;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");
        if (!isImage && !isVideo) {
          toast.error(`${file.name} is not a supported file type`);
          continue;
        }

        // Upload to storage via edge function
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);
        formData.append("mediaType", isImage ? "image" : "video");

        const response = await supabase.functions.invoke("gallery-upload", {
          body: formData,
        });

        if (response.error) {
          toast.error(`Failed to upload ${file.name}`);
          logger.error("Upload error:", response.error);
        }
      }
      toast.success("Upload complete!");
      fetchItems();
    } catch (error) {
      logger.error("Upload error:", error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm(`Delete "${item.file_name}"?`)) return;
    try {
      const response = await supabase.functions.invoke("admin-events", {
        body: { action: "delete_gallery_item", itemId: item.id, fileUrl: item.file_url },
      });
      if (response.error) throw response.error;
      toast.success("Deleted!");
      fetchItems();
    } catch (error) {
      logger.error("Delete error:", error);
      toast.error("Failed to delete");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
        <CardTitle>Gallery Management</CardTitle>
        <div className="flex gap-2 items-center flex-wrap">
          <Select value={selectedFolder} onValueChange={setSelectedFolder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select folder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Folders</SelectItem>
              {folders.map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => setShowNewFolder(!showNewFolder)}>
            <FolderPlus className="h-4 w-4 mr-1" /> New Folder
          </Button>

          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <Button size="sm" disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
              {uploading ? "Uploading..." : "Upload Files"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showNewFolder && (
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="New folder name (e.g. LoveHer 2026)"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="max-w-xs"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (newFolderName.trim()) {
                  setSelectedFolder(newFolderName.trim());
                  setShowNewFolder(false);
                  toast.success(`Folder "${newFolderName.trim()}" ready. Upload files to create it.`);
                }
              }}
            >
              Use Folder
            </Button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p>No gallery items. Upload photos or videos above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="relative group rounded-xl overflow-hidden border border-border">
                {item.media_type === "image" ? (
                  <img src={item.file_url} alt={item.file_name} className="w-full aspect-square object-cover" loading="lazy" />
                ) : (
                  <div className="w-full aspect-square bg-muted flex items-center justify-center relative">
                    <video src={item.file_url} className="w-full h-full object-cover" muted preload="metadata" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Film className="h-8 w-8 text-primary-foreground drop-shadow" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-end justify-between p-2 opacity-0 group-hover:opacity-100">
                  <span className="text-xs text-primary-foreground font-medium truncate mr-2 drop-shadow">{item.folder}</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-7 w-7 p-0"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
