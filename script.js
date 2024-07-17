// Função para calcular a transposição de uma matriz
function transposeMatrix(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

// Função para calcular a matriz oposta (inversa aditiva)
function negativeMatrix(matrix) {
    return matrix.map(row => row.map(cell => -cell));
}

// Contador de matrizes adicionadas
let matrixCount = 0;

// Função para adicionar um campo de entrada para uma nova matriz
function addMatrix() {
    matrixCount++;
    const matrixInputDiv = document.getElementById('matrixInput');
    const newMatrixInput = `
        <textarea class="form-control mb-2" id="matrix${matrixCount}Input" rows="4" placeholder="Digite a matriz ${matrixCount} separando os elementos por espaço e as linhas por nova linha. Ex: &#10;1 2 3&#10;4 5 6&#10;7 8 9"></textarea>
    `;
    matrixInputDiv.insertAdjacentHTML('beforeend', newMatrixInput);
}

// Função para remover o último campo de entrada de matriz adicionado
function removeMatrix() {
    if (matrixCount > 0) {
        const matrixInputDiv = document.getElementById('matrixInput');
        matrixInputDiv.removeChild(matrixInputDiv.lastElementChild);
        matrixCount--;
    }
}

// Função principal para calcular operações entre matrizes (soma, subtração, multiplicação)
function calculateMatrices() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    // Verifica se há pelo menos duas matrizes para calcular operações
    if (matrixCount < 2) {
        resultDiv.innerHTML = '<p class="text-danger">Por favor, adicione pelo menos duas matrizes para calcular operações.</p>';
        return;
    }

    // Array para armazenar as matrizes inseridas pelo usuário
    let matrices = [];
    for (let i = 1; i <= matrixCount; i++) {
        const matrixInput = document.getElementById(`matrix${i}Input`).value;
        const matrix = parseMatrix(matrixInput);
        matrices.push(matrix);
    }

    // Operação selecionada pelo usuário (soma, subtração, multiplicação)
    const operation = document.getElementById('operation').value;
    let result;

    // Realiza a operação conforme selecionado
    if (operation === 'soma') {
        result = addMatrices(matrices);
    } else if (operation === 'subtracao') {
        result = subtractMatrices(matrices);
    } else if (operation === 'multiplicacao') {
        result = multiplyMatrices(matrices);
    }

    // Exibe o resultado formatado na página
    resultDiv.innerHTML = `<h5>Resultado da ${operation.charAt(0).toUpperCase() + operation.slice(1)}</h5>`;
    resultDiv.innerHTML += formatMatrix(result);
    resultDiv.innerHTML += '<hr>';
}

// Função para converter uma string de entrada em uma matriz numérica
function parseMatrix(input) {
    return input.trim().split('\n').map(row => row.trim().split(' ').map(Number));
}

// Função para formatar uma matriz para exibição na página
function formatMatrix(matrix) {
    if (typeof matrix === 'string') return `<p class="text-danger">${matrix}</p>`;
    return '<pre>' + matrix.map(row => row.join(' ')).join('\n') + '</pre>';
}

// Função para somar matrizes
function addMatrices(matrices) {
    const [rows, cols] = [matrices[0].length, matrices[0][0].length];
    let result = Array.from({ length: rows }, () => Array(cols).fill(0));

    for (let matrix of matrices) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result[i][j] += matrix[i][j];
            }
        }
    }
    return result;
}

// Função para subtrair matrizes
function subtractMatrices(matrices) {
    const [rows, cols] = [matrices[0].length, matrices[0][0].length];
    let result = Array.from({ length: rows }, () => Array(cols).fill(0));

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            result[i][j] = matrices[0][i][j];
        }
    }

    for (let k = 1; k < matrices.length; k++) {
        let matrix = matrices[k];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result[i][j] -= matrix[i][j];
            }
        }
    }
    return result;
}

// Função para multiplicar matrizes
function multiplyMatrices(matrices) {
    let result = matrices[0];
    for (let k = 1; k < matrices.length; k++) {
        let matrix = matrices[k];
        let [rowsA, colsA] = [result.length, result[0].length];
        let [rowsB, colsB] = [matrix.length, matrix[0].length];

        if (colsA !== rowsB) {
            return 'Erro: As matrizes não podem ser multiplicadas.';
        }

        let newResult = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

        for (let i = 0; i < rowsA; i++) {
            for (let j = 0; j < colsB; j++) {
                for (let k = 0; k < colsA; k++) {
                    newResult[i][j] += result[i][k] * matrix[k][j];
                }
            }
        }
        result = newResult;
    }
    return result;
}

// Função para verificar o tipo de matriz (linha, coluna, nula, quadrada, etc.)
function checkMatrixType() {
    const matrixInput = document.getElementById('matrixInputType').value;
    const matrix = parseMatrix(matrixInput);
    const typeResult = document.getElementById('typeResult');

    typeResult.innerHTML = `Dimensões: ${matrix.length} x ${matrix[0].length}<br>`;
    typeResult.innerHTML += `Tipo: ${getMatrixType(matrix)}<br>`;
}

// Função para determinar o tipo específico de matriz
function getMatrixType(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    if (rows === 1) return 'Linha';
    if (cols === 1) return 'Coluna';
    if (matrix.every(row => row.every(cell => cell === 0))) return 'Nula';
    if (rows === cols) {
        if (isIdentity(matrix)) return 'Identidade';
        if (isTriangular(matrix)) return 'Triangular';
        return 'Quadrada';
    }
    return 'Retangular';
}

// Função para verificar se uma matriz é a identidade
function isIdentity(matrix) {
    const n = matrix.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === j && matrix[i][j] !== 1) return false;
            if (i !== j && matrix[i][j] !== 0) return false;
        }
    }
    return true;
}

// Função para verificar se uma matriz é triangular
function isTriangular(matrix) {
    const n = matrix.length;
    let upper = true;
    let lower = true;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i > j && matrix[i][j] !== 0) upper = false;
            if (i < j && matrix[i][j] !== 0) lower = false;
        }
    }
    return upper || lower;
}

// Função para calcular a inversa de uma matriz
function calculateInverse() {
    const matrixInput = document.getElementById('matrixInputType').value;
    const matrix = parseMatrix(matrixInput);
    const inverseResult = document.getElementById('inverseResult');

    // Verifica se a matriz é quadrada para calcular a inversa
    if (matrix.length !== matrix[0].length) {
        inverseResult.innerHTML = '<p class="text-danger">A matriz deve ser quadrada para calcular a inversa.</p>';
        return;
    }

    // Calcula a matriz inversa
    const inverseMatrix = invertMatrix(matrix);
    if (inverseMatrix) {
        inverseResult.innerHTML = `<h5>Matriz Inversa:</h5>${formatMatrix(inverseMatrix)}`;
    } else {
        inverseResult.innerHTML = '<p class="text-danger">A matriz não é inversível.</p>';
    }
}

// Função para calcular a inversa de uma matriz usando a biblioteca math.js
function invertMatrix(matrix) {
    try {
        const inv = math.inv(math.matrix(matrix));
        const fractionInv = inv.map(value => math.fraction(value));
        return fractionInv.valueOf().map(row => row.map(cell => formatFraction(cell)));
    } catch (error) {
        return null;
    }
}

// Função para formatar frações na exibição da matriz
function formatFraction(fraction) {
    const formatted = math.format(fraction, { fraction: 'ratio' });
    const [numerator, denominator] = formatted.split('/');
    if (denominator === '1') {
        return numerator;
    }
    return `<span class="fraction"><span class="numerator">${numerator}</span><span class="denominator">${denominator}</span></span>`;
}

// Função para calcular a transposição da matriz atualmente exibida
function transposeCurrentMatrix() {
    const matrixInput = document.getElementById('matrixInputType').value;
    const matrix = parseMatrix(matrixInput);
    const transposeResult = document.getElementById('transposeResult');

    // Calcula a matriz transposta
    const transposedMatrix = transposeMatrix(matrix);
    transposeResult.innerHTML = `<h5>Matriz Transposta:</h5>${formatMatrix(transposedMatrix)}`;
}

// Função para calcular a matriz oposta (inversa aditiva) da matriz atualmente exibida
function negativeCurrentMatrix() {
    const matrixInput = document.getElementById('matrixInputType').value;
    const matrix = parseMatrix(matrixInput);
    const negativeResult = document.getElementById('negativeResult');

    // Calcula a matriz oposta
    const negativeMatrixResult = negativeMatrix(matrix);
    negativeResult.innerHTML = `<h5>Matriz Oposta (Inversa Aditiva):</h5>${formatMatrix(negativeMatrixResult)}`;
}
