from PIL import Image, ImageDraw

img = Image.new("RGB", (1200, 800), color=(255, 255, 255))
draw = ImageDraw.Draw(img)

text = (
    "BUSINESS CONTRACT AGREEMENT\n\n"
    "Party A: NextAI Technology Corporation\n"
    "Party B: Global Office Solutions Ltd\n\n"
    "1. The parties agree to collaborate on document digitization.\n"
    "2. High accuracy OCR engine powered by on-device machine learning.\n"
    "3. Terms and conditions are accepted by both signatories.\n"
    "4. Total contract value: $150,000 USD.\n"
    "5. This agreement is effective as of October 2026."
)

draw.text((80, 80), text, fill=(0, 0, 0))
img.save("CONVERT/test_ocr_doc.jpg", quality=95)
print("Image created successfully")
