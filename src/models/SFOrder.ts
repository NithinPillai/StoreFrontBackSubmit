import client from '../database';

export interface OrderProduct {
  product_id: number;
  quantity: number;
}

export interface BaseOrder {
  products: OrderProduct[];
  user_id: number;
  status: boolean;
}

export interface Order extends BaseOrder {
  id: number;
}

export class StorefrontOrderStore {
  async indexOrder(): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM SFOrders';
      const result = await conn.query(sql);
      
      const oPSQL = 'SELECT product_id, quantity FROM SFOrderProducts WHERE order_id=($1)';

      const orders = [];
      for (const order of result.rows) {
        const { rows: orderProductRows } = await conn.query(oPSQL, [order.id]);
        orders.push({
          id: order.id,
          user_id: order.user_id, 
          status: order.status,
          products: orderProductRows
        });
      }
      conn.release();
      return orders;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async createOrder(order: BaseOrder): Promise<Order> {
      const conn = await client.connect();
      const sql = 'INSERT INTO SFOrders (user_id, status) VALUES($1, $2) RETURNING *';
      const result = await conn.query(sql, [order.user_id, order.status]);

      const item = result.rows[0];
      const oPSQL ='INSERT INTO SFOrderProducts (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING product_id, quantity';
      const orderProducts = [];

      for (const product of order.products) {
        const result = await conn.query(oPSQL, [item.id, product.product_id, product.quantity]);
        orderProducts.push(result.rows[0]);
      }

      conn.release();

      return {
        user_id: item.user_id, 
        status: item.status,
        id: item.id,
        products: orderProducts,
      };
  }


  async showOrder(id: number): Promise<Order> {
    try {
      const sql = 'SELECT * FROM SFOrders WHERE id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      const item = result.rows[0];

      const oPSQL = 'SELECT product_id, quantity FROM SFOrderProducts WHERE order_id=($1)';
      const { rows: orderProductRows } = await conn.query(oPSQL, [id]);
      conn.release();
      return {
          user_id: item.user_id, 
          status: item.status,
          id: item.id,
        products: orderProductRows,
      };
    } catch (err) {
      throw new Error(`Could not find order ${id}. ${err}`);
    }
  }

  async showOrderByUser(user_id: number): Promise<Order[]> {
    const sql = 'SELECT * FROM SFOrders WHERE user_id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [user_id]);

     return result.rows;
  }

  async updateOrder(id: number, baseOrder: BaseOrder): Promise<Order> {

      const sql = 'UPDATE SFOrders SET status = $1 WHERE id = $2 RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [baseOrder.status, id]);
      const item = result.rows[0];
      const orderProductsSql = 'UPDATE SFOrderProducts SET product_id = $1, quantity = $2 WHERE order_id = $3 RETURNING product_id, quantity';
      const orderProducts = [];

      for (const product of baseOrder.products) {
        const { rows } = await conn.query(orderProductsSql, [
          product.product_id,
          product.quantity,
          item.id,
        ]);
        orderProducts.push(rows[0]);
      }

      conn.release();

      return {
        user_id: item.user_id, 
          status: item.status,
          id: item.id,
        products: orderProducts,
      };
    
  }

  async deleteOrder(id: number): Promise<Boolean> {
    try {
      const conn = await client.connect();
      const orderProductsSql = 'DELETE FROM SFOrderProducts WHERE order_id=($1)';
      await conn.query(orderProductsSql, [id]);

      const sql = 'DELETE FROM SFOrders WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      const order = result.rows[0];
      conn.release();
      return true;
    } catch (err) {
      throw new Error(`Could not delete order ${id}. ${err}`);
    }
  }
}