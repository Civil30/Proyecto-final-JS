const costoPorDia = 20;
const costoPorDiaAlta = 35;
const pisos = {
    numeros: [1, 2, 3, 4, 5],
    letras : ["A", "B", "C", "D", "E"]
};
const vecinos = JSON.parse(localStorage.getItem("data")) || [];
// if(!vecinos) {
//     vecinos = []
// }

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
    btnMostrar : document.querySelector("#mostrar"),
    inquilinos : document.querySelector(".contenedor-card"),
    
    //Probando algo
    acordeon: document.querySelectorAll(".card"),
    h2: document.querySelectorAll(".h2")
};

class Vecino {
    constructor (id, nombre, apellido, departamento, telefono, fecha, fechaDeVencimiento, temporadaAlta, costo, pago){
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
    }
};

for(const numero of pisos.numeros) {
    html.inputPisoN.innerHTML += `<option>${numero}</option>` 
}
for(const letra of pisos.letras) {
    html.inputPisoL.innerHTML += `<option>${letra}</option>` 
}

//Eventos
html.formulario.addEventListener("submit", crear);
html.btnMostrar.addEventListener("click", mostrarInquilinos);
html.btnVentanas.addEventListener("click", hotelModal)
html.inputDias.addEventListener("input", fechaDeVencimiento);
html.inputTemporada.addEventListener("change", calcularPrecio)
// html.btnForm.addEventListener("click", cargarFormulario)
// html.btnHotel.addEventListener("click", cargarHotel)
// html.btnControl.addEventListener("click", cargarControl)
html.inputPago.addEventListener("change", tomarPago)

//Funciones
function crear (evt) {
    // evt.preventDefault();    
    const id = vecinos.length + 1;
    const nombre = html.inputNombre.value;
    const apellido = html.inputApellido.value;
    const pisoNumero = html.inputPisoN.value;
    const pisoLetra = html.inputPisoL.value;
    const departamento = `${pisoNumero} - ${pisoLetra}`;
    const telefono = html.inputTelefono.value;
    const fecha = html.inputFecha.value;
    const fechaDeVencimiento = html.inputFechaFin.value;
    const temporadaAlta = html.inputTemporada.checked;
    const costo = html.inputCosto.value;
    const pagoTexto = html.inputPago.checked ? "Pago" : "No pago";
    const pago = pagoTexto
    
    // vecinos.forEach( inquilinos => {
    //     const {pisoN, pisoL} = inquilinos;
    //     if (pisoN + pisoL == pisoNumero + pisoLetra){
    //         evt.preventDefault();    
    
    //     }
        
        
    // })
    vecinosAdd = new Vecino(id, nombre, apellido, departamento, telefono, fecha, fechaDeVencimiento, temporadaAlta, costo, pago);
    vecinos.push(vecinosAdd)
    
    localStorage.setItem("data", JSON.stringify(vecinos));
    
};

function mostrarInquilinos() {
    
    html.inquilinos.innerHTML = " ";

    vecinos.forEach( persona => {
        const { nombre, apellido, departamento, telefono, fecha, fechaDeVencimiento, costo, pago } = persona;

        const div = document.createElement("DIV");
        div.classList.add("acordeon");
        div.innerHTML = `<div class="card">
                            <h2 class="h2">Departamento ${departamento}</h2>
                            <div class="card__imagen">
                                <img src="./img/63765.jpg" alt="perfil">
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
                            <button>Eliminar</button>
                        </div>`;    
        
        html.inquilinos.appendChild(div);    
    })  
};



function calcularPrecio () {
    const precioPorDia = html.inputTemporada.checked
        ? `$ ${costoPorDiaAlta * html.inputDias.value}`
        : `$ ${costoPorDia * html.inputDias.value}`;
    html.inputCosto.value =  precioPorDia;
    
    //De la anterior manera
    // html.inputCosto.value = `$ ${costoPorDia * html.inputDias.value}`;
    // if(html.inputTemporada.checked) {
    //     html.inputCosto.value = `$ ${costoPorDiaAlta * html.inputDias.value}`;
    // };
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
    const inputColor = html.inputPago.checked ? "#0a66c2" : "#e85252";
    html.inputCosto.style["background-color"] = inputColor;
    
    //De la anterior manera
    // html.inputCosto.style["background-color"] = "#e85252"
    // if (html.inputPago.checked) {
    //     html.inputCosto.style["background-color"] = "#0a66c2";
    // }
}

html.menu.forEach((btn, indiceBtn) => {
    
    btn.addEventListener("click", () => {
        html.activo.forEach((bloque, indiceBloque) => {
            bloque.style.display = "none";
        })
        html.activo[indiceBtn].style.display = "block";
    }) 
})

// function cargarFormulario () {
//     // document.body.style["background-color"] = "#BEAEE2";
//     html.hotelDisplay.style.display = "none";
//     html.cardDisplay.style.display = "none";
//     html.formularioDisplay.style.display = "block";
// }

// function cargarHotel () {
//     // document.querySelector("body").style["background-image"] = "url(../img/casas.png)"
//     html.formularioDisplay.style.display = "none";
//     html.cardDisplay.style.display = "none";
//     html.hotelDisplay.style.display = "block";
// }

// function cargarControl () {
//     html.body.style["background-image"] = "none";
//     html.formularioDisplay.style.display = "none";
//     html.hotelDisplay.style.display = "none";
//     html.cardDisplay.style.display = "block";
// }

function hotelModal(evt) {

    vecinos.forEach( inquilino => {
        const { nombre, apellido, departamento, telefono, fecha, fechaDeVencimiento, costo, pago } = inquilino;
        
        if ( evt.target.id == departamento ) {
            Swal.fire({
                html: `<div class="sweet-modal">
                            <h2 class="sweet-piso">${departamento}
                            <div class="card__imagen">
                                <img src="./img/63765.jpg" alt="perfil">
                            </div>    
                            <h3 class="sweet-nombre">${nombre} ${apellido}</h3>                           
                            <p class="sweet-texto">Desde: ${fecha}</p> 
                            <p class="sweet-texto">Hasta: ${fechaDeVencimiento}</p> 
                            <p class="sweet-texto">Teléfono: ${telefono}</p> 
                            <p class="sweet-texto">Costo ${costo}</p>
                        </div>`,
                confirmButtonText: "Aceptar",
                footer: `<b>${pago}</b>`,
                customClass: {
                    image: '...',
                    confirmButton: '...'     
                }
            })   
        }
    })
}

       

 
    // html.h2.forEach( titulo =>{

    //     titulo.addEventListener( "click", (e) => {
    //         const acordeon = e.target.nextElementSibling
    //         acordeon.classList.toggle("activo")
    //     })
    // })
      
    


// function waitForElementToDisplay(selector, time) {
//     if(document.querySelector(selector)!=null) {
//         selector.forEach( titulo =>{

//             titulo.addEventListener( "click", (e) => {
//                 const acordeon =  e.target.nextElementSibling
//                 acordeon.classList.toggle("activo")
//                 console.log("hola")
//             })
//         })
//         return;
//     }
//     else {
//         setTimeout(function() {
//             waitForElementToDisplay(selector, time);
//         }, time);
//     }
// }
// waitForElementToDisplay(".card", 500)