export default interface OrderDataGridRow {
    id: string;
    status: string;
    orderer: string;
    receiver: string;
    date: string;
    delivery_method: string;
    payment_method: string;
    total_items: number;
    total: number;
}