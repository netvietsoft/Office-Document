$srcDir = "f:\APP\Ikame\Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure\CONVERT\Android\app\src\main\java"
$ktFiles = Get-ChildItem -Path $srcDir -Recurse -Filter "*.kt"

$vnRegex = [regex]'[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]'

foreach ($file in $ktFiles) {
    $lines = Get-Content $file.FullName
    for ($i = 0; $i -lt $lines.Length; $i++) {
        $line = $lines[$i]
        # Ignore comments
        if ($line.Trim().StartsWith("//") -or $line.Trim().StartsWith("*")) { continue }
        
        # Check if line contains a string literal with Vietnamese characters
        if ($line -match '"([^"]+)"') {
            $str = $Matches[1]
            if ($vnRegex.IsMatch($str)) {
                # Check if it is localized with if (isVietnamese) or if (isVi) or similar on this line or nearby
                $isGuarded = $false
                for ($j = [Math]::Max(0, $i - 3); $j -le [Math]::Min($lines.Length - 1, $i + 1); $j++) {
                    if ($lines[$j] -match 'isVietnamese|isVi|currentLang|vi|WorldLanguages|ToolConfig|LanguageItem') {
                        $isGuarded = $true
                        break
                    }
                }
                if (-not $isGuarded) {
                    Write-Host "$($file.Name):$($i+1): $line"
                }
            }
        }
    }
}
