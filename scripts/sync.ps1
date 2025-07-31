# Script de sincronización automática para EduCommunity (PowerShell)
# Uso: .\scripts\sync.ps1 [push|pull|status]

param(
    [Parameter(Position=0)]
    [ValidateSet("push", "pull", "status", "setup", "help")]
    [string]$Command = "help"
)

# Colores para output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$White = "White"

# Función para mostrar mensajes
function Write-Log {
    param([string]$Message)
    Write-Host "[SYNC] $Message" -ForegroundColor $Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
}

# Función para verificar el estado de Git
function Test-GitStatus {
    $status = git status --porcelain
    if ([string]::IsNullOrEmpty($status)) {
        Write-Log "No hay cambios pendientes"
        return $true
    } else {
        Write-Warning "Hay cambios sin commitear:"
        git status --short
        return $false
    }
}

# Función para hacer push a GitHub
function Push-ToGitHub {
    Write-Log "Iniciando push a GitHub..."
    
    # Verificar si hay cambios
    if (Test-GitStatus) {
        Write-Info "No hay cambios para hacer push"
        return
    }
    
    # Agregar todos los cambios
    git add .
    
    # Crear commit con timestamp
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $files = git diff --cached --name-only | Select-Object -First 3
    $commitMessage = "Update: $timestamp - $($files -join ' ')"
    git commit -m $commitMessage
    
    # Push a main
    try {
        git push origin main
        Write-Log "✅ Push exitoso a GitHub"
        Write-Log "Lovable detectará los cambios automáticamente"
    } catch {
        Write-Error "❌ Error al hacer push"
        exit 1
    }
}

# Función para hacer pull desde GitHub
function Pull-FromGitHub {
    Write-Log "Iniciando pull desde GitHub..."
    
    # Guardar cambios locales si existen
    if (-not (Test-GitStatus)) {
        Write-Warning "Hay cambios locales. Guardando en stash..."
        $stashMessage = "Auto-stash antes de pull - $(Get-Date)"
        git stash push -m $stashMessage
    }
    
    # Pull desde main
    try {
        git pull origin main
        Write-Log "✅ Pull exitoso desde GitHub"
        
        # Aplicar stash si existe
        $stashList = git stash list
        if ($stashList -match "Auto-stash") {
            Write-Warning "Aplicando cambios guardados..."
            git stash pop
        }
    } catch {
        Write-Error "❌ Error al hacer pull"
        exit 1
    }
}

# Función para mostrar estado
function Show-Status {
    Write-Log "Estado actual del repositorio:"
    Write-Host ""
    
    # Estado de Git
    Write-Info "Git Status:"
    git status --short
    Write-Host ""
    
    # Últimos commits
    Write-Info "Últimos commits:"
    git log --oneline -5
    Write-Host ""
    
    # Rama actual
    $currentBranch = git branch --show-current
    Write-Info "Rama actual: $currentBranch"
    
    # Remotes
    Write-Info "Remotes configurados:"
    git remote -v
    Write-Host ""
    
    # Verificar si hay cambios sin commitear
    if (-not (Test-GitStatus)) {
        Write-Warning "Hay cambios pendientes de commit"
    } else {
        Write-Log "Repositorio limpio"
    }
}

# Función para verificar configuración
function Test-Setup {
    Write-Log "Verificando configuración..."
    
    # Verificar que Git está inicializado
    if (-not (Test-Path ".git")) {
        Write-Error "Git no está inicializado. Ejecuta 'git init' primero."
        return $false
    }
    
    # Verificar que hay un remote configurado
    try {
        $origin = git remote get-url origin
        if ([string]::IsNullOrEmpty($origin)) {
            Write-Error "No hay remote 'origin' configurado."
            Write-Error "Ejecuta: git remote add origin https://github.com/TU_USUARIO/nexus-learn-grow.git"
            return $false
        }
    } catch {
        Write-Error "No hay remote 'origin' configurado."
        Write-Error "Ejecuta: git remote add origin https://github.com/TU_USUARIO/nexus-learn-grow.git"
        return $false
    }
    
    # Verificar que estamos en la rama main
    $currentBranch = git branch --show-current
    if ($currentBranch -ne "main") {
        Write-Warning "No estás en la rama main. Cambiando a main..."
        git checkout main
    }
    
    Write-Log "✅ Configuración correcta"
    return $true
}

# Función para mostrar ayuda
function Show-Help {
    Write-Host "Uso: .\scripts\sync.ps1 [COMANDO]"
    Write-Host ""
    Write-Host "Comandos disponibles:"
    Write-Host "  push     - Hacer push a GitHub (Cursor.ai → Lovable)"
    Write-Host "  pull     - Hacer pull desde GitHub (Lovable → Cursor.ai)"
    Write-Host "  status   - Mostrar estado actual del repositorio"
    Write-Host "  setup    - Verificar configuración"
    Write-Host "  help     - Mostrar esta ayuda"
    Write-Host ""
    Write-Host "Ejemplos:"
    Write-Host "  .\scripts\sync.ps1 push     # Sincronizar cambios a Lovable"
    Write-Host "  .\scripts\sync.ps1 pull     # Obtener cambios de Lovable"
    Write-Host "  .\scripts\sync.ps1 status   # Ver estado actual"
}

# Función principal
function Main {
    switch ($Command) {
        "push" {
            if (Test-Setup) { Push-ToGitHub }
        }
        "pull" {
            if (Test-Setup) { Pull-FromGitHub }
        }
        "status" {
            Show-Status
        }
        "setup" {
            Test-Setup
        }
        "help" {
            Show-Help
        }
        default {
            Show-Help
        }
    }
}

# Ejecutar función principal
Main 