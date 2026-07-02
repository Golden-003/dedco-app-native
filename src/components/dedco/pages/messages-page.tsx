"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Send,
  Paperclip,
  ChevronLeft,
  ShieldAlert,
  Circle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDedcoStore } from "@/lib/store";

// ============================================================
// Mock Conversations
// ============================================================

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: ChatMessage[];
}

interface ChatMessage {
  id: string;
  text: string;
  sent: boolean;
  time: string;
  image?: string;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    name: "Kofi Akindélé",
    avatar:
      "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&crop=faces&w=240&q=85",
    role: "artisan",
    lastMessage: "Votre table est prête!",
    time: "14:30",
    unread: 2,
    online: true,
    messages: [
      { id: "m1", text: "Bonjour, la table basse Bénin Wax est en cours de finition.", sent: false, time: "09:15" },
      { id: "m2", text: "Super! C'est pour quand la livraison?", sent: true, time: "09:18" },
      { id: "m3", text: "Nous prévoyons 3 jours. Je vous enverrai des photos demain.", sent: false, time: "09:20" },
      { id: "m4", text: "Parfait, merci Kofi!", sent: true, time: "09:22" },
      { id: "m5", text: "Votre table est prête! Voici une photo.", sent: false, time: "14:28" },
      {
        id: "m6",
        text: "",
        sent: false,
        time: "14:30",
        image: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&w=800&q=85",
      },
    ],
  },
  {
    id: "conv-2",
    name: "Ndèye Sarr",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&crop=faces&w=240&q=85",
    role: "designer",
    lastMessage: "J'ai envoyé la maquette",
    time: "Hier",
    unread: 1,
    online: false,
    messages: [
      { id: "n1", text: "Bonjour Ndèye, avez-vous avancé sur le projet?", sent: true, time: "15:00" },
      { id: "n2", text: "Oui! J'ai finalisé la maquette du salon.", sent: false, time: "16:30" },
      { id: "n3", text: "J'ai envoyé la maquette", sent: false, time: "16:31" },
    ],
  },
  {
    id: "conv-3",
    name: "Amara Dossou",
    avatar:
      "https://images.unsplash.com/photo-1509099863731-ef4bff19e808?auto=format&fit=crop&crop=faces&w=240&q=85",
    role: "artisan",
    lastMessage: "Merci pour la commande",
    time: "Lun",
    unread: 0,
    online: false,
    messages: [
      { id: "a1", text: "Merci pour la commande du fauteuil rotin.", sent: false, time: "10:00" },
      { id: "a2", text: "Merci pour la commande", sent: true, time: "10:05" },
    ],
  },
  {
    id: "conv-4",
    name: "Service Client Dedco",
    avatar: "",
    role: "admin",
    lastMessage: "Votre litige a été traité",
    time: "Ven",
    unread: 0,
    online: false,
    messages: [
      { id: "s1", text: "Bonjour, votre litige LIT-001 a été examiné.", sent: false, time: "08:00" },
      { id: "s2", text: "Votre litige a été traité", sent: false, time: "08:01" },
    ],
  },
  {
    id: "conv-5",
    name: "Chidi Okonkwo",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&w=240&q=85",
    role: "designer",
    lastMessage: "Brief mis à jour",
    time: "12 Jan",
    unread: 0,
    online: false,
    messages: [
      { id: "c1", text: "Le brief pour votre bureau a été mis à jour.", sent: false, time: "14:00" },
      { id: "c2", text: "Brief mis à jour", sent: true, time: "14:05" },
    ],
  },
];

// ============================================================
// MessagesPage
// ============================================================

export function MessagesPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const goBack = useDedcoStore((s) => s.goBack);
  const route = useDedcoStore((s) => s.route);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);

  const activeConvId =
    route.page === "messages" ? route.conversationId : undefined;
  const [selectedConvId, setSelectedConvId] = useState<string | undefined>(
    activeConvId
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConvs = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    c.name !== currentUser?.name // ne pas s'afficher soi-même
  );

  const selectedConv = conversations.find((c) => c.id === selectedConvId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConv?.messages.length]);

  const handleSelectConv = (id: string) => {
    setSelectedConvId(id);
  };

  const handleBack = () => {
    setSelectedConvId(undefined);
  };

  const handleSend = () => {
    if (!messageText.trim()) return;
    if (!selectedConvId) return;
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: messageText.trim(),
      sent: true,
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    };
    
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConvId 
        ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: newMessage.text, time: newMessage.time }
        : conv
    ));
    setMessageText("");
  };

  return (
    <div className="dedco-fade-in h-[calc(100vh-64px)] flex flex-col lg:h-[calc(100vh-64px)]">
      {/* Mobile: Show conversation list or chat */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel — Conversation List */}
        <div
          className={`w-full lg:w-[400px] xl:w-[420px] border-r border-border flex flex-col bg-card ${
            selectedConvId ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-border">
            <button
              onClick={() => goBack()}
              className="flex items-center gap-1 text-sm text-[var(--text-3)] hover:text-[var(--amber)] transition-colors mb-3"
            >
              <ChevronLeft size={16} /> Retour
            </button>
            <h1 className="display-lg mb-3">Messages</h1>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute"
              />
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg bg-[var(--bg-warm)] border border-border focus:outline-none focus:border-amber transition-colors"
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto dedco-scroll">
            {filteredConvs.map((conv) => (
              <motion.button
                key={conv.id}
                type="button"
                onClick={() => handleSelectConv(conv.id)}
                className={`w-full text-left p-4 flex items-center gap-3 transition-colors border-b border-border/50 hover:bg-[var(--bg-warm)] ${
                  selectedConvId === conv.id ? "bg-[var(--amber-pale)]" : ""
                }`}
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="relative flex-shrink-0">
                  {conv.avatar ? (
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-amber flex items-center justify-center text-white font-bold text-lg">
                      {conv.name[0]}
                    </div>
                  )}
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-forest border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-semibold text-sm truncate">
                      {conv.name}
                    </h3>
                    <span className="text-xs text-ink-mute flex-shrink-0 ml-2">
                      {conv.time}
                    </span>
                  </div>
                  <p className="text-xs text-ink-soft truncate">
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {conv.unread}
                  </span>
                )}
              </motion.button>
            ))}
            {filteredConvs.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm text-ink-mute">Aucune conversation trouvée</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel — Chat View */}
        <div
          className={`flex-1 flex flex-col bg-[var(--bg-cream)] ${
            selectedConvId ? "flex" : "hidden lg:flex"
          }`}
        >
          <AnimatePresence mode="wait">
            {selectedConv ? (
              <motion.div
                key={selectedConv.id}
                className="flex flex-col h-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Chat Header */}
                <div className="p-4 border-b border-border bg-card flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-warm transition-colors"
                    aria-label="Retour"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="relative">
                    {selectedConv.avatar ? (
                      <img
                        src={selectedConv.avatar}
                        alt={selectedConv.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber flex items-center justify-center text-white font-bold">
                        {selectedConv.name[0]}
                      </div>
                    )}
                    {selectedConv.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-forest border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm">{selectedConv.name}</h2>
                    <p className="text-xs text-forest flex items-center gap-1">
                      <Circle size={6} fill="currentColor" />
                      {selectedConv.online ? "En ligne" : "Hors ligne"}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 dedco-scroll space-y-3">
                  {selectedConv.messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div
                        className={`max-w-[80%] sm:max-w-[65%] ${
                          msg.sent ? "order-2" : "order-1"
                        }`}
                      >
                        {msg.image ? (
                          <div className="rounded-xl overflow-hidden shadow-md mb-1">
                            <img
                              src={msg.image}
                              alt="Photo partagée"
                              className="w-full max-w-[300px] rounded-xl object-cover"
                            />
                          </div>
                        ) : (
                          msg.text && (
                            <div
                              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                msg.sent
                                  ? "bg-amber text-white rounded-br-md"
                                  : "bg-card border border-border text-ink rounded-bl-md"
                              }`}
                            >
                              {msg.text}
                            </div>
                          )
                        )}
                        <p
                          className={`text-[10px] text-ink-mute mt-0.5 ${
                            msg.sent ? "text-right" : "text-left"
                          }`}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Security Banner */}
                <div className="px-4 py-2 bg-forest-pale/50 flex items-center gap-2">
                  <ShieldAlert size={14} className="text-forest flex-shrink-0" />
                  <p className="text-[11px] text-forest leading-snug">
                    Pour votre sécurité, ne partagez pas de coordonnées de
                    paiement en dehors de Dedco.
                  </p>
                </div>

                {/* Message Input */}
                <div className="p-4 bg-card border-t border-border">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {/* TODO: upload fichier */}}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-ink-mute hover:bg-warm hover:text-ink transition-colors"
                      aria-label="Joindre un fichier"
                    >
                      <Paperclip size={18} />
                    </button>
                    <input
                      type="text"
                      placeholder="Écrire un message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      className="flex-1 px-4 py-2.5 text-sm rounded-full bg-[var(--bg-warm)] border border-border focus:outline-none focus:border-amber transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={!messageText.trim()}
                      className="w-10 h-10 rounded-full bg-amber text-white flex items-center justify-center hover:bg-amber-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Envoyer"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="flex-1 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-warm mx-auto mb-4 flex items-center justify-center">
                    <Send size={24} className="text-ink-mute" />
                  </div>
                  <p className="font-display font-semibold text-lg mb-1">
                    Sélectionnez une conversation
                  </p>
                  <p className="text-sm text-ink-mute">
                    Choisissez une conversation dans la liste pour commencer à
                    discuter
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
