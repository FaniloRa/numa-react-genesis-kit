
interface PaymentLinkRequest {
  amount: number;
  validDuration: number;
  clientName: string;
  reference: string;
  description: string;
  successUrl: string;
  failureUrl: string;
  notificationUrl: string;
}

export const createPaymentLink = async (data: PaymentLinkRequest) => {
  try {
    const res = await fetch('https://app.papi.mg/dashboard/api/payment-links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'key': import.meta.env.VITE_PAPI_API_KEY
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error('Erreur lors de la création du lien de paiement');
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
};
