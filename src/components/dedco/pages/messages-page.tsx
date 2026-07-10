"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Send,
  Paperclip,
  ChevronLeft,
  ShieldCheck,
  Circle,
  MessageCircle,
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
      "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&crop=faces&w=400&q=85",
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
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&crop=faces&w=400&q=85",
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
      "https://images.unsplash.com/photo-1509099863731-ef4bff19e808?auto=format&fit=crop&crop=faces&w=400&q=85",
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
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&w=400&q=85",
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
  const goBack = useDedcoStore((s) => s.goBack);
  const route = useDedcoStore((s) => s.route);
  const currentUser = useDedcoStore((s) => s.currentUser);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);

  // ── Détermine la conversation active ──
  // La route peut passer un conversationId comme "order-CMD-XXX", "proj-PA-XXX",
  // ou "artisan-Kofi". On essaie de matcher avec les mocks par ID, puis par nom.
  const activeConvId =
    route.page === "messages" ? route.conversationId : undefined;

  const [selectedConvId, setSelectedConvId] = useState<string | undefined>(
    () => {
      if (!activeConvId) return undefined;
      // 1. Match direct par ID
      const direct = CONVERSATIONS.find((c) => c.id === activeConvId);
      if (direct) return direct.id;
      // 2. Match par nom (si l'ID contient un nom d'artisan/designer)
      const byName = CONVERSATIONS.find((c) =>
        activeConvId.toLowerCase().includes(c.name.toLowerCase().split(" ")[0])
      );
      if (byName) return byName.id;
      // 3. Pas de match — on reste sur la liste
      return undefined;
    }
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filtrer : recherche + exclure soi-même (si connecté)
  const myName = currentUser?.name?.toLowerCase().trim();
  const filteredConvs = conversations.filter((c) => {
    const matchesSearch = c.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const isMe = myName && c.name.toLowerCase().trim() === myName;
    return matchesSearch && !isMe;
  });

  const selectedConv = conversations.find((c) => c.id === selectedConvId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConv?.messages.length]);

  const handleSelectConv = (id: string) => {
    setSelectedConvId(id);
    // Marquer comme lu
    setConversations(prev =>
      prev.map(c => (c.id === id ? { ...c, unread: 0 } : c))
    );
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

  // ── Helper de rôle ──
  const roleLabel = (role: string) =>
    role === "artisan"
      ? "Artisan"
      : role === "designer"
        ? "Designer"
        : role === "admin"
          ? "Support Dedco"
          : "Client";

  return (
    // Conteneur — utilise min-h-[calc(100vh-64px)] pour s'adapter au contexte
    // dashboard (où le parent a déjà une hauteur fixe) ET au contexte public
    // (où il faut calculer la hauteur disponible sous la navbar).
    <div className="flex flex-col bg-[var(--bg-cream)] h-[calc(100vh-64px)] lg:h-[calc(100vh-0px)]">
      {/* ── Barre supérieure avec bouton retour ── */}
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-card)] flex-shrink-0">
        <button
          type="button"
          onClick={goBack}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--bg-warm)] transition-colors text-[var(--text-1)] flex-shrink-0"
          aria-label="Retour"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-lg font-semibold text-[var(--text-1)]">
            Messagerie
          </h1>
          <p className="text-xs text-[var(--text-3)] truncate hidden sm:block">
            Échangez avec vos clients, designers et artisans en toute sécurité.
          </p>
        </div>
      </div>

      {/* ── Layout 2 colonnes (liste + chat) ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* ───── Colonne gauche — Liste des conversations ───── */}
        <div
          className={`w-full lg:w-[360px] xl:w-[400px] border-r border-[var(--border)] flex flex-col bg-[var(--bg-card)] ${
            selectedConvId ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Recherche */}
          <div className="p-4 border-b border-[var(--border)]">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]"
              />
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg bg-[var(--bg-warm)] border border-[var(--border)] focus:outline-none focus:border-[var(--amber)] transition-colors"
              />
            </div>
          </div>

          {/* Liste */}
          <div className="flex-1 overflow-y-auto dedco-scroll">
            {filteredConvs.map((conv) => {
              const active = selectedConvId === conv.id;
              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => handleSelectConv(conv.id)}
                  className={`w-full text-left p-4 flex items-center gap-3 transition-colors border-b border-[var(--border)]/50 hover:bg-[var(--bg-warm)] cursor-pointer ${
                    active ? "bg-[var(--amber-pale)]" : ""
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    {conv.avatar ? (
                      <img
                        src={conv.avatar}
                        alt={conv.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[var(--amber)] flex items-center justify-center text-white font-bold text-lg">
                        {conv.name[0]}
                      </div>
                    )}
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[var(--forest)] border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-semibold text-sm truncate text-[var(--text-1)]">
                        {conv.name}
                      </h3>
                      <span className="text-[11px] text-[var(--text-3)] flex-shrink-0 ml-2">
                        {conv.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[var(--text-2)] truncate flex-1 mr-2">
                        {conv.lastMessage}
                      </p>
                      {conv.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[var(--amber)] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[var(--text-3)] uppercase tracking-wide mt-0.5">
                      {roleLabel(conv.role)}
                    </p>
                  </div>
                </button>
              );
            })}
            {filteredConvs.length === 0 && (
              <div className="p-8 text-center">
                <MessageCircle size={32} className="text-[var(--text-3)] mx-auto mb-2" />
                <p className="text-sm text-[var(--text-2)] font-medium">Aucune conversation</p>
                <p className="text-xs text-[var(--text-3)] mt-1">
                  Essayez un autre terme de recherche.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ───── Colonne droite — Vue conversation ───── */}
        <div
          className={`flex-1 flex flex-col bg-[var(--bg-cream)] min-w-0 ${
            selectedConvId ? "flex" : "hidden lg:flex"
          }`}
        >
          <AnimatePresence mode="wait">
            {selectedConv ? (
              <motion.div
                key={selectedConv.id}
                className="flex flex-col h-full min-h-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {/* Chat Header */}
                <div className="p-3 sm:p-4 border-b border-[var(--border)] bg-[var(--bg-card)] flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--bg-warm)] transition-colors text-[var(--text-1)]"
                    aria-label="Retour à la liste"
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
                      <div className="w-10 h-10 rounded-full bg-[var(--amber)] flex items-center justify-center text-white font-bold">
                        {selectedConv.name[0]}
                      </div>
                    )}
                    {selectedConv.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[var(--forest)] border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-sm text-[var(--text-1)] truncate">
                      {selectedConv.name}
                    </h2>
                    <p className="text-xs flex items-center gap-1">
                      <Circle
                        size={6}
                        fill="currentColor"
                        className={selectedConv.online ? "text-[var(--forest)]" : "text-[var(--text-3)]"}
                      />
                      <span className={selectedConv.online ? "text-[var(--forest)]" : "text-[var(--text-3)]"}>
                        {selectedConv.online ? "En ligne" : "Hors ligne"}
                      </span>
                      <span className="text-[var(--text-3)]">·</span>
                      <span className="text-[var(--text-3)]">{roleLabel(selectedConv.role)}</span>
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 dedco-scroll space-y-3 min-h-0">
                  {selectedConv.messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.12 }}
                    >
                      <div className={`max-w-[80%] sm:max-w-[65%]`}>
                        {msg.image ? (
                          <div className="rounded-xl overflow-hidden shadow-sm mb-1">
                            <img
                              src={msg.image}
                              alt="Photo partagée"
                              className="w-full max-w-[280px] rounded-xl object-cover"
                            />
                          </div>
                        ) : (
                          msg.text && (
                            <div
                              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                                msg.sent
                                  ? "bg-[var(--amber)] text-white rounded-br-md"
                                  : "bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-1)] rounded-bl-md"
                              }`}
                            >
                              {msg.text}
                            </div>
                          )
                        )}
                        <p
                          className={`text-[10px] text-[var(--text-3)] mt-0.5 ${
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

                {/* ── Bannière de sécurité ──
                    Texte clair et explicatif : pourquoi il ne faut pas partager
                    de coordonnées de paiement hors plateforme, et quoi faire
                    en cas de doute. Style discret, lisible, non intrusif. */}
                <div className="px-4 py-2.5 bg-[var(--forest-pale)] border-t border-[var(--forest)]/20 flex items-start gap-2.5">
                  <ShieldCheck size={16} className="text-[var(--forest)] flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-[var(--forest)] font-semibold leading-snug">
                      Échange protégé par Dedco
                    </p>
                    <p className="text-[11px] text-[var(--forest)] leading-snug mt-0.5">
                      Réglez uniquement via le bouton « Payer » de Dedco. Ne
                      partagez jamais de numéro Mobile Money, RIB ou lien de
                      paiement externe dans cette conversation. En cas de doute,
                      signalez le message à notre équipe.
                    </p>
                  </div>
                </div>

                {/* Input */}
                <div className="p-3 sm:p-4 bg-[var(--bg-card)] border-t border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-3)] hover:bg-[var(--bg-warm)] hover:text-[var(--text-1)] transition-colors"
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
                      className="flex-1 px-4 py-2.5 text-sm rounded-full bg-[var(--bg-warm)] border border-[var(--border)] focus:outline-none focus:border-[var(--amber)] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={!messageText.trim()}
                      className="w-10 h-10 rounded-full bg-[var(--amber)] text-white flex items-center justify-center hover:bg-[var(--amber-dark)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
                className="flex-1 flex items-center justify-center p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center max-w-sm">
                  <div className="w-16 h-16 rounded-full bg-[var(--amber-pale)] mx-auto mb-4 flex items-center justify-center">
                    <MessageCircle size={28} className="text-[var(--amber)]" />
                  </div>
                  <p className="font-display font-semibold text-lg mb-2 text-[var(--text-1)]">
                    Vos conversations
                  </p>
                  <p className="text-sm text-[var(--text-3)] leading-relaxed">
                    Sélectionnez une conversation dans la liste pour relire
                    l'historique et envoyer un message. Vos échanges sont
                    sécurisés et confidentiels.
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
