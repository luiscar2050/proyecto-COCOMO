document.getElementById("cocomoForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    // Entradas
    const tipo = document.getElementById("tipoProyecto").value;
    const kloc = parseFloat(document.getElementById("kloc").value);
    const sueldo = parseFloat(document.getElementById("sueldo").value);
    const fi1 = parseFloat(document.getElementById("fi1").value);
    const fi2 = parseFloat(document.getElementById("fi2").value);
    const fi3 = parseFloat(document.getElementById("fi3").value);
  
    const opcion = document.querySelector('input[name="opcion"]:checked').value;
    const programadores = parseFloat(document.getElementById("programadores").value);
    const duracion = parseFloat(document.getElementById("duracion").value);
  
    // Constantes por tipo de proyecto
    const coeficientes = {
      organico: { a: 3.2, b: 1.05 },
      semiacoplado: { a: 3.0, b: 1.12 },
      empotrado: { a: 2.8, b: 1.20 },
    };
  
    const { a, b } = coeficientes[tipo];
  
    // EAF = producto de los factores de ajuste
    const EAF = fi1 * fi2 * fi3; // cuando uses los 15, multiplícalos todos
  
    // Esfuerzo en persona-meses
    const esfuerzo = a * Math.pow(kloc, b) * EAF;
  
    // Duración y tamaño del equipo
    let duracionMeses = 0;
    let equipo = 0;
  
    if (opcion === "programadores") {
      equipo = programadores;
      duracionMeses = esfuerzo / equipo;
    } else {
      duracionMeses = duracion;
      equipo = esfuerzo / duracionMeses;
    }
  
    // Cálculo del costo total
    let mesesRestantes = duracionMeses;
    let año = 1;
    let costoTotal = 0;
    let sueldoActual = sueldo;
  
    while (mesesRestantes > 0) {
      let mesesEsteAño = Math.min(mesesRestantes, 12);
      costoTotal += mesesEsteAño * equipo * sueldoActual;
      mesesRestantes -= mesesEsteAño;
      año++;
      sueldoActual *= 1.05; // Aumento del 5% anual
    }
  
    // Mostrar resultados
    const resultados = `
      <h2>Resultados</h2>
      <p><strong>Esfuerzo estimado:</strong> ${esfuerzo.toFixed(2)} persona-meses</p>
      <p><strong>Duración estimada:</strong> ${duracionMeses.toFixed(2)} meses</p>
      <p><strong>Tamaño del equipo:</strong> ${Math.ceil(equipo)} personas</p>
      <p><strong>Costo total estimado:</strong> $${costoTotal.toLocaleString('es-CO')}</p>
      <hr>
      <h3>Interpretación</h3>
      <p>Este esfuerzo representa la cantidad total de trabajo requerido. La duración y el tamaño del equipo dependen de tus entradas.</p>
      <p>El costo se ajusta anualmente si el proyecto dura más de 12 meses, considerando aumentos salariales del 5%.</p>
    `;
  
    document.getElementById("resultados").innerHTML = resultados;
  });
  