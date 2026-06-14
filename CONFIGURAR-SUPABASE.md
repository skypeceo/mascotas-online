# 🐶 Configurar Supabase — Guía paso a paso (app Adopta)

Para que la app guarde los perritos **de verdad** (y no se pierdan al recargar) necesitamos una base de datos en la nube. La vamos a crear gratis en **Supabase**, armar la tabla y conectar la app. Son ~10 minutos.

> No necesitas tarjeta de crédito. El plan **Free** alcanza de sobra para la clase.

---

## Paso 0 — Entrar a Supabase
Anda a **https://supabase.com** y dale **Sign in** (puedes entrar con tu cuenta de **GitHub** o **Google**).

---

## Paso 1 — Crear una organización (solo si te lo pide)
La primera vez, Supabase te pide una "organización" (es solo una carpeta para tus proyectos).

- Si ves la pantalla **"Your Organizations"** vacía (o un aviso *"Organization not found"*), dale a **New organization**.
- Completa:
  - **Name:** el que quieras (ej. `Mi Org` o tu nombre).
  - **Type:** `Personal`.
  - **Plan:** `Free - $0/month`.
- Dale **Create organization**.

> Si ya tenías una organización, sáltate este paso.

![Pantalla Create a new organization con Name, Type Personal y Plan Free](docs/supabase/01-nueva-organizacion.png)

*Pantalla "Create a new organization".*

---

## Paso 2 — Crear el proyecto
Ya dentro de tu organización, dale al botón verde **+ New project** (arriba a la derecha). Vas a ver la pantalla **"Create a new project"**:

- **Project name:** `adopta-clase3` (o el nombre que quieras).
- **Database password:** dale a **"Generate a password"** para que te cree una segura, y **guárdala** por si acaso.
- **Region:** elige la más cercana → para Chile, **South America (São Paulo)**.
- **Security:** deja las opciones como vienen:
  - ✅ **Enable Data API** (la necesitamos para que `supabase-js` funcione).
  - ✅ **Automatically expose new tables**.
  - ⬜ **Enable automatic RLS** → **déjala desmarcada**: las reglas de seguridad las ponemos nosotros en el SQL del Paso 3.
- Dale **Create new project**.

⏳ El proyecto tarda **~2 minutos** en quedar listo. Espera a que termine.

![Formulario Create a new project con nombre adopta-clase3 y región São Paulo](docs/supabase/02-nuevo-proyecto.png)

*Formulario "Create a new project" listo para crear.*

---

## Paso 3 — Crear la tabla (SQL)
En el menú lateral, anda a **SQL Editor** → **+ New query**. Pega **todo** esto y dale **Run** (o `⌘ + Enter`):

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

-- Reglas abiertas SOLO para este demo (cualquiera puede leer/crear/adoptar):
create policy "demo select" on public.perros for select using (true);
create policy "demo insert" on public.perros for insert with check (true);
create policy "demo update" on public.perros for update using (true);

-- Perritos de ejemplo para no partir con la galería vacía:
insert into public.perros (nombre, tipo, raza, edad, sexo, tamano, vacunada, descripcion, foto, adoptado) values
  ('Rocky', 'Perro', 'Labrador', '2 años', 'Macho', 'Grande', true,  'Juguetón y muy sociable. Le encanta correr en el parque.', 'https://placedog.net/600/600?id=1', false),
  ('Luna',  'Perro', 'Beagle',   '4 años', 'Hembra', 'Mediano', true, 'Tranquila y cariñosa. Ideal para departamento.',         'https://placedog.net/600/600?id=2', true),
  ('Toby',  'Perro', 'Poodle',   '1 año',  'Macho', 'Pequeño', false, 'Cachorro lleno de energía. Aprende trucos rapidísimo.',   'https://placedog.net/600/600?id=3', false);
```

Si todo salió bien, abajo (en **Results**) te va a decir **"Success. No rows returned"**. ✅

![SQL Editor con la tabla perros creada y el mensaje Success. No rows returned](docs/supabase/03-sql-exito.png)

*El SQL corrido: "Success. No rows returned".*

---

## Paso 4 — Copiar las credenciales con el botón **Connect** (camino fácil)
Acá está el truco para no perderse: **no vayas a la página de API Keys**. Usa el botón **Connect**.

![Botón verde Connect arriba, al lado del nombre del proyecto](docs/supabase/04-boton-connect.png)

*El botón **Connect**, arriba a la derecha.*

1. Arriba, al lado del nombre del proyecto, dale al botón verde **🔌 Connect** (atajo: tecla `O` y luego `C`).
2. Se abre el panel **"Connect to your project"**. Baja a la sección **2 · Add files** y elige la pestaña **`.env.local`**.
3. Ahí vas a ver **dos líneas** parecidas a estas:
   ```
   ...SUPABASE_URL=https://abcdxyz.supabase.co
   ...SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxx
   ```
4. **Copia esos dos valores:**
   - la **URL** (`https://….supabase.co`)
   - la **Publishable key** (`sb_publishable_…`)

![Panel Connect to your project, pestaña .env.local con SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY](docs/supabase/05-connect-sheet.png)

*La pestaña `.env.local`: solo copia la **URL** y la **Publishable key** (lo demás es de Next.js, se ignora).*

> 💡 **Tip:** usa el **botón de copiar** 📋 del panel para llevarte la llave **completa** — en pantalla se ve cortada.

> ⚠️ **OJO — lo más importante:** ese panel está pensado para proyectos **Next.js**, así que muestra cosas que **nosotros NO usamos**: ignora el `npm install @supabase/ssr`, el archivo `.env.local`, el `page.tsx` y el `middleware.ts`. **Lo único que nos llevamos son los dos valores** (la URL y la publishable key).

---

## Paso 5 — Pegar las credenciales en la app
Abre el archivo **`src/environments/environment.ts`** y pega tus dos valores:

```ts
export const environment = {
  produccion: false,
  supabaseUrl: "https://abcdxyz.supabase.co",                  // ← tu URL
  supabaseAnonKey: "sb_publishable_xxxxxxxxxxxxxxxx",          // ← tu Publishable key
};
```

> El campo se llama `supabaseAnonKey` por costumbre, pero ahí va tu **publishable key** — funciona igual, es solo el nombre de la variable.

---

## Paso 6 — Probar 🚀
En la terminal, dentro de la carpeta del proyecto:

```bash
npm install
ionic serve
```

Si todo quedó bien:
- La **galería** muestra a **Rocky, Luna y Toby** (Luna sale "Adoptado").
- Con el botón **+** creas un perrito nuevo; prueba el botón **"Foto aleatoria"** (trae la foto desde una API).
- En la **ficha** de un perrito, **Adoptar** lo marca como adoptado; al **volver a la galería** aparece con el badge «Adoptado».

---

## ¿Algo no funciona?
- **La galería sale vacía o tira error** → casi siempre son las credenciales: revisa que la **URL** y la **llave** estén completas y bien pegadas, que sea la **publishable** (`sb_publishable_…`, **no** la `sb_secret_…`), y que hayas corrido el SQL del Paso 3.
- **Aviso de que la llave es "pública"** → es normal y seguro: la publishable key está hecha para vivir en el cliente; lo que protege los datos es **RLS** (acá abierto a propósito para la clase).

> 🔒 **Nunca** uses la **Secret key** (`sb_secret_…`) en la app ni la subas a un repo: esa es la llave de administrador.
