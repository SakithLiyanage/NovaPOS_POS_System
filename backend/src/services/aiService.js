const axios = require('axios');

const OPENROUTER_API_KEY = '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';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const aiClient = axios.create({
  baseURL: OPENROUTER_URL,
  headers: {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'NovaPOS AI Assistant',
  },
});

const askAI = async (messages, model = 'openai/gpt-3.5-turbo') => {
  try {
    const response = await aiClient.post('', {
      model,
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI Error:', error.response?.data || error.message);
    throw new Error('AI service unavailable');
  }
};

const getProductRecommendations = async (cartItems, allProducts) => {
  const cartSummary = cartItems.map(i => i.name).join(', ');
  const productList = allProducts.slice(0, 50).map(p => `${p.name} (${p.category?.name || 'Uncategorized'})`).join(', ');

  const response = await askAI([
    {
      role: 'system',
      content: 'You are a retail AI assistant. Recommend 3 products that complement the customer\'s cart. Return ONLY a JSON array of product names, nothing else. Example: ["Product A", "Product B", "Product C"]'
    },
    {
      role: 'user',
      content: `Customer cart: ${cartSummary || 'Empty'}\n\nAvailable products: ${productList}\n\nRecommend 3 complementary products.`
    }
  ]);

  try {
    return JSON.parse(response);
  } catch {
    return [];
  }
};

const analyzeSalesTrend = async (salesData) => {
  const salesSummary = salesData.map(d => `${d._id}: $${d.revenue.toFixed(2)} (${d.count} sales)`).join('\n');

  const response = await askAI([
    {
      role: 'system',
      content: 'You are a business analytics AI. Analyze sales data and provide brief, actionable insights. Be concise - max 3 bullet points.'
    },
    {
      role: 'user',
      content: `Analyze this sales data:\n${salesSummary}`
    }
  ]);

  return response;
};

const generateProductDescription = async (productName, category) => {
  const response = await askAI([
    {
      role: 'system',
      content: 'Generate a short, compelling product description for retail. Max 2 sentences.'
    },
    {
      role: 'user',
      content: `Product: ${productName}\nCategory: ${category || 'General'}`
    }
  ]);

  return response;
};

const chatWithAssistant = async (message, context = {}) => {
  const systemPrompt = `You are NovaPOS AI Assistant, a helpful retail POS system assistant. 
You help with:
- Product information and recommendations
- Sales analysis and tips
- Inventory management advice
- Customer service suggestions

Current context:
- Store: ${context.storeName || 'NovaPOS Store'}
- Today's sales: ${context.todaySales || 0}
- Active products: ${context.activeProducts || 0}

Be helpful, concise, and professional. If asked about specific data you don't have, suggest checking the relevant section in the POS system.`;

  const response = await askAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: message }
  ]);

  return response;
};

const predictLowStock = async (products) => {
  const stockInfo = products.slice(0, 30).map(p => 
    `${p.name}: ${p.currentStock} units (threshold: ${p.lowStockThreshold})`
  ).join('\n');

  const response = await askAI([
    {
      role: 'system',
      content: 'Analyze inventory levels and predict which items need restocking soon. Return ONLY a JSON array of product names that need attention. Example: ["Product A", "Product B"]'
    },
    {
      role: 'user',
      content: `Current inventory:\n${stockInfo}`
    }
  ]);

  try {
    return JSON.parse(response);
  } catch {
    return [];
  }
};

module.exports = {
  askAI,
  getProductRecommendations,
  analyzeSalesTrend,
  generateProductDescription,
  chatWithAssistant,
  predictLowStock,
};
