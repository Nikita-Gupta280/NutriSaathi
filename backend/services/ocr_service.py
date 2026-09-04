from PIL import Image
import pytesseract


# Tesseract was installed here on Windows.
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


def extract_text_from_image(image_path):
    """
    Extract text from a food-label image using Tesseract OCR.
    """

    try:
        image = Image.open(image_path)

        text = pytesseract.image_to_string(
            image,
            config="--psm 6"
        )

        return {
            "success": True,
            "text": text.strip()
        }

    except Exception as exc:
        return {
            "success": False,
            "text": "",
            "error": str(exc)
        }