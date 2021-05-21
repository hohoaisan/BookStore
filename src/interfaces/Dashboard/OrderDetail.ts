import OrderDetailBook from 'interfaces/Dashboard/OrderDetailBook';
export default interface OrderDetail {
  id: string;
  status: string;
  orderer: string;
  receiver: string;
  receiver_phone: string;
  receiver_address: string;
  date: string;
  delivery_method: string;
  payment_method: string;
  total_items: number;
  total: number;
  books: OrderDetailBook[];
}
