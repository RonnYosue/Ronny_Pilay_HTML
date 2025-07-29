# 🐾 Veterinaria API (Mockup)

Este es un proyecto API REST mockup para simular un sistema de gestión veterinaria. El objetivo es usar esta API como punto de partida para prácticas relacionadas a **bases de datos distribuidas**, incluyendo:

- Ingeniería inversa del modelo de datos
- Replicación de datos (heterogénea y homogénea)
- Consultas distribuidas (FDW, dblink, SymmetricDS)
- Seguridad y control de acceso

## 🚀 Requisitos

- Node.js (v18 o superior)
- npm

## 📦 Instalación

```bash
git clone https://github.com/tuusuario/veterinaria-api.git
cd veterinaria-api
docker rm -f veterinaria-api-container
docker build --no-cache -t veterinaria-api . 
docker run -p 3000:3000 --name veterinaria-api-container veterinaria-api

## 📚 Instrucciones para el Examen Final

Este examen tiene como objetivo evaluar tu capacidad para **aplicar conceptos de bases de datos distribuidas** en un escenario realista. A partir del análisis del API mockup del sistema veterinario (incluido en este proyecto), debes ejecutar las siguientes actividades:

### 🎯 Objetivo general

Construir una arquitectura distribuida de base de datos que permita consultar, replicar y gestionar los datos del sistema veterinario de forma segura y eficiente, aplicando:

- Replicación de datos (heterogénea o homogénea)
- Seguridad y control de acceso a nivel de BD
- Fragmentación de datos
- Procesamiento distribuido de consultas (FDW, dblink, etc.)

---

### 📝 Actividades obligatorias

1. **Ingeniería inversa**  
   Analiza la API y deduce:
   - Entidades y relaciones
   - Tipos de datos
   - Claves primarias y foráneas
   - Restricciones relevantes (UNIQUE, NOT NULL, etc.)

2. **Modelo distribuido**
   - Crea al menos **2 bases de datos físicas diferentes** (pueden estar en PostgreSQL, MySQL, etc.)
   - Distribuye las entidades deducidas entre ellas aplicando un enfoque de **fragmentación horizontal o vertical**
   - Aplica replicación heterogénea o lógica donde sea necesario (puedes usar SymmetricDS, FDW o dblink)

3. **Consulta distribuida**
   - Implementa una **consulta distribuida funcional** (por ejemplo: tratamientos de una mascota, donde `mascotas` esté en una BD y `tratamientos` en otra).
   - Utiliza PostgreSQL FDW, dblink o cualquier método demostrado en clase.

4. **Seguridad**
   - Restringe el acceso a las bases de datos permitiendo solo conexiones desde las ips autorizados.
   - Implementa al menos 2 roles de usuario con distintos privilegios (ej. `admin`, `consulta`).

---

### ⚙️ Requisitos técnicos

- Puedes trabajar usando **Docker Compose** para simular nodos.
- Las BDs pueden ser PostgreSQL, MySQL o ambas (según diseño).
- No se debe modificar el API original. Solo se usa como base de análisis.
- La consulta distribuida debe ser demostrada funcional **en vivo durante la revisión**.

---

### ✅ Criterios de evaluación (10 puntos)

| Criterio                                | Puntaje |
|-----------------------------------------|---------|
| Modelo relacional deducido              | 2 pts   |
| Arquitectura distribuida funcional      | 2 pts   |
| Replicación (FDW, dblink o SymmetricDS) | 2 pts   |
| Consulta distribuida operativa          | 2 pts   |
| Seguridad y control de acceso           | 1 pt    |
| Organización y claridad                 | 1 pt    |

---

### 🚫 Restricciones

- No se permite modificar el backend ni crear nuevos endpoints.
- No se evaluará código de frontend ni aplicaciones ajenas a bases de datos.
- **NO uses IA generativa** (ChatGPT, Copilot, etc.) - **SE PENALIZA**

### ✅ Recursos Permitidos
- ✅ Documentación oficial de PostgreSQL, MySQL
- ✅ Apuntes y materiales de clase
- ✅ Ejemplos trabajados durante el curso
- ✅ Tutoriales oficiales de Docker, FDW, dblink
- ❌ **NO se permite** el uso de IA generativa (ChatGPT, Copilot, etc.)

---

### 🧪 Consejo

Realiza pruebas locales antes de la evaluación. Asegúrate de documentar tus pasos, ya que se te puede pedir una explicación de tu arquitectura durante la revisión.

¡Éxito en el examen! 🧠📡🐾