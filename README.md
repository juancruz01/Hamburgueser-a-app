🍔 Clay Burger - Web App de Pedidos Real-Time
Clay Burger es una plataforma moderna de comercio electrónico diseñada para una hamburguesería artesanal. El proyecto permite a los clientes personalizar sus pedidos y a los administradores gestionar la cocina en tiempo real.

🚀 Funcionalidades Principales
Menú Dinámico: Gestión de productos (hamburguesas, bebidas, etc.) desde una base de datos centralizada.

Personalización Avanzada: Sistema de Extras (con impacto en el precio final) y Omisión de ingredientes (Sin cebolla, pepinos, etc.).

Checkout Inteligente: Formulario de envío con validación de domicilio, entre calles y método de pago.

Notificación por WhatsApp: Generación automática de un mensaje detallado con Número de Orden (#) único para el cliente.

Panel de Administración (Kitchen Display):

Visualización de pedidos entrantes en tiempo real mediante WebSockets.

Alertas sonoras y visuales para nuevos pedidos.

Botón de Despacho que cambia el estado en la DB y abre una ventana de WhatsApp para notificar al cliente que su pedido está en camino.

Seguridad: Acceso al panel de administración protegido mediante login.

🛠️ Tecnologías Utilizadas
Frontend: Next.js 15 (App Router), React 19, Tailwind CSS.

Backend & DB: Supabase (PostgreSQL + Realtime).

Estado Global: Zustand.

Componentes UI: Vaul (Drawers), Lucide React (Iconos).

Lenguaje: TypeScript con tipado estricto.

## Instalación y Configuración

First, run the development server:

Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/hamburgueseria-app.git
```

Instala las dependencias:

```bash
npm install
```
Configura las variables de entorno en un archivo .env.local:
```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
ADMIN_PASSWORD=tu_clave
```
Inicia el servidor de desarrollo:
```bash
npm run dev
```
