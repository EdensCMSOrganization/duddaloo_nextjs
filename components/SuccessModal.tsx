// // components/SuccessModal.tsx
// "use client";

// import Modal from "./Modal";
// import Link from "next/link";

// export default function SuccessModal({
//   isOpen,
//   onClose,
//   title = "Framgång!",
//   message = "Din åtgärd slutfördes korrekt",
//   buttonText = "Fortsätt",
//   buttonHref = "/",
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   title?: string;
//   message?: string;
//   buttonText?: string;
//   buttonHref?: string;
// }) {
//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title={title}>
//       <div className="space-y-4">
//         <div className="text-center">
//           <div className="text-5xl mb-4">✅</div>
//           <p className="text-gray-600">{message}</p>
//         </div>
//         <Link
//           href={buttonHref}
//           onClick={onClose}
//           className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
//         >
//           {buttonText}
//         </Link>
//       </div>
//     </Modal>
//   );
// }
"use client";

import Modal from "./Modal"; // Importamos el componente base Modal
import Link from "next/link"; // Para navegación interna de Next.js

// 🎛️ Props del componente:
interface SuccessModalProps {
  isOpen: boolean;           // Controla si el modal está visible
  onClose: () => void;       // Función para cerrar el modal
  title?: string;            // Título personalizado (por defecto en sueco)
  message?: string;          // Mensaje personalizado
  buttonText?: string;       // Texto del botón
  buttonHref?: string;       // Enlace al que redirige el botón
}

export default function SuccessModal({
  isOpen,
  onClose,
  title = "Framgång!",           
  message = "Din åtgärd slutfördes korrekt", 
  buttonText = "Fortsätt",         
  buttonHref = "/",                
}: SuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      
      <div className="space-y-4">
        
        <div className="text-center">
          <div className="text-5xl mb-4" role="img" aria-label="Éxito">
            ✅
          </div>
          
          <p className="text-gray-600">{message}</p>
        </div>

        <Link
          href={buttonHref}
          onClick={onClose}
          className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {buttonText}
        </Link>
      </div>
    </Modal>
  );
}