import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Users, Settings, Download, LogOut, Loader2 } from "lucide-react";
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
  updated_at: string;
}

const AdminEvents = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAdminAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [eventSettings, setEventSettings] = useState<EventSetting[]>([]);
  const [selectedEventFilter, setSelectedEventFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [spotsInput, setSpotsInput] = useState<Record<number, string>>({});

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
      settingsResponse.data.settings?.forEach((s: EventSetting) => {
        inputValues[s.event_id] = s.total_spots.toString();
      });
      setSpotsInput(inputValues);
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

  const getConfirmedCount = (eventId: number) => {
    return registrations.filter(
      (r) => r.event_id === eventId && r.payment_confirmed
    ).length;
  };

  const getSpotsLeft = (eventId: number) => {
    const setting = eventSettings.find((s) => s.event_id === eventId);
    const total = setting?.total_spots || 0;
    const confirmed = getConfirmedCount(eventId);
    return total - confirmed;
  };

  const exportToCSV = () => {
    const headers = ["First Name", "Last Name", "Email", "Cellphone", "Event ID", "Payment Confirmed", "Registered At", "Confirmed At"];
    const rows = registrations.map((r) => [
      r.first_name,
      r.last_name,
      r.email,
      r.cellphone,
      r.event_id,
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

          <Tabs defaultValue="registrations" className="space-y-6">
            <TabsList>
              <TabsTrigger value="registrations" className="gap-2">
                <Users className="h-4 w-4" />
                Registrations
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Event Settings
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
                        <div className="grid md:grid-cols-4 gap-6">
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
                              Spots Left
                            </p>
                            <p className={`text-2xl font-semibold ${spotsLeft <= 5 ? "text-destructive" : "text-foreground"}`}>
                              {spotsLeft}
                            </p>
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
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default AdminEvents;