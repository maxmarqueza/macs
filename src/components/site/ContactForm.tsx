"use client";

import { useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { agents, robots } from "@/data/agents";
import { site } from "@/data/site";
import { solutions } from "@/data/solutions";

/**
 * Formulario de contacto. No hay servidor: al enviar, arma el correo completo y lo
 * abre en la aplicación de correo del visitante, dirigido a `site.email`.
 */

type Defaults = { interest?: string; giro?: string };

const field =
  "w-full rounded-2xl border border-transparent bg-[#F4F4F6] px-5 py-4 text-[16px] text-black outline-none transition-colors placeholder:text-black/35 focus:border-black focus:bg-white";
const label = "mb-2 block text-[14px] font-medium";
const general = ["Diagnóstico", "Agentes IA", "Robots con IA"];

export function ContactFormFields({ defaults }: { defaults: Defaults }) {
  const [sent, setSent] = useState(false);
  const all = [...general, ...agents.map((mc) => mc.name), ...robots.map((mc) => mc.name)];
  const initialInterest = defaults.interest && all.includes(defaults.interest) ? defaults.interest : "Diagnóstico";
  const initialGiro = solutions.find((solution) => solution.slug === defaults.giro)?.name ?? "";

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const lines = [`Nombre: ${value("nombre")}`];
    if (value("empresa")) lines.push(`Empresa: ${value("empresa")}`);
    if (value("giro")) lines.push(`Giro: ${value("giro")}`);
    if (value("telefono")) lines.push(`Teléfono: ${value("telefono")}`);
    lines.push(`Me interesa: ${value("interes")}`, "", value("mensaje"));
    const subject = `${value("interes")}: ${value("nombre")}${value("empresa") ? `, ${value("empresa")}` : ""}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className={label}>
            Nombre
          </label>
          <input id="nombre" name="nombre" required autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="empresa" className={label}>
            Empresa <span className="font-normal text-black/45">(opcional)</span>
          </label>
          <input id="empresa" name="empresa" autoComplete="organization" className={field} />
        </div>
        <div>
          <label htmlFor="giro" className={label}>
            Giro
          </label>
          <select id="giro" name="giro" defaultValue={initialGiro} className={`${field} mc-select`}>
            <option value="">Elige tu giro</option>
            {solutions.map((solution) => (
              <option key={solution.slug} value={solution.name}>
                {solution.name}
              </option>
            ))}
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div>
          <label htmlFor="telefono" className={label}>
            Teléfono o WhatsApp <span className="font-normal text-black/45">(opcional)</span>
          </label>
          <input id="telefono" name="telefono" type="tel" autoComplete="tel" className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="interes" className={label}>
          Me interesa
        </label>
        <select id="interes" name="interes" defaultValue={initialInterest} className={`${field} mc-select`}>
          <optgroup label="General">
            {general.map((item) => (
              <option key={item} value={item}>
                {item === "Diagnóstico" ? "Un diagnóstico de mi negocio" : item}
              </option>
            ))}
          </optgroup>
          <optgroup label="Agentes IA">
            {agents.map((mc) => (
              <option key={mc.slug} value={mc.name}>
                {mc.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Robots con IA">
            {robots.map((mc) => (
              <option key={mc.slug} value={mc.name}>
                {mc.name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>
      <div>
        <label htmlFor="mensaje" className={label}>
          ¿Qué quieres automatizar?
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          rows={5}
          placeholder="Por ejemplo: contestamos WhatsApp a mano y se nos van clientes en la noche."
          className={`${field} resize-y`}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center rounded-full bg-black px-7 py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Enviar por correo
        </button>
        <p className="text-[13px] text-black/50">Se abre tu aplicación de correo con el mensaje listo.</p>
      </div>
      <p role="status" className={`rounded-2xl bg-[#F4F4F6] px-5 py-4 text-[15px] ${sent ? "" : "sr-only"}`}>
        {sent ? (
          <>
            Listo: tu mensaje está en tu aplicación de correo, solo falta enviarlo. Si no se abrió, escríbenos a{" "}
            <a href={`mailto:${site.email}`} className="underline underline-offset-4">
              {site.email}
            </a>
            .
          </>
        ) : null}
      </p>
    </form>
  );
}

/** Lee `?interes=` y `?giro=` para dejar el formulario elegido desde el botón que trajo al visitante. */
export function ContactForm() {
  const params = useSearchParams();
  return (
    <ContactFormFields defaults={{ interest: params.get("interes") ?? undefined, giro: params.get("giro") ?? undefined }} />
  );
}
