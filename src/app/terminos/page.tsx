import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { pageMetadata, site } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Términos de uso",
  description: "Condiciones de uso del sitio macstech.mx.",
  path: "/terminos",
});

export default function TerminosPage() {
  return (
    <LegalPage title="Términos de uso" updated="23 de septiembre de 2026">
      <h2>Sobre este sitio</h2>
      <p>macstech.mx es el sitio de MACS. Al usarlo aceptas estos términos.</p>

      <h2>Información de productos</h2>
      <p>
        Las fichas describen los agentes IA y robots con IA que MACS ofrece o está desarrollando. Los estados «En
        desarrollo» y «Próximamente» indican que un Mc todavía no está disponible para contratación general. Nada en
        este sitio constituye una oferta vinculante: el alcance, los plazos y los precios de cada servicio se acuerdan
        por escrito.
      </p>

      <h2>Ejemplos</h2>
      <p>
        Los días de ejemplo y los casos de uso ilustran cómo se reparten las tareas entre los Mc y tu equipo. No son
        resultados garantizados.
      </p>

      <h2>Propiedad intelectual</h2>
      <p>
        Los textos de este sitio, la marca MACS y los nombres de los Mc pertenecen a MACS. Otros materiales pertenecen a
        sus respectivos titulares. No puedes usarlos con fines comerciales sin permiso por escrito.
      </p>

      <h2>Enlaces</h2>
      <p>Este sitio puede enlazar a sitios de terceros. No somos responsables de su contenido.</p>

      <h2>Responsabilidad</h2>
      <p>
        Procuramos que la información esté completa y al día, pero puede cambiar sin previo aviso. MACS no es
        responsable por decisiones tomadas solo con base en el contenido de este sitio.
      </p>

      <h2>Ley aplicable</h2>
      <p>Estos términos se rigen por las leyes de los Estados Unidos Mexicanos.</p>

      <h2>Contacto</h2>
      <p>
        Para cualquier duda sobre estos términos escríbenos a{" "}
        <a href={`mailto:${site.email}`} className="underline underline-offset-4">
          {site.email}
        </a>
        .
      </p>
    </LegalPage>
  );
}
