import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { apiGet, apiSend } from "@/lib/api";

export const Route = createFileRoute("/vehicles/$id")({
  component: VehicleDetailPage,
});

interface StoredUser {
  email: string;
  username: string;
  avatar: string;
  role?: "admin" | "user";
}

interface Vehicle {
  id: number;
  name: string;
  prizeTier?: "GRAND" | "MAJOR" | "STANDARD" | "BASIC";
  prizeAmount?: number;
  odds?: string;
  ticketPrice?: number;
  totalTickets?: number;
  ticketsSold?: number;
  drawDate?: string;
  winnerAnnounced?: boolean;
  winnerInfo?: string;
  drawUrl?: string;
  image: string;
  images?: string[];
  galleryImages?: string[];
  specs?: string;
  detailsPackage?: {
    name: string;
    size: number;
    url: string;
  };
  // Legacy vehicle fields (optional for backward compatibility)
  model?: string;
  price?: number;
  mileage?: number;
  tag?: "NEW" | "PREMIUM";
  color?: string;
  vehicle?: string;
  weeklyRepayment?: number;
  make?: string;
  bodyType?: string;
  year?: string;
  condition?: string;
  fuelType?: string;
  cylinders?: string;
  driveType?: string;
  engineType?: string;
  capacityCc?: string;
  power?: string;
  torque?: string;
  releaseDate?: string;
  buildDate?: string;
  complianceDate?: string;
  modelYear?: string;
}

interface ChatMessage {
  from: "user" | "admin";
  body: string;
  at: string;
}

const CURRENT_USER_KEY = "linz-current-user";

function trackActivity(action: string, detail?: string) {
  try {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) ?? "null") as StoredUser | null;
    void apiSend("/api/activity", "POST", {
      action,
      detail: detail ?? "",
      user: currentUser?.email ?? "guest",
    }).catch(console.error);
  } catch (error) {
    console.error(error);
  }
}

function getVehicleImages(vehicle: Vehicle) {
  const images = [...(vehicle.galleryImages ?? []), ...(vehicle.images ?? []), vehicle.image].filter(Boolean);
  return [...new Set(images)];
}

function VehicleDetailPage() {
  const { id } = Route.useParams();
  const vehicleId = Number(id);
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const chatPath = useMemo(
    () => (currentUser ? `/api/chats/${vehicleId}/${encodeURIComponent(currentUser.email)}` : ""),
    [currentUser, vehicleId],
  );

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) ?? "null") as StoredUser | null;
    setCurrentUser(user);
    if (!user) return;

    apiGet<Vehicle>(`/api/vehicles/${vehicleId}`)
      .then((match) => {
        setVehicle(match);
        setSelectedImage(getVehicleImages(match)[0] ?? "");
        trackActivity("vehicle details opened", match.vehicle || match.name || String(vehicleId));
      })
      .catch((error) => {
        console.error(error);
        setVehicle(null);
        setSelectedImage("");
      });
  }, [vehicleId]);

  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!chatPath) return;
    void apiGet<ChatMessage[]>(chatPath).then(setMessages).catch(console.error);

    const url = `/api/chats/${vehicleId}/${encodeURIComponent(currentUser?.email ?? "")}/stream`;
    const es = new EventSource(url);
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data) as { message: ChatMessage } | ChatMessage;
        const msg = (data as any).message ?? data;
        setMessages((prev) => [...prev, msg]);
        
        // Track unread messages from admin
        if (msg.from === "admin" && currentUser) {
          const unreadKey = `unread_messages_${currentUser.email}`;
          const stored = localStorage.getItem(unreadKey);
          const unreadMessages = stored ? JSON.parse(stored) : [];
          
          // Check if this message is already tracked
          const exists = unreadMessages.some((m: any) => 
            m.vehicleId === vehicleId && 
            m.timestamp === msg.at
          );
          
          if (!exists) {
            unreadMessages.push({
              vehicleId,
              vehicleName: vehicle?.name || `Prize #${vehicleId}`,
              message: msg.text,
              timestamp: msg.at
            });
            localStorage.setItem(unreadKey, JSON.stringify(unreadMessages));
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    es.onerror = (error) => {
      console.error("Chat stream error:", error);
    };
    esRef.current = es;

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [chatPath, vehicleId, currentUser, vehicle]);

  // Mark messages as read when viewing the page
  useEffect(() => {
    if (currentUser && vehicleId) {
      const unreadKey = `unread_messages_${currentUser.email}`;
      const stored = localStorage.getItem(unreadKey);
      if (stored) {
        const unreadMessages = JSON.parse(stored);
        const filtered = unreadMessages.filter((m: any) => m.vehicleId !== vehicleId);
        localStorage.setItem(unreadKey, JSON.stringify(filtered));
      }
    }
  }, [currentUser, vehicleId]);

  const gallery = vehicle ? getVehicleImages(vehicle) : [];
  const specs = vehicle
    ? [
        ["Vehicle", vehicle.vehicle || vehicle.name],
        ["Make", vehicle.make],
        ["Model", vehicle.model],
        ["Body Type", vehicle.bodyType],
        ["Year", vehicle.year],
        ["Condition", vehicle.condition],
        ["Fuel Type", vehicle.fuelType],
        ["Cylinders", vehicle.cylinders],
        ["Drive Type", vehicle.driveType],
        ["Engine Type", vehicle.engineType],
        ["Capacity/CC", vehicle.capacityCc],
        ["Power", vehicle.power],
        ["Torque", vehicle.torque],
        ["Release Date", vehicle.releaseDate],
        ["Build Date", vehicle.buildDate],
        ["Compliance Date", vehicle.complianceDate],
        ["Model Year", vehicle.modelYear],
        ["Mileage", vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : undefined],
        ["Color", vehicle.color],
      ].filter(([, value]) => value)
    : [];

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!chatPath) return;
    const form = new FormData(event.currentTarget);
    const body = String(form.get("message") ?? "").trim();
    if (!body) return;
    try {
      const nextMessages = await apiSend<ChatMessage[]>(chatPath, "POST", { from: "user", body });
      setMessages(nextMessages);
      trackActivity("admin chat message", vehicle?.vehicle || vehicle?.name || String(vehicleId));
      event.currentTarget.reset();
    } catch (error) {
      console.error(error);
    }
  };

  if (!currentUser) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#07111f] px-4 text-white">
        <section className="max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#e8a838]">Members Only</div>
          <h1 className="mt-3 font-display text-3xl font-bold">Sign up to view prize details</h1>
          <p className="mt-3 text-white/65">Return to the lottery platform and create an account to inspect this prize.</p>
          <a href="/" className="mt-6 inline-flex rounded-full bg-[#e8a838] px-6 py-3 font-bold text-[#0a1628]">
            Back to prizes
          </a>
        </section>
      </main>
    );
  }

  if (!vehicle) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#07111f] px-4 text-white">
        <section className="max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center">
          <h1 className="font-display text-3xl font-bold">Prize not found</h1>
          <a href="/#inventory" className="mt-6 inline-flex rounded-full bg-[#e8a838] px-6 py-3 font-bold text-[#0a1628]">
            Back to prizes
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-12 text-white sm:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#e8a838]">Lottery Prize Details</div>
            <h1 className="mt-2 font-display text-4xl font-bold">{vehicle.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/65">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1">{vehicle.prizeTier || "STANDARD"}</span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1">{vehicle.odds || "N/A"}</span>
              {vehicle.drawDate && <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1">{new Date(vehicle.drawDate).toLocaleDateString()}</span>}
              {vehicle.winnerAnnounced && <span className="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-green-400">Winner Announced</span>}
            </div>
          </div>
          <a href="/#inventory" className="rounded-full bg-[#e8a838] px-5 py-2 font-bold text-[#0a1628]">
            Back to prizes
          </a>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.65fr_0.85fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="aspect-[16/9] min-h-[500px] overflow-hidden rounded-[1.5rem] bg-white/5 relative group">
              <img src={selectedImage || vehicle.image} alt={vehicle.vehicle || vehicle.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = gallery.indexOf(selectedImage);
                      const prevIndex = currentIndex > 0 ? currentIndex - 1 : gallery.length - 1;
                      setSelectedImage(gallery[prevIndex]);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
                  >
                    <i className="fa-solid fa-chevron-left" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = gallery.indexOf(selectedImage);
                      const nextIndex = currentIndex < gallery.length - 1 ? currentIndex + 1 : 0;
                      setSelectedImage(gallery[nextIndex]);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
                  >
                    <i className="fa-solid fa-chevron-right" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {gallery.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(image)}
                        className={`h-2 rounded-full transition-all ${selectedImage === image ? "w-6 bg-amber" : "w-2 bg-white/50 hover:bg-white"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-white/60">
                  {gallery.length} image{gallery.length !== 1 ? 's' : ''}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = gallery.indexOf(selectedImage);
                      const prevIndex = currentIndex > 0 ? currentIndex - 1 : gallery.length - 1;
                      setSelectedImage(gallery[prevIndex]);
                    }}
                    className="h-8 w-8 rounded-full border border-white/20 bg-white/5 text-white/60 hover:border-amber hover:text-amber transition-colors flex items-center justify-center"
                  >
                    <i className="fa-solid fa-chevron-left text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = gallery.indexOf(selectedImage);
                      const nextIndex = currentIndex < gallery.length - 1 ? currentIndex + 1 : 0;
                      setSelectedImage(gallery[nextIndex]);
                    }}
                    className="h-8 w-8 rounded-full border border-white/20 bg-white/5 text-white/60 hover:border-amber hover:text-amber transition-colors flex items-center justify-center"
                  >
                    <i className="fa-solid fa-chevron-right text-sm" />
                  </button>
                </div>
              </div>
              <div className="grid gap-2 grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square overflow-hidden rounded-xl border-2 transition-all ${selectedImage === image ? "border-amber shadow-lg scale-105" : "border-white/10 hover:border-white/30"}`}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-white/45">Prize Amount</div>
                <div className="mt-2 font-display text-4xl font-bold text-[#e8a838]">$ {vehicle.prizeAmount?.toLocaleString() || '0'}</div>
                {vehicle.ticketPrice && <div className="mt-1 text-white/65">Ticket Price: ${vehicle.ticketPrice}</div>}
              </div>
              <div className={`rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] ${vehicle.prizeTier === "GRAND" ? "text-[#b57e00]" : "text-[#0a1628]"}`}>
                {vehicle.prizeTier || "STANDARD"}
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              {vehicle.drawUrl ? (
                <a
                  href={vehicle.drawUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-full text-sm font-semibold bg-amber text-[#0a1628] hover:bg-amber/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber/30"
                >
                  <i className="fa-solid fa-external-link-alt" />
                  Visit Lottery Site
                </a>
              ) : (
                <div className="w-full py-4 rounded-full text-sm font-semibold bg-white/10 text-white/50 flex items-center justify-center gap-2 border border-white/20">
                  <i className="fa-solid fa-external-link-alt" />
                  Lottery Site Not Configured
                </div>
              )}
              
              {vehicle.detailsPackage ? (
                <button
                  onClick={() => {
                    const downloadUrl = vehicle.detailsPackage?.url;
                    if (downloadUrl) {
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = `${vehicle.name.replace(/\s+/g, '_')}_details.zip`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      
                      if (currentUser) {
                        apiSend("/api/track-download", "POST", {
                          email: currentUser.email,
                          vehicleId: vehicle.id,
                          vehicleName: vehicle.name,
                          timestamp: new Date().toISOString()
                        }).catch(console.error);
                      } else {
                        apiSend("/api/track-anonymous-download", "POST", {
                          vehicleId: vehicle.id,
                          vehicleName: vehicle.name,
                          timestamp: new Date().toISOString()
                        }).catch(console.error);
                      }
                    }
                  }}
                  className="w-full py-4 rounded-full text-sm font-semibold border-2 border-amber text-amber hover:bg-amber hover:text-[#0a1628] transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-download" />
                  Download Details
                </button>
              ) : (
                <div className="w-full py-4 rounded-full text-sm font-semibold border-2 border-white/20 text-white/50 flex items-center justify-center gap-2">
                  <i className="fa-solid fa-download" />
                  Download Not Available
                </div>
              )}
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white/70">
                <div className="flex justify-between mb-2">
                  <span className="text-white/45">Odds:</span>
                  <span className="text-white font-medium">{vehicle.odds || "N/A"}</span>
                </div>
                {vehicle.totalTickets && (
                  <div className="flex justify-between mb-2">
                    <span className="text-white/45">Total Tickets:</span>
                    <span className="text-white font-medium">{vehicle.totalTickets.toLocaleString()}</span>
                  </div>
                )}
                {vehicle.ticketsSold && (
                  <div className="flex justify-between mb-2">
                    <span className="text-white/45">Tickets Sold:</span>
                    <span className="text-white font-medium">{vehicle.ticketsSold.toLocaleString()}</span>
                  </div>
                )}
                {vehicle.drawDate && (
                  <div className="flex justify-between">
                    <span className="text-white/45">Draw Date:</span>
                    <span className="text-white font-medium">{new Date(vehicle.drawDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              {vehicle.specs && (
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white/70">
                  <div className="font-semibold mb-2 text-white">Prize Details</div>
                  {vehicle.specs}
                </div>
              )}
              
              {vehicle.winnerInfo && (
                <div className="rounded-[2rem] border border-green-500/30 bg-green-500/10 p-4 text-sm leading-relaxed text-green-100">
                  <div className="font-semibold mb-2">Winner Information</div>
                  {vehicle.winnerInfo}
                </div>
              )}
            </div>
          </aside>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-amber/20 flex items-center justify-center">
              <i className="fa-solid fa-comments text-amber text-xl" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold">Chat with Administrator</h2>
              <p className="text-white/60 text-sm mt-1">Get instant help with lottery entries, prize details, and purchasing information</p>
            </div>
          </div>

          <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6 min-h-[400px] max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/60">
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-comments text-amber text-2xl" />
                  </div>
                  <p className="text-lg font-medium">Start a conversation</p>
                  <p className="text-sm mt-2">Send a message about lottery entries, prize details, or purchasing information.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={`${message.at}-${index}`} 
                    className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] rounded-2xl px-5 py-4 shadow-sm ${
                      message.from === "user" 
                        ? "bg-amber text-[#0a1628]" 
                        : "bg-white/[0.08] text-white border border-white/10"
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold opacity-70">
                          {message.from === "user" ? currentUser.username : "Linz Admin"}
                        </span>
                        <span className="text-xs opacity-50">
                          {new Date(message.at).toLocaleString([], { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="text-sm leading-relaxed">{message.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="mt-6 flex gap-3">
            <input
              name="message"
              placeholder="Type your message about lottery prizes..."
              className="flex-1 min-h-14 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-white/40 focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
            />
            <button className="rounded-2xl bg-amber px-8 py-4 font-bold text-[#0a1628] hover:bg-amber/90 transition-colors flex items-center gap-2">
              <i className="fa-solid fa-paper-plane" />
              Send
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
