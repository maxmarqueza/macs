import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { pageMetadata, site } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Aviso de privacidad",
  description: "Cómo MACS trata los datos personales que compartes en macstech.mx.",
  path: "/privacidad",
});

export default function PrivacidadPage() {
  const mail = (
    <a href={`mailto:${site.email}`} className="underline underline-offset-4">
      {site.email}
    </a>
  );
  return (
    <LegalPage title="Aviso de privacidad" updated="23 de septiembre de 2026">
      <h2>Quién es responsable de tus datos</h2>
      <p>
        MACS, con sitio en macstech.mx, es responsable del tratamiento de los datos personales que nos compartes en
        este sitio. Para cualquier asunto relacionado con este aviso puedes escribirnos a {mail}.
      </p>

      <h2>Qué datos recabamos</h2>
      <p>
        Solo los que tú nos compartes al contactarnos: nombre, empresa, giro, teléfono, correo electrónico y el mensaje
        que nos escribes. En este sitio no recabamos datos personales sensibles.
      </p>

      <h2>Para qué los usamos</h2>
      <ul>
        <li>Responder tu mensaje.</li>
        <li>Agendar y realizar un diagnóstico de tu operación.</li>
        <li>Enviarte una propuesta de servicio.</li>
      </ul>
      <p>No usamos tus datos para otros fines ni los vendemos.</p>

      <h2>Con quién los compartimos</h2>
      <p>
        No compartimos tus datos con terceros, salvo con los proveedores que nos prestan servicios para operar este
        sitio y nuestro correo, que los tratan por cuenta nuestra y con obligaciones de confidencialidad, o cuando una
        autoridad competente lo requiera conforme a la ley.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Puedes acceder a tus datos, rectificarlos, cancelarlos u oponerte a su uso, así como revocar tu
        consentimiento, escribiendo a {mail} con tu nombre, los datos a los que se refiere tu solicitud y lo que pides.
        Te responderemos en los plazos que marca la ley.
      </p>

      <h2>Datos de los clientes de nuestros clientes</h2>
      <p>
        Cuando operamos un Mc para tu negocio, tratamos los datos de tus clientes por cuenta tuya, bajo el contrato de
        tratamiento de datos que firmamos contigo y solo para las finalidades que tú defines.
      </p>

      <h2>Medición de visitas</h2>
      <p>
        Usamos Vercel Web Analytics para contar visitas de forma agregada. No usamos cookies de publicidad ni de
        rastreo.
      </p>

      <h2>Cambios a este aviso</h2>
      <p>Publicaremos cualquier cambio en esta página, con su fecha de actualización.</p>
    </LegalPage>
  );
}
