"""
High-Resolution QR Code Service for Certificate Verification
Generates custom colored QR code images with Pillow overlay compatibility.
"""

import qrcode
from PIL import Image

class QRService:
    @staticmethod
    def generate_qr(
        data: str,
        size: int = 150,
        fill_color: str = "#141e37",
        back_color: str = "#ffffff",
        transparent_bg: bool = False
    ) -> Image.Image:
        """
        Generates a PIL Image QR code of the given data.
        """
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=10,
            border=1,
        )
        qr.add_data(data)
        qr.make(fit=True)

        if transparent_bg:
            qr_img = qr.make_image(fill_color=fill_color, back_color="transparent").convert("RGBA")
            # Replace white/transparent with true alpha if needed
        else:
            qr_img = qr.make_image(fill_color=fill_color, back_color=back_color).convert("RGBA")

        # Resize to requested pixel dimensions with high quality resampling
        qr_img = qr_img.resize((size, size), Image.Resampling.LANCZOS)
        return qr_img
