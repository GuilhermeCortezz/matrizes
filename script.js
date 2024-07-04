let matrixCount = 0;

function addMatrix() {
    matrixCount++;
    const matrixInput = document.getElementById('matrixInput');
    const newMatrix = document.createElement('div');
    newMatrix.setAttribute('id', `matrix${matrixCount}`);
    newMatrix.innerHTML = `
        <h4>Matriz ${matrixCount}</h4>
        <textarea class="form-control mb-2" id="matrix${matrixCount}Input" rows="4" placeholder="Digite a matriz separando os elementos por espaço e as linhas por nova linha. Ex: &#10;1 2 3&#10;4 5 6&#10;7 8 9"></textarea>
    `;
    matrixInput.appendChild(newMatrix);
}

function removeMatrix() {
    if (matrixCount > 0) {
        const matrixInput = document.getElementById('matrixInput');
        matrixInput.removeChild(matrixInput.lastChild);
        matrixCount--;
    }
}

function calculateMatrices() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (matrixCount < 2) {
        resultDiv.innerHTML = '<p class="text-danger">Por favor, adicione pelo menos duas matrizes para calcular operações.</p>';
        return;
    }

    let matrices = [];
    for (let i = 1; i <= matrixCount; i++) {
        const matrixInput = document.getElementById(`matrix${i}Input`).value;
        const matrix = parseMatrix(matrixInput);
        matrices.push(matrix);
    }

    const operation = document.getElementById('operation').value;
    let result;

    if (operation === 'soma') {
        result = addMatrices(matrices);
    } else if (operation === 'subtracao') {
        result = subtractMatrices(matrices);
    } else if (operation === 'multiplicacao') {
        result = multiplyMatrices(matrices);
    }

    resultDiv.innerHTML = `<h5>Resultado da ${operation.charAt(0).toUpperCase() + operation.slice(1)}</h5>`;
    resultDiv.innerHTML += formatMatrix(result);
    resultDiv.innerHTML += '<hr>';
}

function parseMatrix(input) {
    return input.trim().split('\n').map(row => row.trim().split(' ').map(Number));
}

function formatMatrix(matrix) {
    if (typeof matrix === 'string') return `<p class="text-danger">${matrix}</p>`;
    return '<pre>' + matrix.map(row => row.join(' ')).join('\n') + '</pre>';
}

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

function checkMatrixType() {
    const matrixInput = document.getElementById('matrixInputType').value;
    const matrix = parseMatrix(matrixInput);
    const typeResult = document.getElementById('typeResult');

    typeResult.innerHTML = `Dimensões: ${matrix.length} x ${matrix[0].length}<br>`;
    typeResult.innerHTML += `Tipo: ${getMatrixType(matrix)}<br>`;
}

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
