import dotenv from 'dotenv'
import pg, { Pool } from 'pg'

dotenv.config()

const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_DB_TEST,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    ENV
} = process.env

let client: pg.Pool = new Pool()
console.log('CONNECTION MADE RIGHT NOW: ', ENV)

if (ENV === 'test') {
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB_TEST, 
        user: POSTGRES_USER, 
        password: POSTGRES_PASSWORD
    })
}

if (ENV === 'dev') {
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB, 
        user: POSTGRES_USER, 
        password: POSTGRES_PASSWORD
    })
}



export default client
