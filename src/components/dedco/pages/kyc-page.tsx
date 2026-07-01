"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Check,
  ChevronRight,
  ChevronLeft,
  Camera,
  FileCheck,
  UserCheck,
  Shield,
  AlertCircle,
  Info,
  RefreshCw,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { BackButton } from "../layout";

// ============================================================
// KYC Step types
// ============================================================

type KYCStep = "identity" | "address" | "selfie" | "confirmation";
type DocStatus = "none" | "uploaded" | "verified" | "rejected";

interface UploadedDoc {
  file: File | null;
  preview: string | null;
  status: DocStatus;
}

// ============================================================
// Step definitions
// ============================================================

const STEPS: { key: KYCStep; label: string; number: number }[] = [
  { key: "identity", label: "Identité", number: 1 },
  { key: "address", label: "Adresse", number: 2 },
  { key: "selfie", label: "Selfie", number: 3 },
  { key: "confirmation", label: "Confirmation", number: 4 },
];

// ============================================================
// Animation variants
// ============================================================

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

// ============================================================
// KYC Page
// ============================================================

export function KYCPage() {
  const goBack = useDedcoStore((s) => s.goBack);
  const navigate = useDedcoStore((s) => s.navigate);

  const [currentStep, setCurrentStep] = useState<KYCStep>("identity");
  const [submitted, setSubmitted] = useState(false);

  const [idFront, setIdFront] = useState<UploadedDoc>({
    file: null,
    preview: null,
    status: "none",
  });
  const [idBack, setIdBack] = useState<UploadedDoc>({
    file: null,
    preview: null,
    status: "none",
  });
  const [addressDoc, setAddressDoc] = useState<UploadedDoc>({
    file: null,
    preview: null,
    status: "none",
  });
  const [selfieDoc, setSelfieDoc] = useState<UploadedDoc>({
    file: null,
    preview: null,
    status: "none",
  });

  const stepIndex = STEPS.findIndex((s) => s.key === currentStep);
  const progressPercent = ((stepIndex + 1) / STEPS.length) * 100;

  const allDocsUploaded =
    idFront.status === "uploaded" &&
    idBack.status === "uploaded" &&
    addressDoc.status === "uploaded" &&
    selfieDoc.status === "uploaded";

  const goNext = () => {
    const idx = STEPS.findIndex((s) => s.key === currentStep);
    if (idx < STEPS.length - 1) {
      setCurrentStep(STEPS[idx + 1].key);
    }
  };

  const goPrev = () => {
    const idx = STEPS.findIndex((s) => s.key === currentStep);
    if (idx > 0) {
      setCurrentStep(STEPS[idx - 1].key);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleFileUpload = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<UploadedDoc>>,
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const preview = URL.createObjectURL(file);
      setter({
        file,
        preview,
        status: "uploaded",
      });
    },
    []
  );

  const resetDoc = (setter: React.Dispatch<React.SetStateAction<UploadedDoc>>) => {
    setter({ file: null, preview: null, status: "none" });
  };

  if (submitted) {
    return (
      <div className="dedco-fade-in max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="dedco-card p-8 sm:p-12 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-amber-pale flex items-center justify-center mx-auto mb-5">
            <Shield size={28} className="text-amber" />
          </div>
          <h1 className="display-lg mb-3">Vérification soumise</h1>
          <p className="text-sm text-ink-soft mb-6 max-w-md mx-auto">
            Vos documents ont été soumis avec succès. Notre équipe examinera votre
            dossier dans un délai de 24 à 48 heures. Vous recevrez une notification
            par email.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate({ page: "wallet" })}
              className="dedco-btn dedco-btn-primary"
            >
              Retour au portefeuille
            </button>
            <button
              type="button"
              onClick={goBack}
              className="dedco-btn dedco-btn-ghost"
            >
              Retour
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="dedco-fade-in max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <BackButton onBack={goBack} />

      <motion.div {...fadeUp} transition={{ duration: 0.35 }} className="mb-6">
        <h1 className="display-xl mb-1">Vérification d&apos;identité</h1>
        <p className="text-sm text-ink-soft">
          Complétez les 4 étapes pour vérifier votre compte et débloquer tous les
          fonctionnalités.
        </p>
      </motion.div>

      {/* Progress bar */}
      <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.06 }} className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-ink-mute font-medium">
            Étape {stepIndex + 1} sur {STEPS.length}
          </span>
          <span className="text-xs text-amber font-numeric font-medium">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="h-2 bg-warm rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--amber)" }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        {/* Step indicators */}
        <div className="flex justify-between mt-3">
          {STEPS.map((step, i) => {
            const isCompleted = i < stepIndex;
            const isCurrent = i === stepIndex;
            const statusColor =
              isCompleted
                ? "bg-forest text-white"
                : isCurrent
                  ? "bg-amber text-white"
                  : "bg-warm text-ink-mute";

            return (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${statusColor} transition-colors`}
                >
                  {isCompleted ? <Check size={14} /> : step.number}
                </div>
                <span
                  className={`text-[10px] mt-1 ${
                    isCurrent || isCompleted
                      ? "text-ink font-medium"
                      : "text-ink-mute"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Step content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="dedco-card p-5 sm:p-6 mb-5"
      >
        {currentStep === "identity" && (
          <IdentityStep
            idFront={idFront}
            idBack={idBack}
            onUploadFront={(e) => handleFileUpload(setIdFront, e)}
            onUploadBack={(e) => handleFileUpload(setIdBack, e)}
            onResetFront={() => resetDoc(setIdFront)}
            onResetBack={() => resetDoc(setIdBack)}
          />
        )}
        {currentStep === "address" && (
          <AddressStep
            addressDoc={addressDoc}
            onUpload={(e) => handleFileUpload(setAddressDoc, e)}
            onReset={() => resetDoc(setAddressDoc)}
          />
        )}
        {currentStep === "selfie" && (
          <SelfieStep
            selfieDoc={selfieDoc}
            onUpload={(e) => handleFileUpload(setSelfieDoc, e)}
            onReset={() => resetDoc(setSelfieDoc)}
          />
        )}
        {currentStep === "confirmation" && (
          <ConfirmationStep
            idFront={idFront}
            idBack={idBack}
            addressDoc={addressDoc}
            selfieDoc={selfieDoc}
            onResetFront={() => resetDoc(setIdFront)}
            onResetBack={() => resetDoc(setIdBack)}
            onResetAddress={() => resetDoc(setAddressDoc)}
            onResetSelfie={() => resetDoc(setSelfieDoc)}
          />
        )}
      </motion.div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={stepIndex === 0}
          className="dedco-btn dedco-btn-ghost"
        >
          <ChevronLeft size={16} />
          Précédent
        </button>

        {currentStep === "confirmation" ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allDocsUploaded}
            className="dedco-btn dedco-btn-primary"
          >
            <Shield size={16} />
            Soumettre ma vérification
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={
              (currentStep === "identity" && (idFront.status !== "uploaded" || idBack.status !== "uploaded")) ||
              (currentStep === "address" && addressDoc.status !== "uploaded") ||
              (currentStep === "selfie" && selfieDoc.status !== "uploaded")
            }
            className="dedco-btn dedco-btn-primary"
          >
            Suivant
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Upload Area Component
// ============================================================

function UploadArea({
  label,
  description,
  preview,
  status,
  onUpload,
  onReset,
}: {
  label: string;
  description: string;
  preview: string | null;
  status: DocStatus;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}) {
  const statusBadge =
    status === "uploaded" ? (
      <span className="dedco-badge dedco-badge-forest text-[10px]">
        <Check size={10} /> Téléversé
      </span>
    ) : status === "verified" ? (
      <span className="dedco-badge dedco-badge-forest text-[10px]">
        <Check size={10} /> Vérifié
      </span>
    ) : status === "rejected" ? (
      <span className="dedco-badge dedco-badge-terra text-[10px]">
        <AlertCircle size={10} /> Rejeté
      </span>
    ) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium text-sm">{label}</p>
        {statusBadge}
      </div>

      {status === "uploaded" && preview ? (
        <div className="relative rounded-lg overflow-hidden border border-forest bg-card">
          <img
            src={preview}
            alt={label}
            className="w-full h-40 sm:h-48 object-cover"
          />
          <button
            type="button"
            onClick={onReset}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center hover:bg-card transition-colors text-ink-mute"
            title="Remplacer le fichier"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      ) : (
        <label className="block">
          <div className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed border-border hover:border-amber hover:bg-amber-pale/20 transition-all cursor-pointer min-h-[140px]">
            <div className="w-12 h-12 rounded-full bg-amber-pale flex items-center justify-center mb-3">
              <Upload size={20} className="text-amber" />
            </div>
            <p className="text-sm font-medium mb-1">{description}</p>
            <p className="text-xs text-ink-mute">
              Cliquez pour sélectionner un fichier
            </p>
            <p className="text-[10px] text-ink-mute mt-1">
              JPG, PNG ou PDF · Max 5 Mo
            </p>
          </div>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={onUpload}
            className="sr-only"
          />
        </label>
      )}
    </div>
  );
}

// ============================================================
// Step 1: Identity
// ============================================================

function IdentityStep({
  idFront,
  idBack,
  onUploadFront,
  onUploadBack,
  onResetFront,
  onResetBack,
}: {
  idFront: UploadedDoc;
  idBack: UploadedDoc;
  onUploadFront: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadBack: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetFront: () => void;
  onResetBack: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <UserCheck size={18} className="text-amber" />
        <h2 className="font-display font-bold text-base">Pièce d&apos;identité</h2>
      </div>
      <p className="text-sm text-ink-soft mb-5">
        Téléversez les deux faces de votre carte nationale d&apos;identité (CNI) ou passeport.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UploadArea
          label="Recto (avant)"
          description="Face avec votre photo"
          preview={idFront.preview}
          status={idFront.status}
          onUpload={onUploadFront}
          onReset={onResetFront}
        />
        <UploadArea
          label="Verso (arrière)"
          description="Face avec les informations"
          preview={idBack.preview}
          status={idBack.status}
          onUpload={onUploadBack}
          onReset={onResetBack}
        />
      </div>
    </div>
  );
}

// ============================================================
// Step 2: Address
// ============================================================

function AddressStep({
  addressDoc,
  onUpload,
  onReset,
}: {
  addressDoc: UploadedDoc;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <FileCheck size={18} className="text-amber" />
        <h2 className="font-display font-bold text-base">Justificatif de domicile</h2>
      </div>
      <p className="text-sm text-ink-soft mb-5">
        Téléversez une facture (eau, électricité, internet) ou une quittance de loyer
        de moins de 3 mois.
      </p>
      <UploadArea
        label="Document de domicile"
        description="Facture ou quittance récente"
        preview={addressDoc.preview}
        status={addressDoc.status}
        onUpload={onUpload}
        onReset={onReset}
      />
      <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-amber-pale/50 border border-amber/20">
        <Info size={16} className="text-amber flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-dark">
          Le document doit clairement indiquer votre nom et votre adresse actuelle.
          Les factures de plus de 3 mois ne sont pas acceptées.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// Step 3: Selfie
// ============================================================

function SelfieStep({
  selfieDoc,
  onUpload,
  onReset,
}: {
  selfieDoc: UploadedDoc;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Camera size={18} className="text-amber" />
        <h2 className="font-display font-bold text-base">Selfie avec pièce d&apos;identité</h2>
      </div>
      <p className="text-sm text-ink-soft mb-5">
        Prenez une photo de vous tenant votre pièce d&apos;identité (CNI ou passeport)
        à côté de votre visage, de manière à ce que les deux soient clairement visibles.
      </p>
      <UploadArea
        label="Photo selfie"
        description="Selfie avec votre pièce d'identité"
        preview={selfieDoc.preview}
        status={selfieDoc.status}
        onUpload={onUpload}
        onReset={onReset}
      />
      <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-amber-pale/50 border border-amber/20">
        <Info size={16} className="text-amber flex-shrink-0 mt-0.5" />
        <ul className="text-xs text-amber-dark space-y-1">
          <li>• Bon éclairage, visage bien visible</li>
          <li>• Pièce d&apos;identité tenue à côté de votre visage</li>
          <li>• Pas de lunettes de soleil ni de couvre-chef</li>
          <li>• Photo nette, pas floue</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================
// Step 4: Confirmation
// ============================================================

function ConfirmationStep({
  idFront,
  idBack,
  addressDoc,
  selfieDoc,
  onResetFront,
  onResetBack,
  onResetAddress,
  onResetSelfie,
}: {
  idFront: UploadedDoc;
  idBack: UploadedDoc;
  addressDoc: UploadedDoc;
  selfieDoc: UploadedDoc;
  onResetFront: () => void;
  onResetBack: () => void;
  onResetAddress: () => void;
  onResetSelfie: () => void;
}) {
  const docs = [
    { label: "Recto CNI", doc: idFront, onReset: onResetFront },
    { label: "Verso CNI", doc: idBack, onReset: onResetBack },
    { label: "Justificatif de domicile", doc: addressDoc, onReset: onResetAddress },
    { label: "Selfie avec ID", doc: selfieDoc, onReset: onResetSelfie },
  ];

  const allDone = docs.every((d) => d.doc.status === "uploaded");

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Shield size={18} className="text-amber" />
        <h2 className="font-display font-bold text-base">Récapitulatif</h2>
      </div>
      <p className="text-sm text-ink-soft mb-5">
        Vérifiez que tous vos documents sont correctement téléversés avant de soumettre.
      </p>

      <div className="space-y-3">
        {docs.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 p-3 rounded-lg border ${
              item.doc.status === "uploaded"
                ? "border-forest bg-forest-pale/30"
                : "border-border bg-warm"
            }`}
          >
            {item.doc.status === "uploaded" && item.doc.preview ? (
              <img
                src={item.doc.preview}
                alt={item.label}
                className="w-12 h-12 rounded-md object-cover border border-forest"
              />
            ) : (
              <div className="w-12 h-12 rounded-md bg-warm flex items-center justify-center border border-border">
                <FileCheck size={18} className="text-ink-mute" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{item.label}</p>
              {item.doc.status === "uploaded" ? (
                <p className="text-xs text-forest flex items-center gap-1">
                  <Check size={10} /> Document téléversé
                </p>
              ) : (
                <p className="text-xs text-terracotta flex items-center gap-1">
                  <AlertCircle size={10} /> Document manquant
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={item.onReset}
              className="text-xs text-ink-mute hover:text-amber transition-colors"
            >
              Modifier
            </button>
          </div>
        ))}
      </div>

      {!allDone && (
        <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-terracotta-pale border border-terracotta/20">
          <AlertCircle size={16} className="text-terracotta flex-shrink-0" />
          <p className="text-xs text-terracotta">
            Tous les documents doivent être téléversés pour soumettre votre
            vérification.
          </p>
        </div>
      )}

      {allDone && (
        <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-forest-pale border border-forest/20">
          <Check size={16} className="text-forest flex-shrink-0" />
          <p className="text-xs text-forest">
            Tous les documents sont prêts. Vous pouvez soumettre votre vérification.
          </p>
        </div>
      )}
    </div>
  );
}
