import { rejects } from "assert";
//import {console} from "console";
import fs from "fs";
import { resolve } from "path";

//funcion para leer el contenido json
function readJsonFile(filename){
    return new Promise ((resolve, reject) => {
        fs.readFile(`data/${filename}`, "utf8", (err, data)=>{
            if(err) refect(err);
            else resolve(JSON.parse(data));
        });
    });
};
function writeJsonFile(filename, data){
    return new Promise ((resolve, reject)=>{
        fs.writeFile(`data/${filename}`, JSON.stringify(data, null, 2), "utf8", (err)=>{
            if(err) reject(err);
            else resolve();
        });
    });
};

async function ActualizaCuentas(){
    try{
        //leer los archivos roommate.json y gastos.json
        const roommate = await readJsonFile("roommates.json");
        for (const roommate of roommates){
            roommate.recibe = 0;
            roommate.debe = 0;
        }
        const gastos = await readJsonFile("gastos.json");
        for (const gasto of gastos) {
            //calcular la cuota a distribuir entre cada roommate
            const cuota = gasto.monto / roommate.length;
            console.log("Cuota a  distribuir por cada roommates:", cuota);

            //distribuir la cuota entre todos los roommates
            for (const roommate of roommates){
                roommate.debe = roommate.debe + cuota;

                //si el roommate tiene el mismo nombre que el del gasto actual, restaar su cuota
                if (roommate.nombre === gasto.roommate){
                    roommate.recibe = roommate.recibe + (gasto.monto - cuota);
                }
            }
        }
        console.log("Saldo de los roommates actualizados:", roommates);

            //escribir los datos actualizados en roommates.json
            await writeJsonFile("roommates.json", roommates);
            console.log("Distribucion de gastos completado exitosamente");
    } catch (error) {
        console.error("Error al distribuir los gastos:", error);
        }
};

//exportar la funcion actualizacuenta para que sea accesible desde otros archivos
export { ActualizaCuentas };