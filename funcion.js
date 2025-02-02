
    let alumnoActual = null;

    async function buscarAlumno() {
        const cedula = document.getElementById('cedulaInput').value;
        const resultadoDiv = document.getElementById('resultado');
        const categorySection = document.getElementById('categorias');
        const API_URL = 'https://unefa6tosistemas2025api.onrender.com/api/articulos/';
        
        if (!cedula) {
            resultadoDiv.textContent = 'Por favor ingrese una cédula válida';
            resultadoDiv.className = 'result-container error';
            categorySection.style.display = 'none';
            return;
        }

        try {
            const respuesta = await fetch(API_URL + cedula);
            const resultado = await respuesta.json();
            
            resultadoDiv.className = resultado.Resul ? 
                'result-container success' : 
                'result-container error';
            
            if (resultado.Resul) {
                alumnoActual = resultado.data[0].ALUMNO;
                categorySection.style.display = 'block';
                document.getElementById('categorySelect').value = '';
                document.getElementById('articulosResult').innerHTML = '';
                const alumno = resultado.data[0];
                resultadoDiv.innerHTML = `
                    <strong>Alumno encontrado:</strong><br>
                    ${alumno.ALUNOMBRE} ${alumno.ALUNAPELL}<br>
                    <small>Cédula: ${cedula}</small>
                `;
            } else {
                categorySection.style.display = 'none';
                resultadoDiv.textContent = resultado.error;
                alumnoActual = null;
            }
            
        } catch (error) {
            resultadoDiv.className = 'result-container error';
            resultadoDiv.textContent = 'Error en la conexión con el servidor';
            categorySection.style.display = 'none';
            alumnoActual = null;
        }
    }

    async function buscarArticulos() {
        const categoria = document.getElementById('categorySelect').value;
        const articulosDiv = document.getElementById('articulosResult');
        const API_URL = 'https://unefa6tosistemas2025api.onrender.com/api/articulos';
        
        if (!categoria || !alumnoActual) return;

        try {
            const respuesta = await fetch(API_URL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "ALUMNO": alumnoActual,
                    "ARTCATEGO": categoria
                })
            });
            
            const resultado = await respuesta.json();
            
            if (resultado.Resul && resultado.data.length > 0) {
                articulosDiv.innerHTML = resultado.data.map(articulo => `
                    <div class="article-card">
                        <div class="article-info">
                            <h4>${articulo.ARTDESCRI}</h4>
                            <p class="article-price">$${articulo.ARTPRECIO}</p>
                            <p><small>Categoría: ${articulo.ARTCATEGO}</small></p>
                            <p><small>Código: ${articulo.ARTNUMERO}</small></p>
                        </div>
                    </div>
                `).join('');
            } else {
                articulosDiv.innerHTML = `
                    <div class="result-container error">
                        ${resultado.error || 'No se encontraron artículos'}
                    </div>
                `;
            }
            
        } catch (error) {
            articulosDiv.innerHTML = `
                <div class="result-container error">
                    Error en la conexión con el servidor
                </div>
            `;
        }
    }
