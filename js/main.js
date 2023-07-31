let roommates = []; //array vacio de roommates
let gastos = []; //array vacio de gastos
let gastoEditing = null;
const getRoommates = async () => {  //busca la ruta donde se conseguiran los datos de los roommates
    const res = await fetch("http://localhost:3000/roommates");
    const data = await res.json();
    roommates = data.roommates;
};
const getGastos = async () => {   //busca la ruta donde se conseguiran los gastos 
    const res = await fetch("http://localhost:3000/gastos");
    const data = await res.json();
    gastos = data.gastos;
};

const imprimir = async () => {   //imprime en el html los datos que se consiguiran 
    try {
        await getRoommates();
        await getGastos();
        $("#roommates").html("");
        $("#roommatesSelect").html("");
        $("#roommatesSelectModal").html("");
        roommates.forEach((r) => {   //recorre e imprime y la r representa a los roommates
            $("#roommatesSelect").append(`<option value="${r.nombre}">${r.nombre}</option>`);
            $("#roommatesSelectModal").append(`<option value="${r.nombre}">${r.nombre}</option>`);
            $("#roommates").append(`<tr>
                                        <td>${r.nombre}</td>
                                        <td class="text-danger">${r.debe ? r.debe : "-"}</td>
                                        <td class="text-success">${r.recibe ? r.recibe : "-"}</td>
                                    </tr>`);
        });
        $("#gastosHistorial").html("");  // este es la parte de en medio para agregar el detalle ademas es levantado en modal para editar
        gastos.forEach((g) => {     //recorre e imprime y la g representa a los gastos
            $("#gastosHistorial").append(`<tr>
                                            <td>${g.roommate}</td>
                                            <td>${g.descripcion}</td>
                                            <td>${g.monto}</td>
                                            <td class="d-flex align-items-center justify-content-between">
                                                <i class="fas fa-edit text-warning" onclick="editGasto('${g.id}')" data-toggle="modal" data-target="#exampleModal"></i>
                                                <i class="fas fa-trash-alt text-danger" onclick="deleteGasto('${g.id}')" ></i>
                                            </td>
                                        </tr>`);
        });
    } catch (e) {
        console.log(e);
    }
};

const nuevoRoommate = () => {
    fetch("http://localhost:3000/roommate", { method: "POST" })
        .then((res) => res.json())
        .then(() => {
        imprimir();
        });
};

const agregarGasto = async () => {
    const roommateSelected = $("#roommatesSelect").val();
    const descripcion = $("#descripcion").val();
    const monto = Number($("#monto").val());
    await fetch("http://localhost:3000/gasto", {
        method: "POST",
        body: JSON.stringify({
        roommate: roommateSelected,
        descripcion,
        monto,
        }),
    });
    imprimir();
};

const deleteGasto = async (id) => {
    await fetch("http://localhost:3000/gasto?id=" + id, {
        method: "DELETE",
    });
    imprimir();
};

const updateGasto = async () => {
    const roommateSelected = $("#roommatesSelectModal").val();
    const descripcion = $("#descripcionModal").val();
    const monto = Number($("#montoModal").val());
    await fetch("http://localhost:3000/gasto?id=" + gastoEditing, {
        method: "PUT",
        body: JSON.stringify({
        roommate: roommateSelected,
        descripcion,
        monto,
        }),
    });
    $("#exampleModal").modal("hide");
    imprimir();
};

const editGasto = (id) => {
    gastoEditing = id;
    const { roommate, descripcion, monto } = gastos.find((g) => g.id == id);
    $("#roommatesSelectModal").val(roommate);
    $("#descripcionModal").val(descripcion);
    $("#montoModal").val(monto);
};

imprimir();