import client from '../database';

export interface BaseProduct {
  name: string;
  price: number;
}

export interface Product extends BaseProduct {
  id: number;
}

export class StorefrontProductStore {
  async indexProduct(): Promise<Product[]> {
    try {
        const conn = await client.connect()                        // opens connection 
        const sql = 'SELECT * FROM SFProducts'                   // passes sql code to get all products
        const result = await conn.query(sql)                    // gets the result asynchronously 
        
        conn.release()                                          // closes the connection 
        return result.rows                                      // returns the results
    } catch (err) {
        throw new Error(`Cannot get Products: ${err}`)
    }
  }

  async createProduct(product: BaseProduct): Promise<Product> {
    try {
        const conn = await client.connect(); 
        const sql = 'INSERT INTO SFProducts (name, price) VALUES($1, $2) RETURNING *'
        const result = await conn.query(sql, [product.name, product.price])

        conn.release()
        return result.rows[0]
    } catch (err) {
        throw new Error(`Cannot create Product ${product.name}: ${err}`)
    } 
  }

  async showProduct(id: number): Promise<Product> {
    try {
        const conn = await client.connect(); 
        const sql = 'SELECT * FROM SFProducts WHERE id=($1)'
        const result = await conn.query(sql, [id])

        conn.release()
        return result.rows[0]
    } catch (err) {
        throw new Error(`Cannot get Product with id = ${id}: ${err}`)
    }
}

  async updateProduct(id: number, product: BaseProduct): Promise<Product> {
    try {
      const sql ='UPDATE SFProducts SET name = $1, price = $2 WHERE id = $3 RETURNING *';
      const conn = await client.connect();

      const result = await conn.query(sql, [product.name, product.price, id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update product ${name}. ${err}`);
    }
  }

  async deleteProduct(id: number): Promise<Boolean> {
    try {
        const conn = await client.connect(); 
        const sql = 'DELETE FROM SFProducts WHERE id=($1)'
        const result = await conn.query(sql, [id])

        conn.release()
        return true;
    } catch (err) {
        throw new Error(`Cannot delete Product ${id}: ${err}`)
    }
}
}