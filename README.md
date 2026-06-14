# 🐶 Adopta — Clase 3 (API pública + Supabase)

La app de adopción de la **clase 2** (galería + detalle + formulario), ahora **conectada al mundo**:

- Los perritos se **guardan y leen desde Supabase** (ya no son datos hardcodeados): la galería se recarga al entrar y muestra los cambios.
- En el formulario de **nuevo perrito**, el botón **"Foto aleatoria"** trae una foto real desde la **API pública dog.ceo** (sin API key) usando `HttpClient`.

Es la continuación directa de `adopta-app`: misma estructura (modelo `Perro`, páginas galería/`detalle/:id`/`nuevo`, componente `tarjeta-perro`, `PerrosService`), pero el servicio ahora habla con Supabase y el formulario con una API.

## 1. Instalar y correr

```bash
npm install
ionic serve
```

La API de fotos (dog.ceo) funciona al tiro. Para que la galería/adopciones persistan necesitas configurar Supabase (paso 2).

## 2. Configurar Supabase

1. Crea un proyecto en https://supabase.com
2. Abre el **SQL Editor** y ejecuta:

```sql
create table public.perros (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre text not null,
  tipo text not null default 'Perro',
  raza text not null,
  edad text,
  sexo text,
  tamano text,
  vacunada boolean not null default false,
  descripcion text,
  foto text not null,
  adoptado boolean not null default false
);

alter table public.perros enable row level security;

-- Policies permisivas SOLO para este demo de clase (anon puede leer/crear/actualizar):
create policy "demo select" on public.perros for select using (true);
create policy "demo insert" on public.perros for insert with check (true);
create policy "demo update" on public.perros for update using (true);

-- Algunos perritos de ejemplo para no partir con la galería vacía:
insert into public.perros (nombre, tipo, raza, edad, sexo, tamano, vacunada, descripcion, foto, adoptado) values
  ('Rocky', 'Perro', 'Labrador', '2 años', 'Macho', 'Grande', true,  'Juguetón y muy sociable. Le encanta correr en el parque.', 'https://placedog.net/600/600?id=1', false),
  ('Luna',  'Perro', 'Beagle',   '4 años', 'Hembra', 'Mediano', true, 'Tranquila y cariñosa. Ideal para departamento.',         'https://placedog.net/600/600?id=2', true),
  ('Toby',  'Perro', 'Poodle',   '1 año',  'Macho', 'Pequeño', false, 'Cachorro lleno de energía. Aprende trucos rapidísimo.',   'https://placedog.net/600/600?id=3', false);
```

3. Arriba, dale al botón **Connect** → pestaña **`.env.local`**, y copia el **Project URL** y la **Publishable key** (`sb_publishable_…`); pégalos en `src/environments/environment.ts`. (Ese panel muestra cosas de Next.js: ignóralas, solo necesitas esos dos valores.)

## Nota de seguridad

La **Publishable key** (`sb_publishable_…`) es pública por diseño (vive en el cliente); lo que protege los datos es **RLS**. Aquí las policies son permisivas porque es un demo de clase — en una app real se restringen por usuario autenticado. Nunca uses la **Secret key** (`sb_secret_…`) en el cliente.

---

Proyecto **Ionic Angular standalone** (Angular 20 + Ionic 8). Demo de la **clase 3** de IIP323W · Tecnologías y Aplicaciones Web y Móviles.
