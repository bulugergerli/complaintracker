import { Box, Button } from "@mui/material";
import jsQR from "jsqr";
import React from "react";

interface QRCodeScannerProps {
  onScan: (url: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageData = await readFileAsImageData(file);

      if (imageData) {
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

        if (qrCode) {
          onScan(qrCode.data);
        }
      }
      e.target.value = "";
    }
  };

  const readFileAsImageData = (file: File): Promise<ImageData | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const context = canvas.getContext("2d");
          if (context) {
            context.drawImage(img, 0, 0, img.width, img.height);
            const imageData = context.getImageData(0, 0, img.width, img.height);
            resolve(imageData);
          } else {
            resolve(null);
          }
        };
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: 2,
          marginTop: 2,
        }}
      />
      <Button variant="contained" color="primary" onClick={handleButtonClick}>
        Scan QR
      </Button>
    </div>
  );
};

export default QRCodeScanner;
