import express from 'express'

const app = express()

app.get('/usuarios', (req,res)=>{
    res.send('Ok, deu bom!')
})

app.listen(3000)

/* 
1- Tipo de Rota / Metódo HTTP
2- Endereço
*/
