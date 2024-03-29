const costoPorDia = JSON.parse(localStorage.getItem("normal")) || 20;
const costoPorDiaAlta =JSON.parse(localStorage.getItem("alta")) || 30;
let vecinos = JSON.parse(localStorage.getItem("data")) || [];
const pisos = {
    numeros: [1, 2, 3, 4, 5],
    letras : ["A", "B", "C", "D", "E"]
};

const html = {
    //Menú de navegación
    menu : document.querySelectorAll(".btn-menu"),
    activo: document.querySelectorAll(".display"),
    
    //Formulario de Registro
    formulario : document.querySelector("#formulario"),
    inputNombre : document.querySelector("#nombre"),
    inputApellido : document.querySelector("#apellido"),
    inputPisoN : document.querySelector("#pisoN"),
    inputPisoL : document.querySelector("#pisoL"),
    inputTelefono: document.querySelector("#telefono"),
    inputFecha : document.querySelector("#fecha"),
    inputDias : document.querySelector("#dias"),
    inputFechaFin : document.querySelector("#fecha-fin"),
    inputTemporada: document.querySelector("#temporada-checkbox"),
    inputCosto: document.querySelector("#input-costo"),
    inputPago : document.querySelector("#pago-checkbox"),
    btnRegistro : document.querySelector("#btnRegistro"),
    
    //Hotel
    btnVentanas :document.querySelector(".ventanas"),
    btnVentana :document.querySelectorAll(".ventana"),
    
    //Panel de control
    btnGuardarCosto : document.querySelector("#guardar-costos"),
    inputValorNormal : document.querySelector("#valor__normal"),
    inputValorTempAlta : document.querySelector("#valor__temporadaAlta"),
    parrafoExito : document.querySelector(".guardado"),
    costos : document.querySelector(".costos"),
    btnMostrar : document.querySelector("#mostrar"),
    btnEliminarTodos : document.querySelector("#eliminar-todos"),
    inquilinos : document.querySelector(".contenedor-card"),
};

class Vecino {
    constructor (id, nombre, apellido, departamento, telefono, fecha, fechaDeVencimiento, temporadaAlta, costo, pago, img) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.departamento = departamento;
        this.telefono = telefono;
        this.fecha = fecha;
        this.fechaDeVencimiento = fechaDeVencimiento;
        this.temporadaAlta = temporadaAlta;
        this.costo = costo;
        this.pago = pago;
        this.img = img;
    }
};

for(const numero of pisos.numeros) {
    html.inputPisoN.innerHTML += `<option>${numero}</option>` 
}
for(const letra of pisos.letras) {
    html.inputPisoL.innerHTML += `<option>${letra}</option>` 
}

/******* EVENTOS *******/

html.formulario.addEventListener("submit", crear);
html.inputDias.addEventListener("input", fechaDeVencimiento);
html.inputTemporada.addEventListener("change", calcularPrecio);
html.inputPago.addEventListener("change", tomarPago);
html.btnVentanas.addEventListener("click", hotelModal);
html.btnGuardarCosto.addEventListener("click", guardarCostos);
document.addEventListener("DOMContentLoaded", actualizarValues)
html.btnMostrar.addEventListener("click", mostrarInquilinos);
html.btnEliminarTodos.addEventListener("click", eliminarTodos);


/******* FUNCIONES *******/

// Menú //
html.menu.forEach((btn, indiceBtn) => {
    
    btn.addEventListener("click", () => {
        html.activo.forEach((bloque, indiceBloque) => {
            bloque.style.display = "none";
        })
        html.activo[indiceBtn].style.display = "block";
    }) 
})

// Formulario //
async function crear (evt) {
    evt.preventDefault();    
    const id = vecinos.length + 1;
    const nombre = html.inputNombre.value;
    const apellido = html.inputApellido.value;
    const pisoNumero = html.inputPisoN.value;
    const pisoLetra = html.inputPisoL.value;
    const departamento = `${pisoNumero} - ${pisoLetra}`;
    const telefono = html.inputTelefono.value;
    const fecha = formatearFechas(html.inputFecha.value);
    const fechaDeVencimiento = formatearFechas(html.inputFechaFin.value);
    const temporadaAlta = html.inputTemporada.checked;
    const costo = html.inputCosto.value;
    const pagoTexto = html.inputPago.checked ? "Pago" : "No pago";
    const pago = pagoTexto;
    const seed = nombre + apellido;
    const apiUrl = `https://avatars.dicebear.com/api/adventurer-neutral/${seed}.svg`;
    const img = await obtenerImg(apiUrl);
    
    const inquilinoExiste = vecinos.find( inquilino => inquilino.departamento == departamento);
    
    if(inquilinoExiste) {
        Swal.fire({
            title: "¡Departamento ocupado!",
            text: "Primero debe de eliminar a su inquilino actual",
            icon: "warning",
            confirmButtonText: "Entendido"
        });
        return;
    }

    vecinosAdd = new Vecino(id, nombre, apellido, departamento, telefono, fecha, fechaDeVencimiento, temporadaAlta, costo, pago, img);
    vecinos.push(vecinosAdd);
    
    localStorage.setItem("data", JSON.stringify(vecinos));
    
    Swal.fire({
        icon: 'success',
        title: 'Inquilino guardado',
        showConfirmButton: false,
        timer: 1500
    })
    html.formulario.reset();
    tomarPago()
};

async function obtenerImg(apiUrl) {
    try {
        let res = await fetch(apiUrl);
        if(!res.ok) throw(res.status)
        return res.url
    }catch (err) {
        console.log("Ocurrió un error:", err)
    }
}

function formatearFechas(fecha) {
    const formato = fecha.split("-").reverse().join("-");
    return formato;
}

function calcularPrecio () {
    const precioPorDia = html.inputTemporada.checked
        ? `$ ${costoPorDiaAlta * html.inputDias.value}`
        : `$ ${costoPorDia * html.inputDias.value}`;
    html.inputCosto.value =  precioPorDia;
}

function fechaDeVencimiento() {
    const obtenerDias = Number(html.inputDias.value);
    const obtenerFecha = new Date(html.inputFecha.value);
    obtenerFecha.setDate(obtenerFecha.getDate() + obtenerDias + 1);

    const separarFecha = {
       año: obtenerFecha.getFullYear(),
       mes: (obtenerFecha.getMonth() + 1).toString().padStart(2, 0),
       dia: obtenerFecha.getDate().toString().padStart(2, 0)
    }
    
    html.inputFechaFin.value = `${separarFecha.año}-${separarFecha.mes}-${separarFecha.dia}`;

    calcularPrecio();
}

function tomarPago () {
    const inputColor = html.inputPago.checked ? "#18a795" : "#e85252";
    html.inputCosto.style["background-color"] = inputColor;
}

// Hotel //
function hotelModal(evt) {

    vecinos.forEach( inquilino => {
        const { nombre, apellido, departamento, telefono, fecha, fechaDeVencimiento, costo, pago, img } = inquilino;
        
        if ( evt.target.id == departamento ) {
            Swal.fire({
                html: `<div class="sweet-modal">
                            <h2 class="sweet-piso">${departamento}
                            <div class="card__imagen">
                                <img src="${img}" alt="perfil">
                            </div>    
                            <h3 class="sweet-nombre">${nombre} ${apellido}</h3>                           
                            <p class="sweet-texto">Desde: ${fecha}</p> 
                            <p class="sweet-texto">Hasta: ${fechaDeVencimiento}</p> 
                            <p class="sweet-texto">Teléfono: ${telefono}</p> 
                            <p class="sweet-texto">Costo ${costo}</p>
                        </div>`,
                confirmButtonText: "Aceptar",
                footer: `<b>${pago}</b>`,
            })   
        }
    })
}

// Panel de control //
function guardarCostos(e) {
    localStorage.setItem("normal", JSON.stringify(html.inputValorNormal.value));
    localStorage.setItem("alta", JSON.stringify(html.inputValorTempAlta.value));

    html.parrafoExito.innerHTML = "¡Guardado con éxito!"
    
    setTimeout(() => {
        location.reload()
    }, 1000);
}

function actualizarValues() {
    html.inputValorNormal.setAttribute("value", costoPorDia);
    html.inputValorTempAlta.setAttribute("value", costoPorDiaAlta);
}

function mostrarInquilinos() {
    html.inquilinos.innerHTML = " ";
    vecinos.sort( (a,b) => {
        if(a.departamento < b.departamento) {
            return -1;
        }
        if(a.departamento > b.departamento) {
            return 1;
        }
        return 0;
    });   

    vecinos.forEach( persona => {
        const { id, nombre, apellido, departamento, telefono, fecha, fechaDeVencimiento, costo, pago, img } = persona;   
        const div = document.createElement("DIV");
        div.classList.add("acordeon");
        div.innerHTML = `<div class="card">
                            <h2 class="h2">Departamento ${departamento}</h2>
                            <div class="card__imagen">
                                <img src="${img}" alt="perfil">
                            </div>
                            <div class="card__pago">
                                <p> ${pago}</p>
                            </div>
                            <div class="card__detalles">
                                <h3>${nombre} ${apellido}</h3>
                                <div class="card__detalles__grid">
                                    <div class="card__items">
                                        <p>Ingreso</p> 
                                        <p>${fecha}</p>
                                    </div>
                                    <div class="card__items">
                                        <p>Egreso</p> 
                                        <p>${fechaDeVencimiento}</p>
                                    </div>
                                    <div class="card__items">
                                        <p>Teléfono</p> 
                                        <p>${telefono}</p>
                                    </div>
                                    <div class="card__items">
                                        <p>Costo</p> 
                                        <p>${costo}</p>
                                    </div>
                                </div>    
                            </div>
                            <button onclick="eliminarInquilino(${id})" id="${id}">Eliminar</button>
                        </div>`;    
        
        html.inquilinos.appendChild(div);
    }); 
};

function eliminarTodos () {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Estás por eliminar a todos los inquilinos",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminar!'
      }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("data")
            location.reload()
        }
      })
    
}

function eliminarInquilino(id){
    vecinos = vecinos.filter( inquilino => inquilino.id !== id )   
    localStorage.setItem( "data", JSON.stringify(vecinos) );
    mostrarInquilinos()
}