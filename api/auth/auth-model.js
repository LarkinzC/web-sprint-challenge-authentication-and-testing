const db = require('../../data/dbConfig')



async function insert(newUser) {
    const [id] = await db('users').insert(newUser).first()
    return db('users').where({ id })
}

function findBy(filter) {
    return db('users').where(filter)
}

async function add(newUser) {
    const [id] = await db('users').insert(newUser)
    return db('users').where({ id }).first()
} 

function get() {
    return db('users')
}


module.exports = {
    insert,
    findBy,
    add,
    get
}