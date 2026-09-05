"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

type Settings = {
  siteName: string;
  logoUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  socialFacebook: string | null;
  socialInstagram: string | null;
  socialTwitter: string | null;
  socialYoutube: string | null;
  gtmId: string | null;
  ga4Id: string | null;
  metaPixelId: string | null;
  smartlookId: string | null;
  customHeadScript: string | null;
  customBodyScript: string | null;
  freeShippingThreshold: number | null;
  standardShippingFee: number;
};

const inputClass =
  "rounded-md border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted focus:border-accent focus:outline-none";
const labelClass = "text-sm font-medium text-foreground";

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </div>
  );
}

export default function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [siteName, setSiteName] = useState(settings.siteName);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl ?? "");
  const [contactEmail, setContactEmail] = useState(settings.contactEmail ?? "");
  const [contactPhone, setContactPhone] = useState(settings.contactPhone ?? "");
  const [address, setAddress] = useState(settings.address ?? "");
  const [socialFacebook, setSocialFacebook] = useState(settings.socialFacebook ?? "");
  const [socialInstagram, setSocialInstagram] = useState(settings.socialInstagram ?? "");
  const [socialTwitter, setSocialTwitter] = useState(settings.socialTwitter ?? "");
  const [socialYoutube, setSocialYoutube] = useState(settings.socialYoutube ?? "");
  const [gtmId, setGtmId] = useState(settings.gtmId ?? "");
  const [ga4Id, setGa4Id] = useState(settings.ga4Id ?? "");
  const [metaPixelId, setMetaPixelId] = useState(settings.metaPixelId ?? "");
  const [smartlookId, setSmartlookId] = useState(settings.smartlookId ?? "");
  const [customHeadScript, setCustomHeadScript] = useState(settings.customHeadScript ?? "");
  const [customBodyScript, setCustomBodyScript] = useState(settings.customBodyScript ?? "");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    settings.freeShippingThreshold?.toString() ?? ""
  );
  const [standardShippingFee, setStandardShippingFee] = useState(
    settings.standardShippingFee.toString()
  );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const payload = {
      siteName,
      logoUrl: logoUrl || null,
      contactEmail: contactEmail || null,
      contactPhone: contactPhone || null,
      address: address || null,
      socialFacebook: socialFacebook || null,
      socialInstagram: socialInstagram || null,
      socialTwitter: socialTwitter || null,
      socialYoutube: socialYoutube || null,
      gtmId: gtmId || null,
      ga4Id: ga4Id || null,
      metaPixelId: metaPixelId || null,
      smartlookId: smartlookId || null,
      customHeadScript: customHeadScript || null,
      customBodyScript: customBodyScript || null,
      freeShippingThreshold: freeShippingThreshold ? Number(freeShippingThreshold) : null,
      standardShippingFee: Number(standardShippingFee),
    };

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      setError("Could not save settings");
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">General</h2>
        <Field label="Site Name" value={siteName} onChange={setSiteName} />
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Logo</label>
          <ImageUploader
            images={logoUrl ? [{ url: logoUrl }] : []}
            onChange={(images) => setLogoUrl(images[images.length - 1]?.url ?? "")}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">Contact</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Contact Email" value={contactEmail} onChange={setContactEmail} />
          <Field label="Contact Phone" value={contactPhone} onChange={setContactPhone} />
        </div>
        <Field label="Address" value={address} onChange={setAddress} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">Social Links</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Facebook" value={socialFacebook} onChange={setSocialFacebook} />
          <Field label="Instagram" value={socialInstagram} onChange={setSocialInstagram} />
          <Field label="Twitter / X" value={socialTwitter} onChange={setSocialTwitter} />
          <Field label="YouTube" value={socialYoutube} onChange={setSocialYoutube} />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">
          Analytics &amp; Tracking
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Google Tag Manager ID"
            value={gtmId}
            onChange={setGtmId}
            placeholder="GTM-XXXXXXX"
          />
          <Field
            label="Google Analytics 4 ID"
            value={ga4Id}
            onChange={setGa4Id}
            placeholder="G-XXXXXXXXXX"
          />
          <Field
            label="Meta Pixel ID"
            value={metaPixelId}
            onChange={setMetaPixelId}
          />
          <Field
            label="Smartlook Project ID"
            value={smartlookId}
            onChange={setSmartlookId}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Custom Head Script</label>
          <textarea
            rows={4}
            value={customHeadScript}
            onChange={(e) => setCustomHeadScript(e.target.value)}
            placeholder="<script>...</script>"
            className={`${inputClass} font-mono text-xs`}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Custom Body Script</label>
          <textarea
            rows={4}
            value={customBodyScript}
            onChange={(e) => setCustomBodyScript(e.target.value)}
            placeholder="<script>...</script>"
            className={`${inputClass} font-mono text-xs`}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">Shipping</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Free Shipping Threshold (₹)"
            value={freeShippingThreshold}
            onChange={setFreeShippingThreshold}
          />
          <Field
            label="Standard Shipping Fee (₹)"
            value={standardShippingFee}
            onChange={setStandardShippingFee}
          />
        </div>
      </section>

      {error && (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}
      {saved && !error && <p className="text-sm text-success">Settings saved.</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-fit rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground transition hover:bg-accent-hover disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}
