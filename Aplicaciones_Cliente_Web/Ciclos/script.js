function realizarOperaciones() {
    const n1 = parseFloat(document.getElementById('num1').value);
    const n2 = parseFloat(document.getElementById('num2').value);
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = "";
  
    if (isNaN(n1) || isNaN(n2)) {
      resultadoDiv.innerHTML = "<p>Por favor, ingrese ambos números.</p>";
      return;
    }
  
    let i = 1;
    while (i <= 5) {
      let resultadoTexto = "";
      switch (i) {
        case 1:
          resultadoTexto = `Iteración ${i}: ${n1} + ${n2} = ${n1 + n2}`;
          break;
        case 2:
          resultadoTexto = `Iteración ${i}: ${n1} - ${n2} = ${n1 - n2}`;
          break;
        case 3:
          resultadoTexto = `Iteración ${i}: ${n1} × ${n2} = ${n1 * n2}`;
          break;
        case 4:
          resultadoTexto = n2 !== 0 ? 
            `Iteración ${i}: ${n1} ÷ ${n2} = ${n1 / n2}` : 
            `Iteración ${i}: División por cero no es válida.`;
          break;
        case 5:
          resultadoTexto = n2 !== 0 ?
            `Iteración ${i}: ${n1} % ${n2} = ${n1 % n2}` : 
            `Iteración ${i}: Módulo por cero no es válido.`;
          break;
      }
  
      const p = document.createElement('p');
      p.textContent = resultadoTexto;
      resultadoDiv.appendChild(p);
      i++;
    }
  }
  