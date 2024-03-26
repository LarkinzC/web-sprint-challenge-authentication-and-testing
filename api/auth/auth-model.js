const db = require('../../data/dbConfig')



async function insert(newUser) {
    const [id] = await db('users').insert(newUser).first()
    return db('users').where({ id })
}

function findByUsername(username) {
    return db('users').where( {username} ).first()
}


module.exports = {
    insert,
    findByUsername
}