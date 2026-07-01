"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

// ============================================================
// DEDCO — PhoneInput
// Indicateur pays préfixé + formatage automatique
// Les numéros africains vont par paires : XX XX XX XX
// ============================================================

const COUNTRY_CODES = [
  { code: "+229", flag: "🇧🇯", name: "Bénin", length: 10, format: "XX XX XX XX XX" },
  { code: "+223", flag: "🇲🇱", name: "Mali", length: 8, format: "XX XX XX XX" },
  { code: "+225", flag: "🇨🇮", name: "Côte d'Ivoire", length: 10, format: "XX XX XX XX XX" },
  { code: "+226", flag: "🇧🇫", name: "Burkina Faso", length: 8, format: "XX XX XX XX" },
  { code: "+227", flag: "🇳🇪", name: "Niger", length: 8, format: "XX XX XX XX" },
  { code: "+228", flag: "🇹🇬", name: "Togo", length: 8, format: "XX XX XX XX" },
  { code: "+237", flag: "🇨🇲", name: "Cameroun", length: 9, format: "XXX XX XX XX" },
  { code: "+233", flag: "🇬🇭", name: "Ghana", length: 9, format: "XXX XXX XXX" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria", length: 10, format: "XXX XXX XXXX" },
  { code: "+221", flag: "🇸🇳", name: "Sénégal", length: 9, format: "XX XX XX XX X" },
  { code: "+33", flag: "🇫🇷", name: "France", length: 9, format: "X XX XX XX XX" },
];

const DEFAULT_COUNTRY = COUNTRY_CODES[0]; // Bénin +229

/**
 * Formate un numéro en groupant les chiffres par 2.
 * Ex: "0197452310" → "01 97 45 23 10"
 */
function formatPhone(digits: string, format: string): string {
  let result = "";
  let digitIdx = 0;

  for (let i = 0; i < format.length; i++) {
    if (digitIdx >= digits.length) break;
    if (format[i] === "X") {
      result += digits[digitIdx];
      digitIdx++;
    } else {
      result += format[i];
    }
  }
  return result;
}

/**
 * Extrait uniquement les chiffres d'une string.
 */
function extractDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function PhoneInput({
  value = "",
  onChange,
  placeholder = "01 97 45 23 10",
  className = "",
  id,
  required = false,
}: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  required?: boolean;
}) {
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialise la valeur si elle contient déjà un indicateur
  useEffect(() => {
    if (value && value.startsWith("+")) {
      const match = COUNTRY_CODES.find(c => value.startsWith(c.code));
      if (match) {
        setCountry(match);
        const digits = extractDigits(value.slice(match.code.length));
        setInputValue(formatPhone(digits, match.format));
      }
    } else if (value) {
      const digits = extractDigits(value);
      setInputValue(formatPhone(digits, DEFAULT_COUNTRY.format));
    }
  }, []);

  // Ferme le dropdown au clic extérieur
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const digits = extractDigits(raw).slice(0, country.length);
    const formatted = formatPhone(digits, country.format);
    setInputValue(formatted);

    // Retourne le numéro complet avec indicateur
    const fullNumber = digits.length > 0 ? `${country.code} ${formatted}` : "";
    onChange(fullNumber);
  }

  function selectCountry(c: typeof DEFAULT_COUNTRY) {
    setCountry(c);
    setIsOpen(false);
    // Re-formate la valeur actuelle avec le nouveau pays
    const digits = extractDigits(inputValue).slice(0, c.length);
    const formatted = formatPhone(digits, c.format);
    setInputValue(formatted);
    const fullNumber = digits.length > 0 ? `${c.code} ${formatted}` : "";
    onChange(fullNumber);
  }

  return (
    <div className={`relative flex items-stretch ${className}`}>
      {/* Sélecteur de pays */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="h-full flex items-center gap-1.5 px-3 border border-[var(--border)] rounded-l-md bg-[var(--bg-warm)] text-sm font-medium text-[var(--text-1)] hover:bg-[var(--border-light)] transition-colors whitespace-nowrap"
        >
          <span className="text-base">{country.flag}</span>
          <span className="font-numeric">{country.code}</span>
          <ChevronDown size={14} className="text-[var(--text-3)]" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-[var(--border)] rounded-lg shadow-lg max-h-60 overflow-y-auto dedco-hide-scroll min-w-[220px]">
            {COUNTRY_CODES.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => selectCountry(c)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-[var(--bg-warm)] transition-colors text-left ${
                  c.code === country.code ? "bg-[var(--amber-pale)]" : ""
                }`}
              >
                <span className="text-base">{c.flag}</span>
                <span className="flex-1 text-[var(--text-1)]">{c.name}</span>
                <span className="font-numeric text-[var(--text-3)] text-xs">{c.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input téléphone */}
      <input
        id={id}
        type="tel"
        value={inputValue}
        onChange={handleInput}
        placeholder={placeholder}
        required={required}
        className="flex-1 px-3 py-2.5 text-sm border border-l-0 border-[var(--border)] rounded-r-md bg-white font-numeric focus:outline-none focus:border-[var(--amber)] transition-colors"
        inputMode="numeric"
        autoComplete="tel"
      />
    </div>
  );
}
