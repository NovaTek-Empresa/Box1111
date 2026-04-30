/**
 * Serviço de Pagamento com Mercado Pago
 * Utilizações:
 * - Gerar QR Codes dinâmicos
 * - Redirecionar para checkout
 * - Verificar status de pagamentos
 * - Listar histórico de pagamentos
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class PaymentService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Gerar QR Code para pagamento
   * @param {number} reservationId - ID da reserva
   * @returns {Promise<Object>} - Dados do QR Code
   */
  async generateQRCode(reservationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          reservation_id: reservationId,
          payment_method: 'qr_code'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao gerar QR Code');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      throw error;
    }
  }

  /**
   * Redirecionar para checkout do Mercado Pago
   * @param {number} reservationId - ID da reserva
   * @returns {Promise<void>}
   */
  async redirectToCheckout(reservationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          reservation_id: reservationId,
          payment_method: 'redirect'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar checkout');
      }

      const data = await response.json();
      window.location.href = data.data.checkout_url;
    } catch (error) {
      console.error('Erro ao redirecionar para checkout:', error);
      throw error;
    }
  }

  /**
   * Verificar status de um pagamento
   * @param {number} paymentId - ID do pagamento
   * @returns {Promise<Object>} - Status do pagamento
   */
  async getPaymentStatus(paymentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/status`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao obter status');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter status de pagamento:', error);
      throw error;
    }
  }

  /**
   * Obter detalhes de um pagamento
   * @param {number} paymentId - ID do pagamento
   * @returns {Promise<Object>} - Detalhes do pagamento
   */
  async getPaymentDetails(paymentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao obter detalhes');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter detalhes do pagamento:', error);
      throw error;
    }
  }

  /**
   * Listar pagamentos do usuário
   * @param {number} perPage - Itens por página
   * @param {number} page - Número da página
   * @returns {Promise<Object>} - Lista de pagamentos
   */
  async listPayments(perPage = 15, page = 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments?per_page=${perPage}&page=${page}`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao listar pagamentos');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar pagamentos:', error);
      throw error;
    }
  }

  /**
   * Reembolsar um pagamento (apenas host)
   * @param {number} paymentId - ID do pagamento
   * @param {Object} options - Opções de reembolso
   * @returns {Promise<Object>} - Resultado do reembolso
   */
  async refundPayment(paymentId, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          amount: options.amount || null,
          reason: options.reason || 'Reembolso solicitado'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao reembolsar');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao reembolsar pagamento:', error);
      throw error;
    }
  }
}

export default PaymentService;

/**
 * Hook React para integração com pagamentos
 * 
 * Exemplo de uso:
 * const { generateQRCode, redirectToCheckout, getPaymentStatus, loading, error } = usePaymentService(accessToken);
 */
export function usePaymentService(accessToken) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const service = React.useRef(new PaymentService(accessToken)).current;

  const generateQRCode = React.useCallback(async (reservationId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.generateQRCode(reservationId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const redirectToCheckout = React.useCallback(async (reservationId) => {
    setLoading(true);
    setError(null);
    try {
      await service.redirectToCheckout(reservationId);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const getPaymentStatus = React.useCallback(async (paymentId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.getPaymentStatus(paymentId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const listPayments = React.useCallback(async (perPage, page) => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.listPayments(perPage, page);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const refundPayment = React.useCallback(async (paymentId, options) => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.refundPayment(paymentId, options);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  return {
    generateQRCode,
    redirectToCheckout,
    getPaymentStatus,
    listPayments,
    refundPayment,
    loading,
    error
  };
}

/**
 * Exemplo de Component React para pagamento com QR Code
 * 
 * <QRCodePayment 
 *   reservationId={1}
 *   reservationDetails={{
 *     title: 'Aluguel Casa',
 *     amount: 500,
 *     checkIn: '2024-05-01',
 *     checkOut: '2024-05-05'
 *   }}
 *   onSuccess={(result) => console.log('Pagamento realizado')}
 *   onError={(error) => console.log('Erro:', error)}
 * />
 */
export function QRCodePayment({ 
  reservationId, 
  reservationDetails, 
  onSuccess, 
  onError 
}) {
  const [qrCode, setQrCode] = React.useState(null);
  const { generateQRCode, loading, error } = usePaymentService(
    localStorage.getItem('access_token')
  );

  React.useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  const handleGenerateQRCode = async () => {
    try {
      const result = await generateQRCode(reservationId);
      setQrCode(result.data);
      onSuccess?.(result);
    } catch (err) {
      onError?.(err.message);
    }
  };

  return (
    <div className="qr-code-payment">
      <h3>Pagar Reserva com QR Code</h3>
      
      {reservationDetails && (
        <div className="reservation-details">
          <p><strong>{reservationDetails.title}</strong></p>
          <p>Check-in: {reservationDetails.checkIn}</p>
          <p>Check-out: {reservationDetails.checkOut}</p>
          <p className="amount">R$ {reservationDetails.amount.toFixed(2)}</p>
        </div>
      )}

      {!qrCode ? (
        <button 
          onClick={handleGenerateQRCode}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Gerando QR Code...' : 'Gerar QR Code'}
        </button>
      ) : (
        <div className="qr-code-container">
          <img 
            src={qrCode.qr_code_url} 
            alt="QR Code" 
            className="qr-code-image"
          />
          <p className="qr-code-hint">
            Escaneie este código com sua câmera ou app do Mercado Pago
          </p>
          <button 
            onClick={() => setQrCode(null)}
            className="btn btn-secondary"
          >
            Gerar novo QR Code
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>Erro: {error}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Exemplo de Component React para redirecionamento
 * 
 * <CheckoutButton 
 *   reservationId={1}
 *   onSuccess={() => navigate('/reservations')}
 * />
 */
export function CheckoutButton({ reservationId, onSuccess }) {
  const { redirectToCheckout, loading, error } = usePaymentService(
    localStorage.getItem('access_token')
  );

  const handleCheckout = async () => {
    try {
      await redirectToCheckout(reservationId);
      onSuccess?.();
    } catch (err) {
      console.error('Erro ao redirecionar:', err);
    }
  };

  return (
    <div className="checkout-button">
      <button 
        onClick={handleCheckout}
        disabled={loading}
        className="btn btn-primary btn-lg"
      >
        {loading ? 'Redirecionando...' : 'Pagar com Mercado Pago'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
