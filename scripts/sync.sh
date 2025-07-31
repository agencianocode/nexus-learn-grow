#!/bin/bash

# Script de sincronización automática para EduCommunity
# Uso: ./scripts/sync.sh [push|pull|status]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log() {
    echo -e "${GREEN}[SYNC]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Función para verificar el estado de Git
check_git_status() {
    if ! git status --porcelain | grep -q .; then
        log "No hay cambios pendientes"
        return 0
    else
        warning "Hay cambios sin commitear:"
        git status --short
        return 1
    fi
}

# Función para hacer push a GitHub
push_to_github() {
    log "Iniciando push a GitHub..."
    
    # Verificar si hay cambios
    if check_git_status; then
        info "No hay cambios para hacer push"
        return 0
    fi
    
    # Agregar todos los cambios
    git add .
    
    # Crear commit con timestamp
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    git commit -m "Update: $TIMESTAMP - $(git diff --cached --name-only | head -3 | tr '\n' ' ')"
    
    # Push a main
    if git push origin main; then
        log "✅ Push exitoso a GitHub"
        log "Lovable detectará los cambios automáticamente"
    else
        error "❌ Error al hacer push"
        return 1
    fi
}

# Función para hacer pull desde GitHub
pull_from_github() {
    log "Iniciando pull desde GitHub..."
    
    # Guardar cambios locales si existen
    if ! check_git_status; then
        warning "Hay cambios locales. Guardando en stash..."
        git stash push -m "Auto-stash antes de pull - $(date)"
    fi
    
    # Pull desde main
    if git pull origin main; then
        log "✅ Pull exitoso desde GitHub"
        
        # Aplicar stash si existe
        if git stash list | grep -q "Auto-stash"; then
            warning "Aplicando cambios guardados..."
            git stash pop
        fi
    else
        error "❌ Error al hacer pull"
        return 1
    fi
}

# Función para mostrar estado
show_status() {
    log "Estado actual del repositorio:"
    echo ""
    
    # Estado de Git
    info "Git Status:"
    git status --short
    echo ""
    
    # Últimos commits
    info "Últimos commits:"
    git log --oneline -5
    echo ""
    
    # Rama actual
    info "Rama actual: $(git branch --show-current)"
    
    # Remotes
    info "Remotes configurados:"
    git remote -v
    echo ""
    
    # Verificar si hay cambios sin commitear
    if ! check_git_status; then
        warning "Hay cambios pendientes de commit"
    else
        log "Repositorio limpio"
    fi
}

# Función para verificar configuración
check_setup() {
    log "Verificando configuración..."
    
    # Verificar que Git está inicializado
    if [ ! -d ".git" ]; then
        error "Git no está inicializado. Ejecuta 'git init' primero."
        return 1
    fi
    
    # Verificar que hay un remote configurado
    if ! git remote get-url origin > /dev/null 2>&1; then
        error "No hay remote 'origin' configurado."
        error "Ejecuta: git remote add origin https://github.com/TU_USUARIO/nexus-learn-grow.git"
        return 1
    fi
    
    # Verificar que estamos en la rama main
    if [ "$(git branch --show-current)" != "main" ]; then
        warning "No estás en la rama main. Cambiando a main..."
        git checkout main
    fi
    
    log "✅ Configuración correcta"
}

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos disponibles:"
    echo "  push     - Hacer push a GitHub (Cursor.ai → Lovable)"
    echo "  pull     - Hacer pull desde GitHub (Lovable → Cursor.ai)"
    echo "  status   - Mostrar estado actual del repositorio"
    echo "  setup    - Verificar configuración"
    echo "  help     - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 push     # Sincronizar cambios a Lovable"
    echo "  $0 pull     # Obtener cambios de Lovable"
    echo "  $0 status   # Ver estado actual"
}

# Función principal
main() {
    case "${1:-help}" in
        "push")
            check_setup && push_to_github
            ;;
        "pull")
            check_setup && pull_from_github
            ;;
        "status")
            show_status
            ;;
        "setup")
            check_setup
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Ejecutar función principal
main "$@" 