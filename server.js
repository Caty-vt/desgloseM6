import express from "express";
import fs from "fs";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";
import { ActualizaCuentas } from "./js/distribuirGastos.js";

//constantes 
const app = express();

const PORT = 3000;

//coneccion
app.use(express.json());

//rutas 1
app.get("/", (req, res)=>{
    fs.readFile("index.html", "utf8", (err, data)=>{
        if(err){
            res.status(500).send("Error al cargar la pagina");
            } else{
                res.send(data);
            }
    });
});

//funcion nuevo roommate
async function obtenerRandomUser(){
    const res = await fetch('https://randomuser.me/api/');
    const data = await res.json();
    return data.result[0];
    //console.log(data);
};

//ruta GET: obtener los roommates
app.get("/roommates", (req, res)=>{
    fs.readFile("data/roommates.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).json({error: "Error al leer el archivo de roommate"});
        } else {
            const roommate = JSON.parse(data);
            res.status(200).json({roommates});
        }
    })
});

//ruta POST: para agregar roommate
app.post("/roommate", async(req, res)=> {
    try {
        const randomUserData = await obtenerRandomUser();
        const roommate = {
            id: uuidv4(),
            nombre: random/randomUserData.name.first+ " " + randomUserData.name.last,
            debe: 0,
            recibe: 0,
        };
        fs.readFile("data/roommates.json", "utf8", (err, data)=>{
            if (err) {
                res.status(500).json({error: "Error al leer el archivo de roommates."});
            } else{
                const roommates = JSON.parse(data);
                roommates.push(roommate);
                fs.writeFile("data/roommates.json", JSON.stringify(roommate)),
                (err) =>{
                    if(err) {
                        res.status(500).json({error: "Error al guardar el nuevo roommate"});
                    } else {
                        res.status(201).json({mensaje: "nuevo roommate agregado exitosamente"});
                        ActualizaCuentas();
                    }
                };
            };
        });
    } catch (error){
        res.status(500).json({error: "Error al obtener los datos de Randon User."});
    }
});

//ruta GET: obtener los gastos
app.get("/gastos", (req, res)=>{
    fs.readFile("data/roommates.json", "utf8", (err, data)=>{
        if(err){
            res.status(500).json({error: "Error al leer el archivo gastos"});
        } else {
            const gastos = JSON.parse(data);
            res.status(200).json({gastos});
        }
    })
});

app.post("/gastos", (req, res)=>{
    const {roommate, descripcion, monto} = req.body;
    const gasto = {
        id: uuidv4,
        roommate, 
        descripcion,
        monto,
    };
    fs.readFile("data/gastos.json", "utf8", (err, data)=>{
        if(err) {
            res.status(500).json({error: "Error al leer el archivo gastos"});
        }else {
            const gastos = JSON.parse(data);
            gastos.push(gasto);

            fs.writeFile("data/gastos.json", JSON.stringify(gastos), (err)=>{
                if (err) {
                    res.status(500).json({error: "Error al guardar el nuevo gasto"});
                } else {
                    res.status(201).json({mensaje: "Nuevo gasto agregado exitosamente"});
                    ActualizaCuentas();
                } 
            })
        }
    })
});

//ruta POST actualiza los gostos con cada roommate
app.post("/gastos/:id", (req, res)=>{
    const id = req.params.id;
    const {roommate, descripcion, monto} = req.body;
    //console.log("datos recibidos en la solicitud post");

    fs.readFile("data/gastos.json", "utf8", (err, data)=>{
        if (err) {
            res.status(500).json({error: "Error al ller el archivo gastos"});
        }else{
            const gastos = JSON.parse(data);
            const gastoIndex = gastos.findIndex((g) => g.id === id);
            if (gastoIndex !== -1){
                gastos [gastoIndex] = (id, roommate, descripcion, monto);
                fs.writeFile("data/gastos.json", JSON.stringify(gastos), (err)=>{
                    if (err){
                        res.status(500).json({error: "Error al guardar los cambios en gastos"});
                    } else {
                        res.status(200).json({mensaje: "Gasto Actualizado exitosamente"});
                        ActualizaCuentas();
                    }
                });
            } else{
                res.status(404).json({error: "Gasto no encontrado"});
            }
        }
    });
});

//ruta DELET: elimina un gasto
app.delete("/gastos", (req, res)=>{
    const {id} = req.query;
    fs.readFile("data/gastos.json", "utf8", (err, data)=>{
        if (err){
            res.status(500).json({error: "Erros al leer el archivo de gastos"});
        } else {
            const gasto = JSON.parse(data);
            const gastoIndex = gasto.findIndex((g) => g.id === id);
        
            if (gastoIndex !== -1) {
                gastos.splice(gastoIndex, 1);

                fs.writeFile("data/gastos.json", JSON.stringify(gastos), (err)=>{
                    if(err) {
                        res.status(500).json({erros: "Error al leer archivo gastos"});
                    } else {
                        res.status(200).json({mensaje: "Gasto eliminado exitosamente"});
                        ActualizaCuentas();
                    }
                });
            } else {
                res.status(404).json({error: "Gastos no encontrado"});
            }
        }
    })
});

//levantando el servidor
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


