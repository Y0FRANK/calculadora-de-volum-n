document.addEventListener("DOMContentLoaded", function () {
  const calcularBtn = document.getElementById("calcularBtn");
  const resetBtn = document.getElementById("resetBtn");
  const resultado = document.getElementById("resultado");
  const ctxValores = document.getElementById("graficoValores").getContext("2d");
  const ctxVolumen = document.getElementById("graficoVolumen").getContext("2d");
  const grafico3D = document.getElementById("grafico3D");

  const dataValores = {
    labels: ["Largo (L)", "Ancho (A)", "Altura (H)"],
    datasets: [
      {
        label: "Dimensiones",
        backgroundColor: "rgba(102, 88, 6, 0.5)",
        borderColor: "rgba(102, 88, 6, 1)",
        data: [0, 0, 0]
      }
    ]
  };

  const configValores = {
    type: "bar",
    data: dataValores,
    options: {
      responsive: false,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  const myChartValores = new Chart(ctxValores, configValores);

  const dataVolumen = {
    labels: ["Volumen (V)"],
    datasets: [
      {
        label: "Volumen",
        backgroundColor: "rgba(51, 78, 59, 0.5)",
        borderColor: "rgba(51, 78, 59, 1)",
        data: [0]
      }
    ]
  };

  const configVolumen = {
    type: "bar",
    data: dataVolumen,
    options: {
      responsive: false,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  const myChartVolumen = new Chart(ctxVolumen, configVolumen);

  function calcularVolumen() {
    const largo = parseFloat(document.getElementById("largo").value);
    const ancho = parseFloat(document.getElementById("ancho").value);
    const altura = parseFloat(document.getElementById("altura").value);

    if (isNaN(largo) || isNaN(ancho) || isNaN(altura)) {
      resultado.textContent = "Por favor, ingrese valores válidos.";
      return;
    }

    const volumen = largo * ancho * altura;
    resultado.textContent = `Volumen: ${volumen.toFixed(2)} m³`;

    // Actualizar los gráficos
    myChartValores.data.datasets[0].data = [largo, ancho, altura];
    myChartValores.update();

    myChartVolumen.data.datasets[0].data = [volumen];
    myChartVolumen.update();

    // Crear figura 3D
    crearGrafico3D(largo, ancho, altura);
  }

  function resetear() {
    document.getElementById("largo").value = "";
    document.getElementById("ancho").value = "";
    document.getElementById("altura").value = "";
    resultado.textContent = "";

    // Restablecer los datos de los gráficos
    myChartValores.data.datasets[0].data = [0, 0, 0];
    myChartValores.update();

    myChartVolumen.data.datasets[0].data = [0];
    myChartVolumen.update();

    // Limpiar figura 3D
    while (grafico3D.firstChild) {
      grafico3D.removeChild(grafico3D.firstChild);
    }
  }

  function crearGrafico3D(largo, ancho, altura) {
    // Limpiar figura 3D previa
    while (grafico3D.firstChild) {
      grafico3D.removeChild(grafico3D.firstChild);
    }

    // Configurar escena
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      grafico3D.clientWidth / grafico3D.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(grafico3D.clientWidth, grafico3D.clientHeight);
    grafico3D.appendChild(renderer.domElement);

    // Crear controles de órbita
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Activar amortiguación (inercia)
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;

    // Crear caja
    const geometry = new THREE.BoxGeometry(largo, altura, ancho);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Ajustar cámara para ver la caja
    camera.position.z = Math.max(largo, altura, ancho) * 2;

    // Animación de renderizado
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    animate();
  }

  // Event listeners para botones
  calcularBtn.addEventListener("click", calcularVolumen);
  resetBtn.addEventListener("click", resetear);
});