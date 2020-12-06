const API_PATH = 'https://app.tseh85.com/DemoService/api';

export default api = {
  auth: API_PATH + '/AuthenticateVending',
  machines: API_PATH + '/vending/machines',
  openlock: API_PATH + '/vending/openlock',
  status: API_PATH + '/vending/status',
  invoice: API_PATH + '/vending/invoice',
  service: API_PATH + '/vending/service',
  products: API_PATH + '/vending/products'
}
