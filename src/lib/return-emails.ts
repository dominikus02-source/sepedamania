type ReturnEmailType = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

interface ReturnEmailProps {
  type: ReturnEmailType;
  userEmail: string;
  userName: string;
  returnNumber: string;
  orderNumber: string;
  adminNote?: string;
  rejectionReason?: string;
}

export async function sendReturnStatusEmail(props: ReturnEmailProps): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  const subjectMap: Record<ReturnEmailType, string> = {
    REQUESTED: `Pengajuan Pengembalian #${props.returnNumber} Diterima`,
    APPROVED: `Pengembalian #${props.returnNumber} Disetujui`,
    REJECTED: `Pengembalian #${props.returnNumber} Ditolak`,
    COMPLETED: `Pengembalian #${props.returnNumber} Selesai`,
  };

  console.log(`[ReturnEmail] ${subjectMap[props.type]} — to ${props.userEmail}`);
}

export function getReturnWhatsAppMessage(returnNumber: string, orderNumber: string): string {
  return `Halo Sepedamania, saya ingin menanyakan status pengembalian untuk order ${orderNumber} / return ${returnNumber}.`;
}
