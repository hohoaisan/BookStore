import OrderDetail from 'interfaces/Dashboard/OrderDetail';
import OrderDetailBook from 'interfaces/Dashboard/OrderDetailBook';

const books: OrderDetailBook[] = [
  {
    id: '1',
    book_name: 'Colorful',
    quantity_ordered: 14,
    price: 64000,
    total_money: 128000,
  },
  {
    id: '2',
    book_name: 'Colorful',
    quantity_ordered: 14,
    price: 64000,
    total_money: 128000,
  },
  {
    id: '3',
    book_name: 'Colorful',
    quantity_ordered: 14,
    price: 64000,
    total_money: 128000,
  },
  {
    id: '4',
    book_name: 'Colorful',
    quantity_ordered: 14,
    price: 64000,
    total_money: 128000,
  },
  {
    id: '5',
    book_name: 'Colorful',
    quantity_ordered: 14,
    price: 64000,
    total_money: 128000,
  },
  {
    id: '6',
    book_name: 'Colorful',
    quantity_ordered: 14,
    price: 64000,
    total_money: 128000,
  },
  {
    id: '7',
    book_name: 'Colorful',
    quantity_ordered: 14,
    price: 64000,
    total_money: 128000,
  },
  {
    id: '8',
    book_name: 'Colorful',
    quantity_ordered: 14,
    price: 64000,
    total_money: 128000,
  },
];
const detail : OrderDetail = {
  id: '01',
  status: 'completed',
  orderer: 'Ho Hoai San',
  receiver: 'Ho Hoai San',
  receiver_phone: '0935245367',
  receiver_address: 'Vinh Thanh, Phu Vang',
  date: '2021-05-16',
  delivery_method: 'Thường',
  payment_method: 'Thẻ',
  total_items: 10,
  total: 150000,
  books : books,
}
export default detail;
