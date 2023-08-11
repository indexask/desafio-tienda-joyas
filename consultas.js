const {Pool} = require('pg')
const format = require('pg-format')

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "postgres",
    database: "joyas",
    port: 5432,
    allowExitOnIdle: true
});

const obtenerPersonal = async ({limit = 5, order_by = "id_ASC", page = 1}) =>{
    const offset = (page -1) * limit
    const [campo, direccion] = order_by.split("_");
    let consulta = format("select * from inventario order by %s %s limit %s offset %s",campo, direccion, limit, offset);
    const { rows } = await pool.query(consulta)
    return rows
}

const JoyasxId = async (id) =>{
    let consulta = format("select * from inventario where id = %s",id);
    const { rows } = await pool.query(consulta)
    return rows
}

const filtrarPersonal = async ({metal, categoria, precio_max, precio_min}) => {
    let filtros = []
    const values = []
    const agregarFiltro = (campo, comparador, valor) =>{
        values.push(valor)
        const {length} = filtros
        filtros.push(`${campo} ${comparador} $${length+1}`)
    }
    if (metal) agregarFiltro('metal', '=', metal)
    if (categoria) agregarFiltro('categoria', '=', categoria)
    if (precio_max) agregarFiltro('precio', '>=', precio_max)
    if (precio_min) agregarFiltro('precio', '<=', precio_min)
    let consulta = "SELECT * FROM inventario"
    if (filtros.length > 0) {
        filtros = filtros.join(" AND ")
        consulta += ` WHERE ${filtros}`
    }
    const { rows: inventario } = await pool.query(consulta, values)
    return inventario
}

module.exports = {obtenerPersonal, filtrarPersonal, JoyasxId}