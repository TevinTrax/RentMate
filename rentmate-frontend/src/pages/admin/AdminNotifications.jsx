import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Bell,
  Search,
  CheckCircle2,
  Archive,
  Trash2,
  Reply,
  Eye,
  AlertTriangle,
  UserPlus,
  CreditCard,
  Wrench,
  ShieldAlert,
  Filter,
  RefreshCcw,
  Clock3,
  MessageSquare,
  Building2,
  CheckCheck,
  X,
  Mail,
  Inbox,
  Phone,
  CircleAlert,
} from "lucide-react";
import { io } from "socket.io-client";

function AdminNotifications() {
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
    "http://localhost:5000";

  const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL?.replace(/\/$/, "") ||
    "http://localhost:5000";

  const socketRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    total_messages: 0,
    unread_messages: 0,
    read_messages: 0,
    replied_messages: 0,
    archived_messages: 0,
    today_messages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // HELPERS
  // =========================================
  const formatDateTime = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
  };

  const normalizeStats = (raw = {}) => ({
    total_messages: Number(raw?.total_messages || 0),
    unread_messages: Number(raw?.unread_messages || 0),
    read_messages: Number(raw?.read_messages || 0),
    replied_messages: Number(raw?.replied_messages || 0),
    archived_messages: Number(raw?.archived_messages || 0),
    today_messages: Number(raw?.today_messages || 0),
  });

  const normalizeMessage = (msg = {}) => {
    const status = String(msg?.status || "unread").toLowerCase();

    return {
      id: msg?.id ?? msg?.message_id ?? null,
      first_name: msg?.first_name ?? msg?.firstname ?? msg?.firstName ?? "",
      last_name: msg?.last_name ?? msg?.lastname ?? msg?.lastName ?? "",
      email: msg?.email ?? "",
      phone: msg?.phone ?? "",
      subject: msg?.subject ?? "",
      message: msg?.message ?? msg?.content ?? "",
      status,
      is_read:
        typeof msg?.is_read === "boolean"
          ? msg.is_read
          : status !== "unread",
      is_archived:
        typeof msg?.is_archived === "boolean"
          ? msg.is_archived
          : status === "archived",
      admin_reply: msg?.admin_reply ?? msg?.reply ?? "",
      replied_at: msg?.replied_at ?? msg?.repliedAt ?? null,
      replied_by: msg?.replied_by ?? msg?.repliedBy ?? null,
      source_page: msg?.source_page ?? msg?.source ?? "contact_page",
      created_at: msg?.created_at ?? msg?.createdAt ?? msg?.timestamp ?? null,
      updated_at: msg?.updated_at ?? msg?.updatedAt ?? null,
    };
  };

  const normalizeMessagesArray = (payload) => {
    if (!payload) return [];

    if (Array.isArray(payload)) {
      return payload.map(normalizeMessage).filter((m) => m.id);
    }

    if (Array.isArray(payload.data)) {
      return payload.data.map(normalizeMessage).filter((m) => m.id);
    }

    if (Array.isArray(payload.messages)) {
      return payload.messages.map(normalizeMessage).filter((m) => m.id);
    }

    return [];
  };

  const mergeSingleMessage = (incoming) => {
    const normalized = normalizeMessage(incoming);
    if (!normalized.id) return null;
    return normalized;
  };

  const upsertMessage = useCallback((incoming) => {
    const normalized = mergeSingleMessage(incoming);
    if (!normalized?.id) return;

    setMessages((prev) => {
      const exists = prev.some((msg) => String(msg.id) === String(normalized.id));

      const updated = exists
        ? prev.map((msg) =>
            String(msg.id) === String(normalized.id) ? normalized : msg
          )
        : [normalized, ...prev];

      return updated.sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
    });

    setSelectedNotification((prev) =>
      String(prev?.id) === String(normalized.id) ? normalized : prev
    );
  }, []);

  const removeMessageById = useCallback((id) => {
    if (!id) return;

    setMessages((prev) => prev.filter((msg) => String(msg.id) !== String(id)));
    setSelectedNotification((prev) =>
      String(prev?.id) === String(id) ? null : prev
    );
  }, []);

  // =========================================
  // SAFE FETCH HELPER
  // =========================================
  const safeFetchJson = useCallback(async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      });

      const contentType = response.headers.get("content-type") || "";

      let data = null;
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(
          `Expected JSON but got: ${text?.slice(0, 120) || "Unknown response"}`
        );
      }

      if (!response.ok) {
        throw new Error(data?.message || `Request failed (${response.status})`);
      }

      return data;
    } catch (err) {
      console.error("Fetch error:", url, err);
      throw err;
    }
  }, []);

  // =========================================
  // FETCH MESSAGES
  // =========================================
  const fetchMessages = useCallback(
    async (silent = false) => {
      try {
        setError("");
        if (!silent) setLoading(true);
        if (silent) setRefreshing(true);

        const result = await safeFetchJson(`${API_BASE_URL}/api/messages`);

        console.log("📥 /api/messages response:", result);

        const incomingMessages = normalizeMessagesArray(result);

        const sortedMessages = incomingMessages.sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
        );

        setMessages(sortedMessages);

        setSelectedNotification((prev) => {
          if (!prev?.id) return null;
          const updatedSelected = sortedMessages.find(
            (msg) => String(msg.id) === String(prev.id)
          );
          return updatedSelected || null;
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError(error.message || "Failed to load notifications");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [API_BASE_URL, safeFetchJson]
  );

  // =========================================
  // FETCH STATS
  // =========================================
  const fetchStats = useCallback(async () => {
    try {
      const result = await safeFetchJson(
        `${API_BASE_URL}/api/messages/stats/summary`
      );

      console.log("📊 /api/messages/stats/summary response:", result);

      if (result?.data) {
        setStats(normalizeStats(result.data));
      }
    } catch (error) {
      console.error("Error fetching notification stats:", error);
    }
  }, [API_BASE_URL, safeFetchJson]);

  // =========================================
  // INITIAL LOAD
  // =========================================
  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [fetchMessages, fetchStats]);

  // =========================================
  // SOCKET LIVE UPDATES
  // =========================================
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Admin notifications socket connected:", socket.id);
      setSocketConnected(true);
      socket.emit("join_admin_dashboard");
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Admin notifications socket disconnected:", reason);
      setSocketConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      setSocketConnected(false);
    });

    socket.on("new_message", (newMessage) => {
      console.log("📩 new_message received:", newMessage);
      upsertMessage(newMessage);
    });

    socket.on("message_updated", (updatedMessage) => {
      console.log("✏️ message_updated received:", updatedMessage);
      upsertMessage(updatedMessage);
    });

    socket.on("message_deleted", (payload) => {
      console.log("🗑️ message_deleted received:", payload);
      const id = payload?.id ?? payload?.message_id;
      removeMessageById(id);
    });

    socket.on("admin:message:stats", (payload) => {
      console.log("📊 admin:message:stats received:", payload);
      if (payload?.stats) {
        setStats(normalizeStats(payload.stats));
      }
    });

    socket.on("messages_stats_updated", (incomingStats) => {
      console.log("📈 messages_stats_updated received:", incomingStats);
      setStats(normalizeStats(incomingStats));
    });

    socket.on("admin:message:event", (eventPayload) => {
      console.log("🛡️ admin:message:event received:", eventPayload);

      if (eventPayload?.stats) {
        setStats(normalizeStats(eventPayload.stats));
      }

      const event = eventPayload?.event;
      const payload = eventPayload?.payload;

      if (event === "message_created") {
        upsertMessage(payload);
      } else if (
        event === "message_read" ||
        event === "message_replied" ||
        event === "message_archived"
      ) {
        upsertMessage(payload);
      } else if (event === "message_deleted") {
        removeMessageById(payload?.id);
      }
    });

    return () => {
      socket.emit("leave_admin_dashboard");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("new_message");
      socket.off("message_updated");
      socket.off("message_deleted");
      socket.off("admin:message:stats");
      socket.off("messages_stats_updated");
      socket.off("admin:message:event");
      socket.disconnect();
    };
  }, [SOCKET_URL, upsertMessage, removeMessageById]);

  // =========================================
  // FILTERED MESSAGES
  // =========================================
  const filteredMessages = useMemo(() => {
    let filtered = [...messages];

    if (activeFilter === "unread") {
      filtered = filtered.filter((msg) => msg.status === "unread");
    } else if (activeFilter === "read") {
      filtered = filtered.filter((msg) => msg.status === "read");
    } else if (activeFilter === "replied") {
      filtered = filtered.filter((msg) => msg.status === "replied");
    } else if (activeFilter === "archived") {
      filtered = filtered.filter((msg) => msg.status === "archived");
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (msg) =>
          `${msg.first_name || ""} ${msg.last_name || ""}`
            .toLowerCase()
            .includes(q) ||
          (msg.email || "").toLowerCase().includes(q) ||
          (msg.subject || "").toLowerCase().includes(q) ||
          (msg.message || "").toLowerCase().includes(q)
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );
  }, [messages, activeFilter, search]);

  // =========================================
  // OVERVIEW CARDS
  // =========================================
  const overviewCards = [
    {
      title: "All Notifications",
      value: stats.total_messages || messages.length || 0,
      icon: Bell,
      color: "from-slate-600 to-slate-700",
      filter: "all",
    },
    {
      title: "Unread Alerts",
      value: stats.unread_messages || 0,
      icon: AlertTriangle,
      color: "from-amber-500 to-orange-600",
      filter: "unread",
    },
    {
      title: "Reviewed",
      value: stats.read_messages || 0,
      icon: Eye,
      color: "from-blue-500 to-indigo-600",
      filter: "read",
    },
    {
      title: "Responded",
      value: stats.replied_messages || 0,
      icon: Reply,
      color: "from-emerald-500 to-green-600",
      filter: "replied",
    },
  ];

  const getNotificationMeta = (msg) => {
    return {
      title: msg.subject || "New Notification",
      subtitle:
        `${msg.first_name || ""} ${msg.last_name || ""}`.trim() ||
        "Unknown Sender",
      icon: Mail,
      accent:
        msg.status === "unread"
          ? "bg-amber-100 text-amber-700"
          : msg.status === "replied"
          ? "bg-emerald-100 text-emerald-700"
          : msg.status === "archived"
          ? "bg-slate-100 text-slate-700"
          : "bg-blue-100 text-blue-700",
      category: "Support Message",
    };
  };

  // =========================================
  // ACTIONS
  // =========================================
  const markAsRead = async (id) => {
    try {
      const result = await safeFetchJson(`${API_BASE_URL}/api/messages/${id}/read`, {
        method: "PATCH",
      });

      const updated = mergeSingleMessage(result?.data || result);

      if (updated) {
        upsertMessage(updated);
      }

      fetchStats();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      alert(error.message || "Failed to mark notification as read");
    }
  };

  const archiveNotification = async (id) => {
    try {
      const result = await safeFetchJson(
        `${API_BASE_URL}/api/messages/${id}/archive`,
        {
          method: "PATCH",
        }
      );

      const updated = mergeSingleMessage(result?.data || result);

      if (updated) {
        upsertMessage(updated);
      }

      fetchStats();
    } catch (error) {
      console.error("Error archiving notification:", error);
      alert(error.message || "Failed to archive notification");
    }
  };

  const deleteNotification = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );
    if (!confirmDelete) return;

    try {
      await safeFetchJson(`${API_BASE_URL}/api/messages/${id}`, {
        method: "DELETE",
      });

      removeMessageById(id);
      fetchStats();
    } catch (error) {
      console.error("Error deleting notification:", error);
      alert(error.message || "Failed to delete notification");
    }
  };

  const openReplyModal = (notification) => {
    setSelectedNotification(notification);
    setReplyText(notification?.admin_reply || "");
    setReplyModalOpen(true);
  };

  const submitReply = async () => {
    if (!selectedNotification || !replyText.trim()) return;

    try {
      setSubmittingReply(true);

      const result = await safeFetchJson(
        `${API_BASE_URL}/api/messages/${selectedNotification.id}/reply`,
        {
          method: "PATCH",
          body: JSON.stringify({
            admin_reply: replyText.trim(),
            replied_by: null,
          }),
        }
      );

      const updated = mergeSingleMessage(result?.data || result);

      if (updated) {
        upsertMessage(updated);
        setSelectedNotification(updated);
      }

      setReplyModalOpen(false);
      setReplyText("");
      fetchStats();
    } catch (error) {
      console.error("Error replying to notification:", error);
      alert(error.message || "Failed to save reply");
    } finally {
      setSubmittingReply(false);
    }
  };

  const openNotification = async (notification) => {
    setSelectedNotification(notification);

    if (notification.status === "unread") {
      await markAsRead(notification.id);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 px-4 py-6 md:px-6 md:py-8 xl:px-8 xl:py-10">
      <div className="mx-auto max-w-[1700px] space-y-8 pt-12">
        {/* Header */}
        <div className="rounded-[2rem] border border-gray-200 bg-white/85 backdrop-blur-xl shadow-sm p-6 md:p-8 xl:p-10">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 px-4 py-2 text-sm font-semibold border border-emerald-200 mb-5">
                <Bell className="h-4 w-4" />
                Real-Time Admin Notification Center
              </div>

              <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold tracking-tight text-slate-900">
                Notifications & Support Inbox
              </h1>

              <p className="mt-4 max-w-3xl text-slate-600 text-sm md:text-base leading-7">
                Monitor support messages, user activity, and operational alerts
                from one clean and responsive admin command center.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 xl:justify-end">
              <button
                onClick={() => {
                  fetchMessages(true);
                  fetchStats();
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-3.5 text-sm font-semibold shadow-sm transition"
              >
                <RefreshCcw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>

              <div
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold border ${
                  socketConnected
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                <CheckCheck className="h-4 w-4" />
                {socketConnected ? "Live Sync Enabled" : "Live Sync Offline"}
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-6">
          {overviewCards.map((card, index) => {
            const Icon = card.icon;
            const active = activeFilter === card.filter;

            return (
              <button
                key={index}
                onClick={() => setActiveFilter(card.filter)}
                className={`group relative overflow-hidden rounded-[2rem] p-6 text-left border transition-all duration-300 ${
                  active
                    ? "border-emerald-300 bg-white shadow-lg scale-[1.01]"
                    : "border-white/70 bg-white/90 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-[0.06]`}
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>
                    <h3 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
                      {card.value}
                    </h3>
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-3.5 text-slate-700">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-5">
          {[
            { label: "Support", icon: MessageSquare },
            { label: "Approvals", icon: UserPlus },
            { label: "Payments", icon: CreditCard },
            { label: "Maintenance", icon: Wrench },
            { label: "Properties", icon: Building2 },
            { label: "Security", icon: ShieldAlert },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-white/70 bg-white/85 backdrop-blur-xl shadow-sm px-5 py-5 flex items-center gap-4"
              >
                <div className="rounded-2xl bg-emerald-50 text-emerald-700 p-3.5">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-semibold text-slate-700 text-sm md:text-base">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 flex items-start gap-3">
            <CircleAlert className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">
                Failed to load notifications
              </p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Main Layout */}
        <div className="grid grid-cols-1 2xl:grid-cols-[1.25fr_0.9fr] gap-8">
          {/* Left */}
          <div className="rounded-[2rem] border border-gray-200 bg-white/85 backdrop-blur-xl shadow-sm overflow-hidden min-h-[850px]">
            <div className="p-6 md:p-7 xl:p-8 border-b border-slate-100">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Notification Feed
                  </h2>
                  <p className="text-sm text-slate-500 mt-2">
                    Real-time activity requiring admin attention.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search notifications..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full md:w-80 rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select
                      value={activeFilter}
                      onChange={(e) => setActiveFilter(e.target.value)}
                      className="appearance-none rounded-2xl border border-slate-200 bg-white pl-11 pr-10 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">All Notifications</option>
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-h-[950px] overflow-y-auto">
              {loading ? (
                <div className="p-6 md:p-8 space-y-5">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-3xl border border-slate-100 bg-slate-50 p-6"
                    >
                      <div className="h-4 w-40 bg-slate-200 rounded mb-4"></div>
                      <div className="h-3 w-64 bg-slate-200 rounded mb-3"></div>
                      <div className="h-3 w-full bg-slate-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
                    <Inbox className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    No notifications found
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    There are currently no notifications matching this filter.
                  </p>
                </div>
              ) : (
                <div className="p-5 md:p-6 space-y-5">
                  {filteredMessages.map((msg) => {
                    const meta = getNotificationMeta(msg);
                    const Icon = meta.icon;
                    const isActive =
                      String(selectedNotification?.id) === String(msg.id);

                    return (
                      <button
                        key={msg.id}
                        onClick={() => openNotification(msg)}
                        className={`w-full text-left rounded-[1.8rem] border p-6 transition-all duration-300 ${
                          isActive
                            ? "border-emerald-300 bg-emerald-50/60 shadow-md"
                            : msg.status === "unread"
                            ? "border-amber-200 bg-amber-50/60 hover:shadow-md"
                            : "border-slate-100 bg-white hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start gap-4 md:gap-5">
                          <div className={`mt-1 rounded-2xl p-3.5 ${meta.accent}`}>
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-slate-900 truncate text-base md:text-lg">
                                    {meta.title}
                                  </h3>

                                  {msg.status === "unread" && (
                                    <span className="rounded-full bg-amber-100 text-amber-700 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">
                                      New
                                    </span>
                                  )}

                                  <span className="rounded-full bg-slate-100 text-slate-600 px-2.5 py-1 text-[11px] font-semibold">
                                    {meta.category}
                                  </span>
                                </div>

                                <p className="mt-2 text-sm text-slate-600 leading-6">
                                  From{" "}
                                  <span className="font-medium">
                                    {meta.subtitle}
                                  </span>{" "}
                                  • {msg.email || "No email"}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
                                <Clock3 className="h-3.5 w-3.5" />
                                {formatDateTime(msg.created_at)}
                              </div>
                            </div>

                            <p className="mt-4 line-clamp-2 text-sm leading-7 text-slate-600">
                              {msg.message || "No message content."}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="rounded-[2rem] border border-gray-200 bg-white/85 backdrop-blur-xl shadow-sm overflow-hidden min-h-[850px]">
            <div className="p-6 md:p-7 xl:p-8 border-b border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900">
                Notification Detail
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Review and take action from one place.
              </p>
            </div>

            {!selectedNotification ? (
              <div className="p-12 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
                  <Bell className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Select a notification
                </h3>
                <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-7">
                  Choose a notification from the feed to view full details and
                  take admin actions.
                </p>
              </div>
            ) : (
              <div className="p-6 md:p-7 xl:p-8 space-y-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                          selectedNotification.status === "unread"
                            ? "bg-amber-100 text-amber-700"
                            : selectedNotification.status === "replied"
                            ? "bg-emerald-100 text-emerald-700"
                            : selectedNotification.status === "archived"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {selectedNotification.status}
                      </span>

                      <span className="rounded-full bg-slate-100 text-slate-600 px-3 py-1 text-xs font-semibold">
                        Support Message
                      </span>
                    </div>

                    <h3 className="text-2xl xl:text-3xl font-bold text-slate-900 leading-tight">
                      {selectedNotification.subject || "Untitled Notification"}
                    </h3>
                    <p className="mt-3 text-sm text-slate-500">
                      Received on {formatDateTime(selectedNotification.created_at)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Sender
                    </p>
                    <p className="mt-3 font-semibold text-slate-900 text-lg">
                      {selectedNotification.first_name || "Unknown"}{" "}
                      {selectedNotification.last_name || ""}
                    </p>
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {selectedNotification.email || "No email"}
                      </p>
                      {selectedNotification.phone && (
                        <p className="text-sm text-slate-600 flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {selectedNotification.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Source
                    </p>
                    <p className="mt-3 font-semibold text-slate-900 capitalize text-lg">
                      {selectedNotification.source_page || "contact_page"}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Live support notification
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                    User Message
                  </p>
                  <div className="rounded-3xl border border-slate-100 bg-white p-6 leading-8 text-slate-700 whitespace-pre-wrap text-sm md:text-base">
                    {selectedNotification.message || "No message content."}
                  </div>
                </div>

                {selectedNotification.admin_reply && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                      Admin Response
                    </p>
                    <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6 leading-8 text-slate-700 whitespace-pre-wrap text-sm md:text-base">
                      {selectedNotification.admin_reply}
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      Replied on{" "}
                      {selectedNotification.replied_at
                        ? formatDateTime(selectedNotification.replied_at)
                        : "—"}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  {selectedNotification.status === "unread" && (
                    <button
                      onClick={() => markAsRead(selectedNotification.id)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-3.5 text-sm font-semibold transition"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Mark as Read
                    </button>
                  )}

                  <button
                    onClick={() => openReplyModal(selectedNotification)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3.5 text-sm font-semibold transition"
                  >
                    <Reply className="h-4 w-4" />
                    {selectedNotification.admin_reply ? "Edit Reply" : "Reply"}
                  </button>

                  {selectedNotification.status !== "archived" && (
                    <button
                      onClick={() => archiveNotification(selectedNotification.id)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white px-5 py-3.5 text-sm font-semibold transition"
                    >
                      <Archive className="h-4 w-4" />
                      Archive
                    </button>
                  )}

                  <button
                    onClick={() => deleteNotification(selectedNotification.id)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white px-5 py-3.5 text-sm font-semibold transition"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {replyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 md:p-7 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Reply to Notification
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Respond directly to the support message.
                </p>
              </div>

              <button
                onClick={() => {
                  setReplyModalOpen(false);
                  setReplyText("");
                }}
                className="rounded-2xl p-2 hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 md:p-7 space-y-6">
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">
                  To: {selectedNotification?.first_name || "Unknown"}{" "}
                  {selectedNotification?.last_name || ""}
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  {selectedNotification?.email || "No email"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-3">
                  Admin Reply
                </label>
                <textarea
                  rows={8}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm leading-7 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  onClick={() => {
                    setReplyModalOpen(false);
                    setReplyText("");
                  }}
                  className="rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-5 py-3 text-sm font-semibold transition"
                >
                  Cancel
                </button>

                <button
                  onClick={submitReply}
                  disabled={submittingReply || !replyText.trim()}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-3 text-sm font-semibold transition"
                >
                  <Reply className="h-4 w-4" />
                  {submittingReply ? "Sending Reply..." : "Save Reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminNotifications;