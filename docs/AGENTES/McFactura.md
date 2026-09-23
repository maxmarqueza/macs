# McFactura

**Tipo:** Agente IA. **Área:** Operación y administración.
**Estado:** En desarrollo (se puede ofrecer como piloto).
**Página:** [macstech.mx/agentes/mcfactura](https://macstech.mx/agentes/mcfactura)

> Facturas CFDI sin capturar nada.

Genera y envía facturas CFDI 4.0 a partir de tus ventas o pedidos, y le pide al cliente sus datos fiscales por WhatsApp cuando faltan.

## Qué hace
- Pide y valida los datos fiscales del cliente: RFC, régimen, código postal y uso del CFDI.
- Emite la factura con tu proveedor de timbrado y la envía por correo o WhatsApp.
- Genera complementos de pago y notas de crédito.
- Te avisa de rechazos o datos incorrectos antes de que se vuelvan un problema.

## Se conecta con
- Tu proveedor de timbrado
- Tu punto de venta
- Tu tienda en línea
- WhatsApp Business y correo

## Ideal para
- Comercios
- Restaurantes
- Distribuidoras
- Profesionistas independientes

## Qué medimos
- Facturas emitidas
- Tiempo entre la venta y la factura
- Facturas corregidas o canceladas

## Cómo mejora con el tiempo
Recuerda los datos fiscales de cada cliente y aprende de cada rechazo, para que la siguiente factura salga bien a la primera.

## Preguntas frecuentes
**¿Sustituye a mi contador?**
No. Automatiza la emisión y el envío; tu contador sigue revisando tu contabilidad y presentando tus declaraciones.

**¿Qué necesito para usarlo?**
Tu certificado de sello digital y una cuenta con un proveedor de timbrado. Te ayudamos a configurarlo.

## Pendiente antes de venderlo
- [ ] Construir la plantilla: flujo en n8n, instrucciones del agente y base de conocimiento.
- [ ] Probarlo en un piloto real y documentar resultados medidos.
- [ ] Definir precio de implementación y mensualidad.
- [ ] Cambiar su estado a `disponible` en `src/data/agents.ts` cuando se venda.

---
Ficha creada el 2026-09-23 a partir de `src/data/agents.ts`, que es la fuente del sitio: si cambia la
oferta, se edita ahí y se actualiza esta ficha.
