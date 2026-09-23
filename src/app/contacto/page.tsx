import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ContactForm, ContactFormFields } from "@/components/site/ContactForm";
import { PageHero } from "@/components/site/parts";
import { SiteShell } from "@/components/site/SiteShell";
import { pageMetadata, site } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Contacto",
  description: "Cuéntanos qué quieres automatizar en tu negocio y te proponemos por dónde empezar.",
  path: "/contacto",
  ownImage: true,
});

const next = [
  "Te respondemos para entender lo que necesitas.",
  "Hacemos un diagnóstico de tu operación.",
  "Te proponemos por dónde empezar, con plan, fechas y costos.",
];

export default function ContactoPage() {
  return (
    <SiteShell footerCta={false}>
      <PageHero compact title="Contacto" subtitle="Cuéntanos qué quieres automatizar." />

      <div className="mx-auto grid max-w-6xl gap-16 px-6 pb-10 md:px-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20">
        <section aria-label="Formulario de contacto">
          <Suspense fallback={<ContactFormFields defaults={{}} />}>
            <ContactForm />
          </Suspense>
          <p className="mt-6 text-[13px] leading-[1.5] text-black/50">
            Usamos tus datos solo para responderte. Consulta el{" "}
            <Link href="/privacidad" className="underline underline-offset-4 hover:text-black">
              aviso de privacidad
            </Link>
            .
          </p>
        </section>

        <aside className="space-y-12 lg:pt-1">
          <div>
            <h2 className="font-hero-display text-[22px] font-medium tracking-tight">Qué pasa después</h2>
            <ol className="mt-5 space-y-4">
              {next.map((step, index) => (
                <li key={step} className="flex gap-4 text-[16px] leading-[1.5]">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-black text-[12px] font-medium text-white">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="font-hero-display text-[22px] font-medium tracking-tight">Otros canales</h2>
            <ul className="mt-5 space-y-3 text-[16px]">
              <li>
                <span className="block text-[13px] text-black/50">Correo</span>
                <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">
                  {site.email}
                </a>
              </li>
              {site.whatsapp ? (
                <li>
                  <span className="block text-[13px] text-black/50">WhatsApp</span>
                  <a href={`https://wa.me/${site.whatsapp}`} className="underline-offset-4 hover:underline">
                    Escríbenos por WhatsApp
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </aside>
      </div>
    </SiteShell>
  );
}
