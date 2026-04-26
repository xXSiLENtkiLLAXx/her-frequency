import { useState, useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { RefreshCw, Users, Settings, Download, LogOut, Loader2, Star, MessageSquare, Check, X, Trash2, Image as ImageIcon } from "lucide-react";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import logger from "@/lib/logger";

interface Registration {
  id: string;
  event_id: number;
  first_name: string;
  last_name: string;
  email: string;
  cellphone: string;
  payment_confirmed: boolean;
  created_at: string;
  confirmed_at: string | null;
}

interface EventSetting {
  id: string;
  event_id: number;
  event_name: string;
  total_spots: number;
  reserved_spots: number;
  updated_at: string;
}

interface AdminTestimonial {
  id: string;
  name: string;
  role: string | null;
  location: string | null;
  quote: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

const AdminEvents = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAdminAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const validTabs = ["registrations", "settings", "reviews", "gallery"] as const;
  const tabParam = searchParams.get("tab");
  const activeTab = (validTabs as readonly string[]).includes(tabParam || "")
    ? (tabParam as string)
    : "registrations";
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [eventSettings, setEventSettings] = useState<EventSetting[]>([]);
  const [selectedEventFilter, setSelectedEventFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [spotsInput, setSpotsInput] = useState<Record<number, string>>({});
  const [reservedInput, setReservedInput] = useState<Record<number, string>>({});
  const [spotsLeftInput, setSpotsLeftInput] = useState<Record<number, number>>({});
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([]);
  const [testimonialFilter, setTestimonialFilter] = useState<"all" | "pending" | "approved">("all");

  const fetchData = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      // Fetch registrations - no longer needs adminKey, uses JWT auth
      const regResponse = await supabase.functions.invoke("admin-events", {
        body: {
          action: "get_registrations",
          eventId: selectedEventFilter,
        },
      });

      if (regResponse.error) throw regResponse.error;
      setRegistrations(regResponse.data.registrations || []);

      // Fetch event settings
      const settingsResponse = await supabase.functions.invoke("admin-events", {
        body: {
          action: "get_event_settings",
        },
      });

      if (settingsResponse.error) throw settingsResponse.error;
      setEventSettings(settingsResponse.data.settings || []);
      
      // Initialize spots input values
      const inputValues: Record<number, string> = {};
      const reservedValues: Record<number, string> = {};
      const spotsLeftValues: Record<number, number> = {};
      settingsResponse.data.settings?.forEach((s: EventSetting) => {
        inputValues[s.event_id] = s.total_spots.toString();
        reservedValues[s.event_id] = (s.reserved_spots || 0).toString();
      });
      setSpotsInput(inputValues);
      setReservedInput(reservedValues);
      // Spots left will be computed after registrations are available
      setSpotsLeftInput(spotsLeftValues);

      // Fetch testimonials
      const testimonialsResponse = await supabase.functions.invoke("admin-events", {
        body: { action: "get_testimonials" },
      });
      if (testimonialsResponse.error) throw testimonialsResponse.error;
      setTestimonials(testimonialsResponse.data.testimonials || []);
    } catch (error) {
      logger.error("Error fetching admin data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [selectedEventFilter, isAdmin]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <Layout>
        <section className="section-padding bg-gradient-soft min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Checking authentication...</span>
          </div>
        </section>
      </Layout>
    );
  }

  // Redirect if not authenticated or not admin
  if (!user || !isAdmin) {
    return <Navigate to="/events/admin/login" replace />;
  }

  const handleUpdateSpots = async (eventId: number) => {
    const newSpots = parseInt(spotsInput[eventId]);
    if (isNaN(newSpots) || newSpots < 0) {
      toast.error("Please enter a valid number");
      return;
    }

    try {
      const response = await supabase.functions.invoke("admin-events", {
        body: {
          action: "update_total_spots",
          eventId,
          totalSpots: newSpots,
        },
      });

      if (response.error) throw response.error;
      toast.success("Total spots updated!");
      fetchData();
    } catch (error) {
      logger.error("Error updating spots:", error);
      toast.error("Failed to update spots");
    }
  };

  const handleUpdateReserved = async (eventId: number) => {
    const newReserved = parseInt(reservedInput[eventId]);
    if (isNaN(newReserved) || newReserved < 0) {
      toast.error("Please enter a valid number");
      return;
    }

    try {
      const response = await supabase.functions.invoke("admin-events", {
        body: {
          action: "update_reserved_spots",
          eventId,
          reservedSpots: newReserved,
        },
      });

      if (response.error) throw response.error;
      toast.success("Reserved spots updated!");
      fetchData();
    } catch (error) {
      logger.error("Error updating reserved spots:", error);
      toast.error("Failed to update reserved spots");
    }
  };

  const getConfirmedCount = (eventId: number) => {
    return registrations.filter(
      (r) => r.event_id === eventId && r.payment_confirmed
    ).length;
  };

  const getSpotsLeft = (eventId: number) => {
    const setting = eventSettings.find((s) => s.event_id === eventId);
    const total = setting?.total_spots || 0;
    const reserved = setting?.reserved_spots || 0;
    const confirmed = getConfirmedCount(eventId);
    return total - confirmed - reserved;
  };

  const exportToCSV = () => {
    const headers = ["First Name", "Last Name", "Email", "Cellphone", "Event ID", "Payment Confirmed", "Registered At", "Confirmed At"];
    const rows = registrations.map((r) => [
      r.first_name, r.last_name, r.email, r.cellphone, r.event_id,
      r.payment_confirmed ? "Yes" : "No",
      new Date(r.created_at).toLocaleString(),
      r.confirmed_at ? new Date(r.confirmed_at).toLocaleString() : "N/A",
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApproveTestimonial = async (id: string, approve: boolean) => {
    try {
      const response = await supabase.functions.invoke("admin-events", {
        body: { action: "update_testimonial_approval", testimonialId: id, isApproved: approve },
      });
      if (response.error) throw response.error;
      toast.success(approve ? "Review approved!" : "Review rejected");
      fetchData();
    } catch (error) {
      logger.error("Error updating testimonial:", error);
      toast.error("Failed to update review");
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    try {
      const response = await supabase.functions.invoke("admin-events", {
        body: { action: "delete_testimonial", testimonialId: id },
      });
      if (response.error) throw response.error;
      toast.success("Review deleted");
      fetchData();
    } catch (error) {
      logger.error("Error deleting testimonial:", error);
      toast.error("Failed to delete review");
    }
  };

  const filteredTestimonials = testimonials.filter((t) => {
    if (testimonialFilter === "pending") return !t.is_approved;
    if (testimonialFilter === "approved") return t.is_approved;
    return true;
  });

  return (
    <Layout>
      <section className="section-padding bg-gradient-soft min-h-screen">
        <div className="container-custom mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-semibold text-foreground">
                Event Administration
              </h1>
              <p className="text-muted-foreground mt-2">
                Logged in as {user?.email}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={signOut} variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              const next = new URLSearchParams(searchParams);
              if (v === "registrations") next.delete("tab");
              else next.set("tab", v);
              setSearchParams(next, { replace: true });
            }}
            className="space-y-6"
          >
            <TabsList>
              <TabsTrigger value="registrations" className="gap-2">
                <Users className="h-4 w-4" />
                Registrations
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Event Settings
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Reviews
                {testimonials.filter(t => !t.is_approved).length > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 min-w-5 text-xs px-1.5">
                    {testimonials.filter(t => !t.is_approved).length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="gallery" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Gallery
              </TabsTrigger>
            </TabsList>

            <TabsContent value="registrations">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>All Registrations</CardTitle>
                  <div className="flex gap-4">
                    <Select
                      value={selectedEventFilter}
                      onValueChange={setSelectedEventFilter}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by event" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        {eventSettings.map((setting) => (
                          <SelectItem
                            key={setting.event_id}
                            value={setting.event_id.toString()}
                          >
                            {setting.event_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={exportToCSV} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading...
                    </div>
                  ) : registrations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No registrations found
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Cellphone</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Registered</TableHead>
                            <TableHead>Payment Confirmed</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {registrations.map((reg) => (
                            <TableRow key={reg.id}>
                              <TableCell className="font-medium">
                                {reg.first_name} {reg.last_name}
                              </TableCell>
                              <TableCell>{reg.email}</TableCell>
                              <TableCell>{reg.cellphone}</TableCell>
                              <TableCell>
                                {eventSettings.find(
                                  (s) => s.event_id === reg.event_id
                                )?.event_name || `Event ${reg.event_id}`}
                              </TableCell>
                              <TableCell>
                                {reg.payment_confirmed ? (
                                  <Badge className="bg-accent text-accent-foreground">
                                    Confirmed
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">Pending</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {new Date(reg.created_at).toLocaleDateString()}{" "}
                                {new Date(reg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {reg.confirmed_at ? (
                                  <>
                                    {new Date(reg.confirmed_at).toLocaleDateString()}{" "}
                                    {new Date(reg.confirmed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </>
                                ) : (
                                  <span className="text-muted-foreground/50">—</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <div className="grid gap-6">
                {eventSettings.map((setting) => {
                  const confirmedCount = getConfirmedCount(setting.event_id);
                  const spotsLeft = getSpotsLeft(setting.event_id);

                  return (
                    <Card key={setting.id}>
                      <CardHeader>
                        <CardTitle className="text-xl">
                          {setting.event_name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-5 gap-6">
                          <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <p className="text-sm text-muted-foreground mb-1">
                              Total Spots
                            </p>
                            <p className="text-2xl font-semibold text-foreground">
                              {setting.total_spots}
                            </p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <p className="text-sm text-muted-foreground mb-1">
                              Confirmed
                            </p>
                            <p className="text-2xl font-semibold text-primary">
                              {confirmedCount}
                            </p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <p className="text-sm text-muted-foreground mb-1">
                              Reserved
                            </p>
                            <p className="text-2xl font-semibold text-muted-foreground">
                              {setting.reserved_spots || 0}
                            </p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <p className="text-sm text-muted-foreground mb-1">
                              Spots Left
                            </p>
                            <p className={`text-2xl font-semibold ${spotsLeft <= 10 ? "text-destructive" : "text-foreground"}`}>
                              {spotsLeft}
                            </p>
                          </div>
                          <div></div>

                          {/* Spots Left Slider */}
                          <div className="md:col-span-5 border-t border-border pt-4 mt-2">
                            <label className="text-sm text-muted-foreground mb-3 block">
                              Adjust Spots Left: <span className="font-semibold text-foreground">{spotsLeftInput[setting.event_id] ?? spotsLeft}</span>
                            </label>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-muted-foreground">0</span>
                              <Slider
                                value={[spotsLeftInput[setting.event_id] ?? spotsLeft]}
                                onValueChange={(value) => {
                                  setSpotsLeftInput({
                                    ...spotsLeftInput,
                                    [setting.event_id]: value[0],
                                  });
                                }}
                                min={0}
                                max={setting.total_spots}
                                step={1}
                                className="flex-1"
                              />
                              <span className="text-xs text-muted-foreground">{setting.total_spots}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <p className="text-xs text-muted-foreground flex-1">
                                This adjusts reserved spots to achieve the desired spots left. (Reserved will become {setting.total_spots - confirmedCount - (spotsLeftInput[setting.event_id] ?? spotsLeft)})
                              </p>
                              <Button
                                onClick={async () => {
                                  const desiredLeft = spotsLeftInput[setting.event_id] ?? spotsLeft;
                                  const newReserved = setting.total_spots - confirmedCount - desiredLeft;
                                  if (newReserved < 0) {
                                    toast.error("Invalid: not enough total spots for this value");
                                    return;
                                  }
                                  try {
                                    const response = await supabase.functions.invoke("admin-events", {
                                      body: {
                                        action: "update_reserved_spots",
                                        eventId: setting.event_id,
                                        reservedSpots: newReserved,
                                      },
                                    });
                                    if (response.error) throw response.error;
                                    toast.success(`Spots left set to ${desiredLeft}!`);
                                    fetchData();
                                  } catch (error) {
                                    logger.error("Error updating spots left:", error);
                                    toast.error("Failed to update spots left");
                                  }
                                }}
                                size="sm"
                              >
                                Apply
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-end gap-2">
                            <div className="flex-1">
                              <label className="text-sm text-muted-foreground mb-1 block">
                                Update Total Spots
                              </label>
                              <Input
                                type="number"
                                value={spotsInput[setting.event_id] || ""}
                                onChange={(e) =>
                                  setSpotsInput({
                                    ...spotsInput,
                                    [setting.event_id]: e.target.value,
                                  })
                                }
                                min="0"
                                max="1000"
                              />
                            </div>
                            <Button
                              onClick={() => handleUpdateSpots(setting.event_id)}
                              size="sm"
                            >
                              Save
                            </Button>
                          </div>
                          <div className="flex items-end gap-2 md:col-span-2">
                            <div className="flex-1">
                              <label className="text-sm text-muted-foreground mb-1 block">
                                Update Reserved Spots
                              </label>
                              <Input
                                type="number"
                                value={reservedInput[setting.event_id] || ""}
                                onChange={(e) =>
                                  setReservedInput({
                                    ...reservedInput,
                                    [setting.event_id]: e.target.value,
                                  })
                                }
                                min="0"
                                max="1000"
                              />
                            </div>
                            <Button
                              onClick={() => handleUpdateReserved(setting.event_id)}
                              size="sm"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Review Management</CardTitle>
                  <div className="flex gap-2">
                    <Select value={testimonialFilter} onValueChange={(v) => setTestimonialFilter(v as "all" | "pending" | "approved")}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Reviews</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading...</div>
                  ) : filteredTestimonials.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No reviews found</div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTestimonials.map((t) => (
                        <div key={t.id} className={`border rounded-xl p-4 ${!t.is_approved ? 'border-primary/40 bg-blush/20' : 'border-border'}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-foreground">{t.name}</span>
                                {t.role && <span className="text-sm text-muted-foreground">· {t.role}</span>}
                                {t.location && <span className="text-sm text-muted-foreground">· {t.location}</span>}
                              </div>
                              <div className="flex items-center gap-0.5 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className={`h-4 w-4 ${star <= t.rating ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`} />
                                ))}
                              </div>
                              <p className="text-sm text-foreground/80 italic">"{t.quote}"</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                Submitted {new Date(t.created_at).toLocaleDateString()} · {t.is_approved ? (
                                  <Badge className="bg-accent text-accent-foreground text-xs">Approved</Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-xs">Pending</Badge>
                                )}
                              </p>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              {!t.is_approved ? (
                                <Button size="sm" variant="outline" onClick={() => handleApproveTestimonial(t.id, true)} className="gap-1 text-accent">
                                  <Check className="h-4 w-4" /> Approve
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline" onClick={() => handleApproveTestimonial(t.id, false)} className="gap-1">
                                  <X className="h-4 w-4" /> Unapprove
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteTestimonial(t.id)} className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery">
              <GalleryManager />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default AdminEvents;