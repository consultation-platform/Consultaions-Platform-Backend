const axios = require("axios");

exports.generatePaymentSession = async (data) => {
  const response = await axios.post(
    "https://api.moyasar.com/v1/invoices/",
    data,
    {
      auth: {
        username: process.env.MOYASAR_SECRET_KEY,
        password: "",
      },
    }
  );
  return response;
};

exports.paymentCheckout = async (id) => {
  const response = await axios.get(
    `https://api.moyasar.com/v1/invoices/${id}`,
    {
      auth: {
        username: process.env.MOYASAR_SECRET_KEY,
        password: "",
      },
    }
  );
  return response;
};
