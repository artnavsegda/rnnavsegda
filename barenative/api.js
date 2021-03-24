const API_PATH = 'https://app.tseh85.com/DemoService/api'; // demo
// const API_PATH = 'https://app.tseh85.com/service/api'; // prod

export default api = {
  image: API_PATH + '/image',
  auth: API_PATH + '/AuthenticateVending',
  machines: API_PATH + '/vending/machines',
  openlock: API_PATH + '/vending/openlock',
  status: API_PATH + '/vending/status',
  invoice: API_PATH + '/vending/invoice',
  invoiceconfirm: API_PATH + '/vending/invoiceconfirm',
  service: API_PATH + '/vending/service',
  products: API_PATH + '/vending/products'
}
