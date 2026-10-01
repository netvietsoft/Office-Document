import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

src_dir = r"f:\APP\Ikame\Word+Document_+DOCX,+PDF,+XLSX_311200_APKPure\CONVERT\Android\app\src\main\java"
vn_pattern = re.compile(r'[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]')

print("--- AUDITING ALL KT FILES FOR RESIDUAL VIETNAMESE STRINGS ---")
found = 0

# Files to exclude: pure language dictionaries or data structures that define VI mappings
excluded_files = {"TranslatorEngine.kt", "LanguageManager.kt"}

for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith(".kt") and f not in excluded_files:
            fpath = os.path.join(root, f)
            with open(fpath, "r", encoding="utf-8", errors="ignore") as file:
                lines = file.readlines()
            for idx, line in enumerate(lines):
                sline = line.strip()
                if sline.startswith("//") or sline.startswith("*") or sline.startswith("/*"):
                    continue
                matches = re.findall(r'"([^"]*)"', line)
                for s in matches:
                    if vn_pattern.search(s):
                        start = max(0, idx - 15)
                        end = min(len(lines), idx + 10)
                        block = "".join(lines[start:end])
                        if not any(k in block for k in [
                            "isVietnamese", "isVi", "activeIsVietnamese", "currentLang", 
                            "LanguageItem", "WorldLanguages", "ToolConfig", "Triple", 
                            "FeedbackCategoryItem", "findActivity"
                        ]):
                            print(f"{f}:{idx+1}: {sline}")
                            found += 1

print(f"Total potential residual strings: {found}")
