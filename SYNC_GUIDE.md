# 🔄 Guía de Sincronización Cursor.ai ↔ Lovable

## 📋 Descripción

Esta guía te ayudará a configurar y mantener la sincronización bidireccional entre **Cursor.ai** y **Lovable** para el proyecto EduCommunity.

## 🚀 **Configuración Inicial**

### **Paso 1: Crear repositorio en GitHub**

1. Ve a [github.com](https://github.com)
2. Crea un nuevo repositorio llamado `nexus-learn-grow`
3. **NO** inicialices con README (ya tienes archivos)
4. Copia la URL del repositorio

### **Paso 2: Configurar Git en Cursor.ai**

```bash
# En Cursor.ai, en la terminal del proyecto
git remote add origin https://github.com/TU_USUARIO/nexus-learn-grow.git
git branch -M main
git push -u origin main
```

### **Paso 3: Conectar con Lovable**

1. Ve a [lovable.dev](https://lovable.dev)
2. Crea un nuevo proyecto
3. Selecciona "Connect to GitHub"
4. Busca tu repositorio `nexus-learn-grow`
5. Conecta el repositorio

## 🔄 **Flujo de Trabajo**

### **Opción A: Desarrollo en Cursor.ai → Lovable**

```bash
# 1. Desarrolla en Cursor.ai
# 2. Usa el script de sincronización
.\scripts\sync.ps1 push

# O manualmente:
git add .
git commit -m "Update: [descripción de cambios]"
git push origin main
```

**Resultado**: Lovable detectará automáticamente los cambios y hará deploy.

### **Opción B: Desarrollo en Lovable → Cursor.ai**

```bash
# 1. Desarrolla en Lovable
# 2. Lovable auto-commit a GitHub
# 3. En Cursor.ai, obtén los cambios:
.\scripts\sync.ps1 pull

# O manualmente:
git pull origin main
```

## 🛠️ **Scripts de Sincronización**

### **Windows (PowerShell)**
```powershell
# Verificar estado
.\scripts\sync.ps1 status

# Hacer push (Cursor.ai → Lovable)
.\scripts\sync.ps1 push

# Hacer pull (Lovable → Cursor.ai)
.\scripts\sync.ps1 pull

# Verificar configuración
.\scripts\sync.ps1 setup
```

### **Linux/Mac (Bash)**
```bash
# Dar permisos de ejecución
chmod +x scripts/sync.sh

# Verificar estado
./scripts/sync.sh status

# Hacer push (Cursor.ai → Lovable)
./scripts/sync.sh push

# Hacer pull (Lovable → Cursor.ai)
./scripts/sync.sh pull

# Verificar configuración
./scripts/sync.sh setup
```

## 📁 **Estructura de Archivos de Sincronización**

```
nexus-learn-grow/
├── scripts/
│   ├── sync.ps1          # Script PowerShell para Windows
│   └── sync.sh           # Script Bash para Linux/Mac
├── lovable.config.json   # Configuración específica de Lovable
├── .gitignore           # Archivos a ignorar en Git
└── SYNC_GUIDE.md       # Esta guía
```

## ⚙️ **Configuración de Lovable**

### **Variables de Entorno**
En Lovable, configura estas variables:
```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

### **Build Settings**
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### **Auto-deploy**
- Activa "Auto-deploy on push"
- Configura webhooks para notificaciones

## 🔧 **Solución de Problemas**

### **Error: "No hay remote 'origin' configurado"**
```bash
git remote add origin https://github.com/TU_USUARIO/nexus-learn-grow.git
```

### **Error: "No estás en la rama main"**
```bash
git checkout main
```

### **Conflictos de merge**
```bash
# Ver conflictos
git status

# Resolver conflictos manualmente
# Luego:
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

### **Cambios perdidos**
```bash
# Ver stash guardado
git stash list

# Aplicar stash
git stash pop

# O ver cambios específicos
git stash show -p
```

## 📊 **Comandos Útiles**

### **Ver estado actual**
```bash
git status
git log --oneline -5
git remote -v
```

### **Ver diferencias**
```bash
# Ver cambios sin commitear
git diff

# Ver cambios en staging
git diff --cached

# Ver diferencias con remote
git diff origin/main
```

### **Limpiar repositorio**
```bash
# Descartar cambios locales
git checkout .

# Limpiar archivos no trackeados
git clean -fd

# Reset a último commit
git reset --hard HEAD
```

## 🎯 **Mejores Prácticas**

### **Commits Semánticos**
```bash
git commit -m "feat: add new dashboard component"
git commit -m "fix: resolve authentication issue"
git commit -m "docs: update README with sync guide"
git commit -m "style: update color scheme"
```

### **Branches para Features**
```bash
# Crear rama para feature
git checkout -b feature/nueva-funcionalidad

# Desarrollar y hacer commit
git add .
git commit -m "feat: implement new functionality"

# Merge a main
git checkout main
git merge feature/nueva-funcionalidad
git push origin main
```

### **Backup antes de cambios grandes**
```bash
# Crear backup
git stash push -m "backup before major changes"

# Restaurar si es necesario
git stash pop
```

## 🔄 **Flujo de Desarrollo Recomendado**

### **Para desarrollo diario:**
1. **Desarrolla en Cursor.ai**
2. **Test local**: `npm run dev`
3. **Commit y push**: `.\scripts\sync.ps1 push`
4. **Test en Lovable**
5. **Feedback y ajustes**

### **Para features grandes:**
1. **Crea rama**: `git checkout -b feature/nombre`
2. **Desarrolla en Cursor.ai**
3. **Test local**
4. **Push rama**: `git push origin feature/nombre`
5. **Test en Lovable** (configura rama en Lovable)
6. **Merge a main** cuando esté listo

## 📞 **Soporte**

### **Problemas con Git**
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)

### **Problemas con Lovable**
- [Lovable Documentation](https://docs.lovable.dev/)
- [Lovable Support](https://lovable.dev/support)

### **Problemas con Cursor.ai**
- [Cursor Documentation](https://cursor.sh/docs)
- [Cursor Community](https://community.cursor.sh/)

---

**¡Con esta configuración tendrás un flujo de trabajo fluido entre Cursor.ai y Lovable!** 🚀 