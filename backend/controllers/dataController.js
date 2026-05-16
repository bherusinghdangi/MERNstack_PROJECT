export const getPortfolio = async (req, res) => {
  try {

    const portfolio = [
      { id: 1, symbol: 'RELIANCE', name: 'Reliance Industries', qty: 10, avgPrice: 2450.00, currentPrice: 2845.50 },
      { id: 2, symbol: 'TCS', name: 'Tata Consultancy Services', qty: 5, avgPrice: 3200.00, currentPrice: 3450.20 },
      { id: 3, symbol: 'INFY', name: 'Infosys Ltd', qty: 15, avgPrice: 1350.00, currentPrice: 1420.30 },
    ];

    res.status(200).json({
      portfolio,
      balance: 100000
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const { symbol, qty, type } = req.body;
    res.status(201).json({
      message: `Order placed successfully for ${qty} shares of ${symbol} (${type})`,
      orderId: Math.random().toString(36).substr(2, 9)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = [
      { id: 1, symbol: 'RELIANCE', qty: 10, price: 2845.50, type: 'BUY', date: new Date().toISOString() },
      { id: 2, symbol: 'TCS', qty: 5, price: 3450.20, type: 'BUY', date: new Date().toISOString() },
    ];
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
