# McCompras

**Tipo:** Agente IA. **Área:** Operación y administración.
**Estado:** En desarrollo (se puede ofrecer como piloto).
**Página:** [macstech.mx/agentes/mccompras](https://macstech.mx/agentes/mccompras)

> Resurtido sin adivinar.

Cruza tus existencias, ventas y pedidos pendientes para proponerte qué pedir, cuánto y a qué proveedor, antes de que algo se agote.

## Qué hace
- Analiza existencias, ventas recientes y pedidos en camino.
- Propone el pedido de cada proveedor según sus tiempos de entrega.
- Alerta faltantes y productos que no se mueven.
- Prepara la orden de compra lista para enviar.

## Se conecta con
- Tu ERP o sistema de inventario
- Hojas de cálculo
- Correo de tus proveedores

## Ideal para
- Distribuidoras
- Refaccionarias
- Tiendas
- Importadores

## Qué medimos
- Productos agotados
- Días de inventario
- Tiempo para armar cada pedido

## Cómo mejora con el tiempo
Compara lo que pidió con lo que realmente se vendió y ajusta sus cálculos para cada producto y cada temporada.

## Preguntas frecuentes
**¿Hace el pedido solo?**
Te lo deja listo para revisar. Solo se envía cuando tú lo apruebas, salvo que definas reglas para hacerlo automático.

**¿Sirve si importo con tiempos de entrega largos?**
Sí. Considera el tiempo de tránsito de cada proveedor para pedir con anticipación.

## Pendiente antes de venderlo
- [ ] Construir la plantilla: flujo en n8n, instrucciones del agente y base de conocimiento.
- [ ] Probarlo en un piloto real y documentar resultados medidos.
- [ ] Definir precio de implementación y mensualidad.
- [ ] Cambiar su estado a `disponible` en `src/data/agents.ts` cuando se venda.

---
Ficha creada el 2026-09-23 a partir de `src/data/agents.ts`, que es la fuente del sitio: si cambia la
oferta, se edita ahí y se actualiza esta ficha.
