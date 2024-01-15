import bcrypt from 'bcrypt';
import client from '../database';

export interface BaseAuthUser {
  firstname: string;
  lastname: string;
  username: string;
  password_digest: string;
}
export interface User extends BaseAuthUser {
  id: number;
}

export class StorefrontUserStore {
    async indexUser(): Promise<User[]> {
        try {
            const conn = await client.connect()                     // opens connection 
            const sql = 'SELECT * FROM SFUsers'                     // passes sql code to get all products
            const result = await conn.query(sql)                    // gets the result asynchronously 
            
            conn.release()                                          // closes the connection 
            return result.rows                                      // returns the results
        } catch (err) {
            throw new Error(`Cannot get Users: ${err}`)
        }
    }
  
  async createUser(user: BaseAuthUser): Promise<User> {
    try {
        const conn = await client.connect(); 
        const sql = `INSERT INTO SFUsers (firstname, lastname, username, password_digest) VALUES($1, $2, $3, $4) RETURNING *`
        const hash = bcrypt.hashSync(
            user.password_digest + process.env.BYCRYPT_PASSWORD, 
            parseInt(process.env.SALT_ROUNDS as string)
        ); 
        const result = await conn.query(sql, [user.firstname, user.lastname, user.username, hash])

        conn.release()
        return result.rows[0]
    } catch (err) {
        throw new Error(`Cannot create User ${user.firstname} ${user.lastname}: ${err}`)
    }
  }

  async showUser(id: number): Promise<User> {
    try {
        const conn = await client.connect(); 
        const sql = `SELECT * FROM SFUsers WHERE id=(${id})`
        const result = await conn.query(sql)

        conn.release()
        return result.rows[0]
    } catch (err) {
        throw new Error(`Cannot get User with id = ${id}: ${err}`)
    }
}

  async updateUser(id: number, firstname: string, lastname: string): Promise<User> {
    try {
      const conn = await client.connect();
      const sql = 'UPDATE SFUsers SET firstname = $1, lastname = $2 WHERE id = $3 RETURNING *';
      const result = await conn.query(sql, [firstname, lastname, id]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not update user ${firstname} ${lastname}. ${err}`
      );
    }
  }

  async deleteUser(id: number): Promise<User> {
    try {
        const conn = await client.connect(); 
        const sql = `DELETE FROM SFUsers WHERE id=($1)`
        const result = await conn.query(sql, [id])

        conn.release()
        return result.rows[0]
    } catch (err) {
        throw new Error(`Cannot delete user ${id}: ${err}`)
    }
}

  async authenticate(username: string, password: string): Promise<User | null> {
    try {
        const conn = await client.connect(); 
        const sql = 'SELECT password_digest FROM SFUsers WHERE username=($1)' 
        const result = await conn.query(sql, [username])

        if (result.rows.length) {
            const user = result.rows[0]

            if (bcrypt.compareSync(password + process.env.BCRYPT_PASSWORD, user.password)) {
                return user
            } 
        }
      conn.release();
      return null;
    } catch (err) {
      throw new Error(`Could not find user ${username}. ${err}`);
    }
  }
}