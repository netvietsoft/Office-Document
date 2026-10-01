import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

src_dir = r"f:\APP\Ikame\Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure\CONVERT\Android\app\src\main\java"
vn_pattern = re.compile(r'[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]')

print("--- AUDITING FOR UNGUARDED VIETNAMESE STRINGS ---")
count = 0

for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith(".kt"):
            fpath = os.path.join(root, f)
            with open(fpath, "r", encoding="utf-8", errors="ignore") as file:
                lines = file.readlines()
            
            for idx, line in enumerate(lines):
                stripped = line.strip()
                if stripped.startswith("//") or stripped.startswith("*"):
                    continue
                # check string literals
                matches = re.findall(r'"([^"]*)"', line)
                for s in matches:
                    if vn_pattern.search(s):
                        # Check context window of +/- 3 lines for guard
                        start = max(0, idx - 3)
                        end = min(len(lines), idx + 2)
                        context = "".join(lines[start:end])
                        if not any(k in context for k in ["isVietnamese", "isVi", "currentLang", "WorldLanguages", "ToolConfig", "LanguageItem", "code"]):
                            print(f"{f}:{idx+1}: {stripped}")
                            count += 1

print(f"Total potential unguarded lines found: {count}")
