import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Upload, Trash2, Image as ImageIcon, Film, FolderPlus, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logger from "@/lib/logger";
import { events } from "@/data/events";

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
  const [uploadingFolder, setUploadingFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [customFolders, setCustomFolders] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

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

  const eventFolders = events.map((e) => e.title);
  const existingFolders = [...new Set(items.map((i) => i.folder))];
  const extraFolders = existingFolders.filter(
    (f) => !eventFolders.includes(f) && !customFolders.includes(f)
  );
  const allFolders = [...eventFolders, ...customFolders, ...extraFolders];

  const getItemsForFolder = (folder: string) =>
    items.filter((i) => i.folder === folder);

  const handleUpload = async (folder: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFolder(folder);
    try {
      for (const file of Array.from(files)) {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");
        if (!isImage && !isVideo) {
          toast.error(`${file.name} is not a supported file type`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);
        formData.append("mediaType", isImage ? "image" : "video");

        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gallery-upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          toast.error(`Failed to upload ${file.name}: ${err.error || "Unknown error"}`);
          logger.error("Upload error:", err);
        }
      }
      toast.success("Upload complete!");
      fetchItems();
    } catch (error) {
      logger.error("Upload error:", error);
      toast.error("Upload failed");
    } finally {
      setUploadingFolder(null);
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
      setSelectedItems((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
      fetchItems();
    } catch (error) {
      logger.error("Delete error:", error);
      toast.error("Failed to delete");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`Delete ${selectedItems.size} selected item(s)?`)) return;

    setBulkDeleting(true);
    let deleted = 0;
    for (const id of selectedItems) {
      const item = items.find((i) => i.id === id);
      if (!item) continue;
      try {
        const response = await supabase.functions.invoke("admin-events", {
          body: { action: "delete_gallery_item", itemId: item.id, fileUrl: item.file_url },
        });
        if (!response.error) deleted++;
      } catch (error) {
        logger.error("Bulk delete error:", error);
      }
    }
    toast.success(`Deleted ${deleted} item(s)`);
    setSelectedItems(new Set());
    setBulkDeleting(false);
    fetchItems();
  };

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (folder: string) => {
    const folderItems = getItemsForFolder(folder);
    const allSelected = folderItems.every((i) => selectedItems.has(i.id));
    setSelectedItems((prev) => {
      const next = new Set(prev);
      folderItems.forEach((i) => {
        if (allSelected) next.delete(i.id);
        else next.add(i.id);
      });
      return next;
    });
  };

  const addCustomFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    if (allFolders.includes(name)) {
      toast.error("Folder already exists");
      return;
    }
    setCustomFolders((prev) => [...prev, name]);
    setNewFolderName("");
    setShowNewFolder(false);
    toast.success(`Folder "${name}" created. Upload files to populate it.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-2xl font-semibold text-foreground">Gallery Management</h2>
        <div className="flex gap-2">
          {selectedItems.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
            >
              {bulkDeleting ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-1" />
              )}
              Delete {selectedItems.size} selected
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setShowNewFolder(!showNewFolder)}>
            <FolderPlus className="h-4 w-4 mr-1" /> New Folder
          </Button>
        </div>
      </div>

      {showNewFolder && (
        <div className="flex gap-2">
          <Input
            placeholder="New folder name (e.g. Retreat 2026)"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="max-w-xs"
            onKeyDown={(e) => e.key === "Enter" && addCustomFolder()}
          />
          <Button size="sm" onClick={addCustomFolder}>
            <Plus className="h-4 w-4 mr-1" /> Create
          </Button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {allFolders.map((folder) => {
            const folderItems = getItemsForFolder(folder);
            const isUploading = uploadingFolder === folder;
            const eventMatch = events.find((e) => e.title === folder);
            const allFolderSelected = folderItems.length > 0 && folderItems.every((i) => selectedItems.has(i.id));
            const someFolderSelected = folderItems.some((i) => selectedItems.has(i.id));

            return (
              <Card key={folder}>
                <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3 pb-3">
                  <div>
                    <CardTitle className="text-lg">{folder}</CardTitle>
                    {eventMatch && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {eventMatch.date} · {eventMatch.location}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {folderItems.length} {folderItems.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {folderItems.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSelectAll(folder)}
                        className="text-xs"
                      >
                        {allFolderSelected ? "Deselect all" : "Select all"}
                      </Button>
                    )}
                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={(e) => handleUpload(folder, e)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                      <Button size="sm" disabled={isUploading}>
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-1" />
                        )}
                        {isUploading ? "Uploading..." : "Upload"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {folderItems.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">No photos yet. Upload files above.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {folderItems.map((item) => {
                        const isSelected = selectedItems.has(item.id);
                        return (
                          <div
                            key={item.id}
                            className={`relative group rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                              isSelected ? "border-primary" : "border-border"
                            }`}
                            onClick={() => toggleSelect(item.id)}
                          >
                            {/* Selection checkbox */}
                            <div className={`absolute top-1.5 left-1.5 z-10 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleSelect(item.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-background/80"
                              />
                            </div>

                            {item.media_type === "image" ? (
                              <img
                                src={item.file_url}
                                alt={item.file_name}
                                className="w-full aspect-square object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full aspect-square bg-muted flex items-center justify-center relative">
                                <video
                                  src={item.file_url}
                                  className="w-full h-full object-cover"
                                  muted
                                  preload="metadata"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Film className="h-6 w-6 text-primary-foreground drop-shadow" />
                                </div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-end justify-end p-1.5 opacity-0 group-hover:opacity-100">
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(item);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
