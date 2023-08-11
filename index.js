const {obtenerPersonal, filtrarPersonal, JoyasxId} = require('./consultas')

const express = require('express');
const app = express();

app.listen(3000, console.log("Servidor on 3000"))

const reportarConsulta = async (req, res, next) => {
    const parametros = req.query
      const url = req.url
      console.log(`
      Hoy ${new Date()}
      Se ha recibido una consulta en la ruta ${url} 
      con los parámetros:
      `, parametros)
      next()
}

const prepararHATEOAS = (personal) =>{
    const results = personal.map((m)=>{
        return {
            name: m.nombre,
            href: `http://localhost:3000/joyas/${m.id}`,
        }
    })
    const total = personal.length
    const HATEOAS = {
        total,
        results
    }
    return HATEOAS
}

app.get("/joyas",reportarConsulta, async (req, res) =>{
    try{
        const queryStrings = req.query
        const personal = await obtenerPersonal(queryStrings);
        const HATE = prepararHATEOAS(personal)
        return res.json(HATE)
    }catch(err) {
        console.error(err.message);
        res.json({message: "Hemos tenido problemas con la petición"})
    }
})

app.get("/joyas/filtros",reportarConsulta, async (req, res) => {
    try{
        const queryStrings = req.query
        const personal = await filtrarPersonal(queryStrings)
        const HATE = prepararHATEOAS(personal)
        res.json(HATE)
    }catch(err) {
        console.error(err.message);
        res.json({message: "Hemos tenido problemas con la petición"})
    }
})

app.get("/joyas/:id",reportarConsulta, async (req, res) =>{
    try{
        const { id } = req.params
        const personal = await JoyasxId(id);
        return res.json(personal)
    }catch(err) {
        console.error(err.message);
        res.json({message: "Hemos tenido problemas con la petición"})
    }
})