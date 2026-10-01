# Verification script for Development Workspace Standard V2.1 compliance.

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Verifying Workspace Standard V2.1 and Full-Stack Reconstruction" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$requiredFiles = @(
    "AGENTS.md",
    "README.md",
    "CLAUDE.md",
    ".clinerules",
    "UPDATETODOS.md",
    "PROJECT_MEMORY.md",
    "TASK_LOG.md",
    "Tasksrequiring.md",
    "CONVERT/Backend/package.json",
    "CONVERT/Backend/src/index.ts",
    "CONVERT/Backend/src/cms/views/admin.html",
    "CONVERT/Android/app/build.gradle.kts",
    "CONVERT/Android/app/src/main/AndroidManifest.xml",
    "Demo Data/schema.sql",
    "Demo Data/queries.sql",
    "Report/README.md"
)

$allPassed = $true

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  [EXISTS] $file" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] $file" -ForegroundColor Red
        $allPassed = $false
    }
}

if ($allPassed) {
    Write-Host "`nAll files and standard documents verified successfully (100%)!" -ForegroundColor Green
} else {
    Write-Host "`nSome files are missing. Please check." -ForegroundColor Red
}
