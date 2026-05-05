# 🏆 Skorify

**Skorify** es una plataforma de predicciones deportivas pensada para grupos de amigos, compañeros de trabajo o cualquier comunidad que quiera poner a prueba su conocimiento del deporte ⚽🏀🎯. La idea es simple: cada participante hace sus predicciones para los partidos, se comparan los resultados y al final queda claro quién tiene el mejor ojo para el fútbol (u otros deportes).

No hay dinero real de por medio — Skorify es sobre el orgullo 🥇, la competencia amistosa 🤝 y la emoción de seguir los partidos con algo en juego 🔥. Crea tu grupo, invita a tus amigos, haz tus predicciones y sube al tope de la tabla 📊.

---

## ✅ Requisitos previos

- [Node.js](https://nodejs.org/) v22 o superior (Recomendada la versión 24)
- yarn

## 📦 Instalación

Clona el repositorio e instala las dependencias:

```bash
git clone <url-del-repositorio>
cd skorify_frontend
yarn
```

## 🚀 Correr el proyecto en desarrollo

```bash
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## 🛠️ Otros comandos

| Comando      | Descripción                                        |
| ------------ | -------------------------------------------------- |
| `yarn dev`   | ⚡ Inicia el servidor de desarrollo con hot-reload |
| `yarn build` | 🏗️ Genera el build de producción                   |
| `yarn start` | ▶️ Corre el build de producción en local           |
| `yarn lint`  | 🔍 Ejecuta el linter                               |

---

## 🗂️ Arquitectura

El proyecto combina **Screaming Architecture** con **Atomic Design**. La idea es que la estructura de carpetas grite el negocio (predicciones, partidos, grupos...) y que los componentes estén organizados por complejidad creciente.

```
src/
├── app/                        # Routing nativo de Next.js (App Router)
│   ├── layout.tsx              # Layout raíz — ThemeRegistry + NextIntlClientProvider
│   ├── globals.scss            # Estilos base globales
│   └── (rutas)/                # Cada carpeta = una ruta pública
│       └── page.tsx
│
├── features/                   # Módulos de negocio (Screaming Architecture)
│   ├── auth/
│   ├── predictions/
│   ├── matches/
│   ├── leaderboard/
│   └── groups/
│       ├── components/
│       │   ├── atoms/          # Componentes mínimos e indivisibles
│       │   ├── molecules/      # Combinaciones de átomos
│       │   └── organisms/      # Secciones complejas de UI
│       ├── hooks/              # Custom hooks del módulo
│       ├── store/              # Estado local del módulo (Zustand)
│       └── types/              # Tipos TypeScript del módulo
│
├── shared/                     # Componentes reutilizables entre features
│   ├── components/
│   │   ├── atoms/              # Ej: FormField, Button, Badge
│   │   ├── molecules/
│   │   └── organisms/
│   └── layouts/                # Plantillas de página (sidebar, navbar, etc.)
│
├── lib/
│   ├── theme/                  # Tema MUI + ThemeRegistry
│   └── api/                    # Instancia de axios + tipos de respuesta
│
├── i18n/                       # Configuración de next-intl
├── store/                      # Estado global (Zustand)
├── styles/                     # Variables y mixins SCSS globales
└── types/                      # Tipos TypeScript globales
```

---

## 🧭 Routing

Se usa el **App Router nativo de Next.js** (sin prefijo de locale en la URL).

- Cada carpeta dentro de `src/app/` representa una ruta: `app/dashboard/page.tsx` → `/dashboard`
- Los layouts anidados se heredan automáticamente
- Para rutas privadas se usarán Route Groups: `app/(auth)/`, `app/(dashboard)/`

---

## 🌐 Internacionalización (i18n)

Manejada con [next-intl](https://next-intl.dev) **sin routing por URL**. El idioma se determina desde una cookie `locale` (default: `es`).

**Archivos de traducción:**

```
messages/
├── es.json   ← español (idioma por defecto)
└── en.json
```

**Uso en Server Components:**

```tsx
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('predictions');
  return <h1>{t('title')}</h1>;
}
```

**Uso en Client Components:**

```tsx
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('common');
  return <button>{t('save')}</button>;
}
```

Para cambiar el idioma en runtime, actualiza la cookie `locale` con el valor `'es'` o `'en'`.

---

## ⚛️ Atomic Design

Los componentes siguen una jerarquía de complejidad creciente:

| Nivel        | Descripción                                    | Ejemplo                              |
| ------------ | ---------------------------------------------- | ------------------------------------ |
| **Atom**     | Unidad mínima, sin dependencias de negocio     | `FormField`, `Badge`, `Avatar`       |
| **Molecule** | Combinación de átomos con una función concreta | `MatchCard`, `ScoreInput`            |
| **Organism** | Sección completa de UI con lógica propia       | `PredictionForm`, `LeaderboardTable` |
| **Layout**   | Plantilla de página (navbar, sidebar, footer)  | `DashboardLayout`                    |

Los átomos y moléculas compartidos entre features van en `src/shared/components/`.
Los específicos de un módulo van dentro de `src/features/<modulo>/components/`.

---

## 🎨 Estilos

- **MUI Material** como sistema de diseño principal (tema dark personalizado)
- **SCSS** para estilos adicionales — sin colores hardcodeados

Las variables del tema viven en `src/styles/_variables.scss` y están sincronizadas con `src/lib/theme/theme.ts`:

```scss
// En cualquier .module.scss
@use '@/styles/variables' as v;
@use '@/styles/mixins' as m;

.card {
  @include m.surface;
  padding: v.spacing(2);
  color: v.$color-text-primary;

  @include m.md-up {
    padding: v.spacing(3);
  }
}
```

**Mixins disponibles:** `surface`, `flex-center`, `flex-between`, `truncate`, `sm-up`, `md-up`, `lg-up`, `xl-up`

---

## 🗃️ Estado global

Manejado con [Zustand](https://zustand-demo.pmnd.rs/). Cada feature tiene su propio store en `src/features/<modulo>/store/`. El estado global compartido va en `src/store/`.

```ts
import { useAppStore } from '@store/useAppStore';

const { locale, setLocale } = useAppStore();
```

---

## 🔌 Cliente HTTP

Instancia de Axios configurada en `src/lib/api/`. Nunca lanza excepciones — siempre retorna un `ApiResult<T>` tipado:

```ts
import { api } from '@api/index';

const result = await api.get<Prediction[]>('/predictions');

if (result.success) {
  console.log(result.data); // Prediction[]
} else {
  console.error(result.error.message);
}
```

La URL base se configura con la variable de entorno `NEXT_PUBLIC_API_URL`.

---

## 🧱 Stack

| Herramienta                                     | Uso                    |
| ----------------------------------------------- | ---------------------- |
| [Next.js 16](https://nextjs.org/)               | Framework (App Router) |
| [React 19](https://react.dev/)                  | UI                     |
| [TypeScript](https://www.typescriptlang.org/)   | Tipado estático        |
| [MUI Material v7](https://mui.com/)             | Sistema de diseño      |
| [SCSS (Sass)](https://sass-lang.com/)           | Estilos adicionales    |
| [next-intl](https://next-intl.dev/)             | Internacionalización   |
| [Zustand](https://zustand-demo.pmnd.rs/)        | Estado global          |
| [Axios](https://axios-http.com/)                | Cliente HTTP           |
| [React Hook Form](https://react-hook-form.com/) | Formularios            |
