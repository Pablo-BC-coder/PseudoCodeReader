// Feito por Pablo BC
// Please, if you liked, upvote

var Variables = []; // Variável que contèm variáveis criadas com o pseudo código

// A estrutura de objeto para ser escrita em Variables é {"name": "NomeDaVariavel", "Type": "Tipo", "Value": "Valor"}

var excCode = []; // Variável que contém o conjunto de instruções executáveis.
var excLine = [0]; // Linha de um algoritmo a ser lida. Pelo fato poder haver mais de uma função, ela é considerada uma lista.
var excAlg = []; // Algoritmos em execução, do mais antigo ao mais novo.
var interrupt = false; // Indicação (flag) que para, temporariamente, a execução do código. Geralmente, utilizada com entradas de texto pelo teclado.
var inputValue = ""; // Valor de entrada de teclado. Quando vazia e chamada pelo comando "leia", gera uma interrupção no código até que tenha, ao menos, um caractere.



// Para a variável de códigos, há as instruções:
// 0: parar
// 1: escreva (1 parametro)
// 2: leia (múltiplos parametros)
// 3: definir variável (expressão)
// 4: executar outro algoritmo (multiplos parâmetros)

// erros
// 0: Sem erro
// 1: Erro de sintaxe
// 2: Tipo incompatível
// 

var debug = false;

var erro = 0; // Código de erro na execução ou compilação

// Executa a compilação do código
function executePseudo() {
	let linesBeforeStop = 1024; // Ao chegar em zero, pausa por um milésimo de segundo a execução afim de não tornar o navegador lento ou travá-lo.
	if (excAlg.length == 0) {
		excAlg.push(Object.keys(excCode[0])[0]); // Obtém o nome do primeiro algoritmo para armazená-lo no "stack"
		print("Algoritmo \"" + excAlg[0] + "\" é o primeiro a ser executado.", "\n\n"); // Avisa o nome do algoritmo a executar
	}
	
	let stackIndex = excAlg.length - 1; // Índice de leitura do "stack" de funções e linhas
	while (!interrupt && linesBeforeStop > 0 && excCode[stackIndex][excAlg[stackIndex]].code[excLine[stackIndex]] != 0 && erro == 0) { // Verifica se o interrupt está ativado, se é o momento de pausar o código por 1 ms, se o código acabou/parou e se houve algum erro.
	let actualAlg = excAlg[stackIndex];
	let evalExp = "";
		switch (excCode[stackIndex][actualAlg].code[excLine[stackIndex]]) { // Verifica qual instrução é.
			case 1: // Escreve
				evalExp = filterEvaluate(excCode[stackIndex][actualAlg].code[excLine[stackIndex] + 1][0]);
				let evalExp1 = "\n";
				if (excCode[stackIndex][actualAlg].code[excLine[stackIndex] + 1].length > 1) evalExp1 = filterEvaluate(excCode[stackIndex][actualAlg].code[excLine[stackIndex] + 1][1]);
				if (erro != 0) break;
				print(evalExp, evalExp1); // Escreve a evaluação, filtrada para o código, do atributo/parâmetro passado na memória, na tela
				excLine[stackIndex] += 2;
				break;
			case 2: // Leia
				if (inputValue == "") { // Verifica se o valor de entrada está vazio para aguardar a entrada de um (valor).
					interrupt = true;
					addInput();
				} else { // Caso haja algum valor na input, aloque-o na(s) variável(is) passada(s) como parâmetro(s).
					if (debug) console.log("Input: " + inputValue);
					let enteredValues = inputValue.split(" ");
					
					
					if (excCode[stackIndex][actualAlg].code[excLine[stackIndex] + 1].length > 1) {
						for (var j = 0; j < excCode[stackIndex][actualAlg].code[excLine[stackIndex] + 1].length; j++) {
							if (j > enteredValues.length) {
								print("Erro de sintaxe: poucos valores fornecidos na entreda.", "\n\n", "red");
								erro = 1;
								break;
							}
							// defineVariables(excCode[stackIndex][actualAlg].code[excLine[stackIndex] + 1][j], enteredValues[j].substr(0, enteredValues[j].search(hasSpecialCharacters(enteredValues[j])))); // Obtém as entradas
							// Obtém o tipo de cada entrada
							excCode[stackIndex][actualAlg].code[excLine[stackIndex] + 1][j] = excCode[stackIndex][actualAlg].code[excLine[stackIndex] + 1][j].trim().split(" ")[0];
							var enteredVarAddres = getPseudoVariableAddress(excCode[stackIndex][actualAlg].code[excLine[stackIndex] + 1][j]);
							
							if (debug) console.log("Found index " + enteredVarAddres + ((enteredVarAddres >= 0)?"":"(unexistent) ") + "for the variable name \"" + excCode[stackIndex][actualAlg].code[excLine[stackIndex] + 1][j] + "\".");
							
							if (enteredVarAddres < 0) { // Define nova variável caso não encontre
								Variables.push({"name": excCode[stackIndex][actualAlg].code[excLine[stackIndex] + 1][j], "type": getPseudoType(enteredValues[j]), "value": 0});
								enteredVarAddres = Variables.length - 1;
								if (debug) console.log("Variable created: " + Variables[enteredVarAddres].name);
							}
							switch (Variables[enteredVarAddres].type) {
								case "Int":
									if ("IntReal".includes(getPseudoType(enteredValues[j]))) { // Verifica se o tipo é real ou inteiro
										Variables[enteredVarAddres].value = parseInt(enteredValues[j]);
									} else {
										erro = 2;
										print("Não é possível converter, diretamente, texto (\"" + enteredValues[j]+ "\") para número.", "\n\n", "red");
									}
									break;
								case "Real":
									if ("IntReal".includes(getPseudoType(enteredValues[j]))) { // Verifica se o tipo é real ou inteiro
										Variables[enteredVarAddres].value = parseFloat(enteredValues[j]);
									} else {
										erro = 2;
										print("Não é possível converter, diretamente, texto (\"" + enteredValues[j]+ "\") para número.", "\n\n", "red");
									}
									break;
								case "String":
									Variables[enteredVarAddres].value = enteredValues[j];
									break;
								case "Bool":
									Variables[enteredVarAddres].value = enteredValues[j] == true;
									break;
								default:
							}
						}
					} else if (excCode[stackIndex][actualAlg].code[excLine[stackIndex] + 1].length == 1) {
						// defineVariables(excCode[stackIndex][actualAlg].code[excLine[stackIndex] + 1][0], inputValue);
						var enteredVarAddres = getPseudoVariableAddress(excCode[stackIndex][actualAlg].code[excLine[stackIndex] + 1][0]);
						if (enteredVarAddres < 0) { // Define nova variável caso não encontre
							Variables.push({"name": excCode[stackIndex][actualAlg].code[excLine[stackIndex] + 1][0], "type": getPseudoType(inputValue), "value": 0});
							enteredVarAddres = Variables.length - 1;
							if (debug) console.log("Variable created: " + Variables[enteredVarAddres].name);
						}
							switch (Variables[enteredVarAddres].type) {
								case "Int":
									if ("IntReal".includes(getPseudoType(inputValue))) { // Verifica se o tipo é real ou inteiro
										Variables[enteredVarAddres].value = parseInt(inputValue);
									} else {
										erro = 2;
										print("Não é possível converter, diretamente, texto (\"" + inputValue+ "\") para número.", "\n\n", "red");
									}
									break;
								case "Real":
									if ("IntReal".includes(getPseudoType(inputValue))) { // Verifica se o tipo é real ou inteiro
										Variables[enteredVarAddres].value = parseFloat(inputValue);
									} else {
										erro = 2;
										print("Não é possível converter, diretamente, texto (\"" + inputValue+ "\") para número.", "\n\n", "red");
erro = 2;
									}
									break;
								case "String":
									Variables[enteredVarAddres].value = inputValue;
									break;
								case "Bool":
									Variables[enteredVarAddres].value = inputValue == true;
									break;
								default:
							}
					}

					inputValue = "";
					excLine[stackIndex] += 2;
				}
				break;
			case 3: // Calcula variável
				evalExp = filterEvaluate(excCode[stackIndex][actualAlg].code[excLine[stackIndex] + 1][1]);
				if (erro != 0) break;
				const findIndexCondition = (exp) => exp.name == excCode[stackIndex][actualAlg].code[excLine[stackIndex] + 1][0]; // Condição para verificar se o nome do primeiro parâmetro existe como variável.
				
				// Mudar para defineVariables()
				let variableIndex = (Variables.findIndex(findIndexCondition)); // Compara as variáveis com o nome fornecido
				if (variableIndex >= 0) { // Verifica se o resultado da expressão algébrica é um número ou um texto
					if (!isNaN(Number(evalExp))) {
						switch (Variables[variableIndex].type) { // Compara o tipo número com os tipos da variável encontrada
							case "Int":
								Variables[variableIndex].value = parseInt(evalExp);
								break;
							case "Real":
								Variables[variableIndex].value = parseFloat(evalExp);
								if (debug) console.log("Float variable " + Variables[variableIndex].name + " assigned value " + Variables[variableIndex].value);
								break;
							case "String":
								Variables[variableIndex].value = evalExp;
								break;
							case "Bool":
								Variables[variableIndex].value = parseFloat(evalExp) == true;
						}
						if (debug) console.log("Assing " + evalExp + " to " + Variables[variableIndex].name);
					} else {
						switch (Variables[variableIndex].type) { // Compara o tipo número com os tipos da variável encontrada
							case "String":
								Variables[variableIndex].value = evalExp;
								break;
							default:
								erro = 2;
								print("Não é possível converter, diretamente, texto (\"" + evalExp + "\") para número.", "\n\n", "red");
						}
					}
				} else {
					let newVarName = excCode[stackIndex][actualAlg].code[excLine[stackIndex] + 1][0];
					if (!isNaN(Number(evalExp))) {
						// Tenta descobrir o tipo de variável para a criar
						if (parseInt(evalExp) == evalExp) { // Int
							Variables.push({"name": newVarName, "type": "Int", "value": parseInt(evalExp)});
						} else { // Real
							Variables.push({"name": newVarName, "type": "Real", "value": parseFloat(evalExp)});
						}
					} else {
						Variables.push({"name": newVarName, "type": "String", "value": evalExp})
					}
				}
				if (debug && variableIndex >= 0) console.log("Recent variable: " + Variables[variableIndex].name + " with value " + Variables[variableIndex].value);
				if (debug) console.log(Variables);
				excLine[stackIndex] += 2;
				break;
			default:
				break;
		}
		linesBeforeStop--;
	}
	if (excCode[stackIndex][excAlg[stackIndex]].code[excLine[stackIndex]] != 0 && erro == 0 && !interrupt) {
		setTimeout(executePseudo, 1);
	}
}

// Obtém o tipo de variável a partir do valor
function getPseudoType(value) {
	if (isNaN(Number(value))) {
		if (value == "true" || value == "false") {
			return "Bool";
		} else {
			return "String";
		}
	} else {
		if (parseInt(value) == value) {
			return "Int";
		} else {
			return "Real";
		}
	}
}

// Obtém endereço de variável a partir do nome
function getPseudoVariableAddress(name) {
	if (debug) console.log("Fiding a variable with name: " + name);
	const findIndexCondition = (exp) => exp.name == name; // Condição para verificar se o nome do primeiro parâmetro existe como variável.
	if (debug) console.log("Condition: " + findIndexCondition);
	return Variables.findIndex(findIndexCondition); // Compara as variáveis com o nome fornecido
}

// Lê as expressões das variáveis
function defineVariables(givenName, expression) {
let evalExp = filterEvaluate(givenName, expression);
				if (erro != 0) return 0;
				const findIndexCondition = (exp) => exp.name == givenName; // Condição para verificar se o nome do primeiro parâmetro existe como variável.
				
				let variableIndex = (Variables.findIndex(findIndexCondition)); // Compara as variáveis com o nome fornecido
				if (variableIndex >= 0) { // Verifica se o resultado da expressão algébrica é um número ou um texto
					if (!isNaN(Number(evalExp))) {
						switch (Variables[variableIndex].type) { // Compara o tipo número com os tipos da variável encontrada
							case "Int":
								Variables[variableIndex].value = parseInt(evalExp);
							case "Real":
								Variables[variableIndex].value = parseFloat(evalExp);
							case "String":
								Variables[variableIndex].value = evalExp;
							case "Bool":
								Variables[variableIndex].value = parseFloat(evalExp) == true;
						}
						if (debug) console.log("Assing " + evalExp + " to " + Variables[variableIndex].name);
					} else {
						switch (Variables[variableIndex].type) { // Compara o tipo número com os tipos da variável encontrada
							case "String":
								Variables[variableIndex].value = evalExp;
							default:
								erro = 2;
								print("Não é possível converter, diretamente, texto (\"" + evalExp + "\") para número.", "\n\n", "red");
						}
					}
				} else {
					let newVarName = givenName;
					if (!isNaN(Number(evalExp))) {
						// Tenta descobrir o tipo de variável para a criar
						if (parseInt(evalExp) == evalExp) { // Int
							Variables.push({"name": newVarName, "type": "Int", "value": parseInt(evalExp)});
						} else { // Real
							Variables.push({"name": newVarName, "type": "Real", "value": parseFloat(evalExp)});
						}
					} else {
						Variables.push({"name": newVarName, "type": "String", "value": evalExp});
					}
				}
}

// Compila e roda e requisita a execução do código compilado com executePseudo
function runCode() { // Lê a caixa de pseudo código e, então, transforma-a em código executável
	Variables = []; // Limpa as variáveis
	excCode = []; // Limpa as funções (algoritmos)
	var theCode = document.getElementById("code").value.split("\n"); // Quebra o código em linhas
	
	// Divide cada linha do código em espaços para a conversão de ele em código executável
	for (var i = 0; i < theCode.length; i++) {
		theCode[i] = theCode[i].split(" ");
	}

	excAlg = [""]; // Além de limpar os algoritmos em "stack", é definido como "" o primero valor devido ao fato que essa variável será utilizada como controle durante a compilação do código.
	excLine = [0];

	canReadCode = false; // Variável responsável por definir se o código entre "Inicio" e "Fim" pode ser compilado para "excCode"

	//Começa a leitura das partes divididas. Inicialmente, procura por "Algoritmo"
	print("Lendo o pseudo código...", "\n\n");
	try {
	erro = 0;
	let identation = 0; // Usada para verificar identações de cada linha
	let maxIdentations = []; // Utilizado para verificar o "gerador" da identação (i.e. "Se")
	for (var i = 0; i < theCode.length; i++) {
		if (debug) console.log("Reading line: " + theCode[i]);
		if (theCode[i].length == 0) continue; // Se não houver algo escrito, ignore
		while (theCode[i][0] == "" && theCode[i].length > 1) {theCode[i] = theCode[i].slice(1); if (debug) console.log("Adjusting the line to: " + theCode[i]); identation++;} // Essa verificação de "string" vazia não foi feita junto com a comparação acima para evitar erros de acessar lista sem elementos. Ela remove espaços vazios
		if (theCode[i][0] == "") continue; // Continua para a próxima linha se o único caractere da linha for um espaço vazio
		if (theCode[i][0] == " ") theCode[i][0].shift();
		
		if (theCode[i][0] == "Algoritmo" && excAlg[0] == "" && !canReadCode) { // Obtém os algoritmos
			if (hasSpecialCharacters(theCode[i][1]) == "") { // Verifica se há caractere especial. Caso contrário, adiciona o nome do algoritmo em excCode
				excCode.push(JSON.parse("{\""+theCode[i][1]+"\": {\"code\": []}}"));
				excAlg[0] = theCode[i][1];
				if (debug) {
					print("Encontrado o Algoritmo: \"" + theCode[i][1] + "\"", "\n", "gray");
					console.log(excCode[0]);
				}
			} else {
				erro = 1;
				print("Erro de sintaxe ao definir algoritmo (linha " + (i + 1)+ "): caractere inválido \"" + hasSpecialCharacters(theCode[i][1]) + "\" em \""+theCode[i][1]+"\"", "\n\n", "red");
			}
		}
		
		// Caso já tenha encontrado algum algoritmo, ele vair procurar por variáveis
		if (excAlg[0] != "" && theCode[i][0] == "Variaveis") {
			if (debug) console.log(theCode[i].slice(1).join(" "));
			let textToCheck = []; // Texto utilizado para verificar e registrar nome da variável. É apagado após definir cada tipo das variáveis
			let comas = theCode[i].slice(1).join(" ").split(","); // Variável que contém o texto dividido por vírgulas
			for (inComa_index in comas) {
				let inComa = comas[inComa_index];
				if (debug) console.log("Reading variable name: " + inComa);
				textToCheck.push(inComa); // É adicionado os nomes das variáveis aqui para, futuramente, ser possível definir mais de um tipo igual ao mesmo tempo
				var typeToSet = ""; // Tipo de variável a definir obtido durante a leitura dos nomes das variáveis declaradas
				// Verifica se há caracteres especiais (como "á") ou ":" para definir o tipo
				if (hasSpecialCharacters(inComa) != "") {
					var variableName = ""; // Nome da variável a ser adicionada sem caracteres especiais
					// Apaga o último índice de "textToCheck" para reescrevê-lo sem os tipos inclusos no nome da variável
					textToCheck[textToCheck.length - 1] = "";
					var verifyType = false; // Indicador (flag) que é ativada quando encontrada uma definição de tipo de variável i.e. "nome da variável real: Real"
					typeToSet = "";
					for (var j = 0; j < inComa.length; j++) {
						// Adiciona o caractere verificado ao nome da variável caso não seja um caractere especial
						if (hasSpecialCharacters(inComa[j]) == "" && !verifyType) {
							textToCheck[textToCheck.length - 1] += inComa[j];

						} else if (hasSpecialCharacters(inComa[j]) != ":" && inComa[j] != " " && inComa[j] != " " && !verifyType) { // Erro caso haja caracteres especiais
							erro = 1;
							print("Erro de sintaxe ao declarar variável (linha " + (i + 1)+ "): caractere inválido \"" + inComa[j] + "\" em \""+inComa+"\"", "\n\n", "red");

						}

						// Lê o nome do tipo após ":"
						if (verifyType && hasSpecialCharacters(inComa[j]) == "") {
							typeToSet += inComa[j];
						} else if (verifyType && hasSpecialCharacters(inComa[j]) != " ") {
							erro = 1;
							print("Erro de sintaxe ao ler tipo de variável (linha " + (i + 1)+ "): caractere inválido \"" + inComa[j] + "\" em \""+inComa+"\"", "\n\n", "red");
						}

						// Procura por ":", para ver se já é possível definir o tipo
						if (inComa[j] == ":" && !verifyType) {
							verifyType = true;
						}
					}

					// Verifica se a leitura de tipo foi bem sucedida para, então, definir as variáveis
					if (debug) console.log(textToCheck);
					if (erro == 0 && typeToSet != "") {
						for (var k_index in textToCheck) {
							let k = textToCheck[k_index];
							switch (typeToSet) {
								case "Int":
									Variables.push({"name": k, "type": "Int", "value": 0});
									break;
								case "Real":
									Variables.push({"name": k, "type": "Real", "value": 0.0});
									break;
								case "String":
									Variables.push({"name": k, "type": "String", "value": ""});
									break;
								case "Bool":
									Variables.push({"name": k, "type": "Bool", "value": ""});
									break;
								default:
									erro = 2;
									print("Tipo indefinido (linha " + (i + 1) + "): \"" + typeToSet + "\"", "\n\n", "red");

							}
							if (erro != 0) break;
							if (debug) {
								print("Variável \"" + k + "\", de tipo \"" + typeToSet + "\", declarada!", "\n", "gray");
								console.log("Variable declared: " + k);
							}
						}
						if (erro != 0) break;
						typeToSet = "";
						textToCheck = [];
					}
				}
			}
		}

		

		// Depois de encontrar o início de um algoritmo
		if (debug) console.log("Finding a command or a definition of variable: " + theCode[i]);
		if (excAlg[0] != "" && canReadCode && theCode[i][0] != "Fim") {
			let isAFunction = true; // Identificador que contém a informação sobre a linha (é ou não uma função)
			let varName = ""; // Nome da variável a ser modificada
			let varExpression = ""; // Expressão da variável a ser definida
			let algAddress = 0; // Índice do algoritmo na variável que registra os códigos.
			// Verifica se a linha contém uma função ou uma definição de variável 
			let jointCode = (theCode[i].length > 1)?theCode[i].join(" "):theCode[i][0];
			// jointCode = theCode[i].join(" ");
			if (debug) console.log("Expression to find variable or code: " + jointCode);
			for (var p = 0; p < jointCode.length - 1; p++) {
				if (hasSpecialCharacters(jointCode[p]) == "" && isAFunction) { // Obtém o nome da variável caso haja
					varName += jointCode[p];
					continue;
				}
				// if (debug) console.log("Line char 1 and 2: " + jointCode[p] + ", " + jointCode[p + 1]);
				if (jointCode[p] == "<" && jointCode[p + 1] == "-") { // Detecta a seta de declaração
					isAFunction = false;
					if (debug) console.log("Found arrow while reading line");
					algAddress = lookForObjectInArray(excCode, excAlg[0]);
					excCode[algAddress][excAlg[0]].code.push(3); // Adiciona a instrução de modificar variável à variável de código executável
					p += 1; // Adiciona um para sair da posição da seta e ir para o ínicio da expressão
					continue;
				} else if ((jointCode[p] == "(" || jointCode[p] == ")") && isAFunction) { // Detecta parentesis para definir se é a entrada de parâmetros de uma função
					break;
				} else if (jointCode[p] != " " && jointCode[p] != "") { // Verifica se não há erros de digitação (caracteres inapropriados)
					erro = 1;
					print("Erro de sintaxe ao ler nome de variável ou função (linha " + (i + 1) + "): caractere inválido \"" + jointCode[p] + "\" em \"" + jointCode + "\"", "\n\n", "red");
				}
				
				if (!isAFunction) {
					varExpression = jointCode.substr(p); break; // Soulução temporária. A solução final será verificar se há erros na expressão.
					
				}
			}

			if (erro) break;
			if (!isAFunction) {
				algAddress = lookForObjectInArray(excCode, excAlg[0]); // Índice do algoritmo na variável que registra os códigos.
				excCode[algAddress][excAlg[0]].code.push([varName, varExpression]); // Adiciona o nome da variável a ser modificada e a expressão obtida durante a leitura de uma definição de uma variável
			}
			if (isAFunction) {
			let attributes = (theCode[i].length > 1)?getAttributesFromText(theCode[i].join(" ")):getAttributesFromText(theCode[i][0]); // Lista de atributos utilizada para registrar os atributos de uma função
			if (debug) console.log(attributes);
			if (typeof(attributes) == 'string') {
				print("Erro de sintaxe (linha "+ (i + 1) + "): " + attributes.substr(6, attributes.length - 6), "\n\n", "red");
				erro = 1;
			}
			
			if (debug) console.log("Possible function: " + theCode[i][0].split("(")[0]);
			if (debug) console.log("Complete structure: " + theCode[i][0]);
			let algAddress = lookForObjectInArray(excCode, excAlg[0]); // Índice do algoritmo na variável que registra os códigos.

			switch (theCode[i][0].split("(")[0]) { // Filtra "(" para executar funções
				case "escreva":
					algAddress = lookForObjectInArray(excCode, excAlg[0]); // Índice do algoritmo na variável que registra os códigos.
					excCode[algAddress][excAlg[0]].code.push(1);
					excCode[algAddress][excAlg[0]].code.push(attributes);
					if (debug) console.log("Function 'escreva' added to '" + excAlg[0] + "', with parameters " + attributes);
					break;
				case "leia":
					algAddress = lookForObjectInArray(excCode, excAlg[0]); // Índice do algoritmo na variável que registra os códigos.
					excCode[algAddress][excAlg[0]].code.push(2);
					excCode[algAddress][excAlg[0]].code.push(attributes);
					if (debug) console.log("Function 'leia' added to '" + excAlg[0] + "', with parameters " + attributes);
					break;
				default:
					print("Função \"" + theCode[i][0].split("(")[0] + "\" indefinida");
					erro = 3;
			}
			if (erro != 0) {
				break;
			}
			}
		}

		// Procura o início do algoritmo
		if (excAlg[0] != "" && theCode[i][0].split(":")[0] == "Inicio") {
			canReadCode = true;
			if (debug) {
				print("Inicio do algoritmo \"" + excAlg[0] + "\" encontrado na linha " + (i + 1), "\n", 'gray');
				console.log("Inicio encontrado");
			}
		}

		if (excAlg[0] != "" && theCode[i][0].split(":")[0] == "Fim" && canReadCode) {
			canReadCode = false;
			print("Fim do algoritmo \"" + excAlg[0] + "\" encontrado na linha " + (i + 1), "\n\n", "gray");
			if (erro == 0) { // Adiciona o fim ao algoritmo principal
				algAddress = lookForObjectInArray(excCode, excAlg[0]); // Índice do algoritmo na variável que registra os códigos.
				excCode[algAddress][excAlg[0]].code.push(0); // Adição da instrução de término ao código executável
				if (debug) {
					console.log("Registered variables: ");
					console.log(Variables); // Escreve as variáveis no consolepara depuração
				}
			}
			// excAlg.pop();
			excAlg[0] = "";
			
		}

		// Procura por erros de sintaxe
		else if (excAlg[0] != "" && theCode[i][0] != "" && theCode[i][0] != "Algoritmo" && theCode[i][0] != "Variaveis" && !canReadCode) {
			print("Erro de sintaxe: \"" + theCode[i][0] + "\" não existe.", "\n\n", "red");
			erro = 1;
			break;
		}

		if (erro != 0) break // Para a leitura se houver erros 
	}
	if (debug && erro != 0) {
		console.log("The code array: ");
		console.log(excCode);
	}
	
	excAlg.pop(); // Limpa excAlg para executar o código
	print("Executando código");
	executePseudo();
	
	} catch(error) { // Retorna se houver erros, especialmente, no código JavaScript
		print("Erro de sintaxe", "\n", "red");
		if (debug) console.log(error);
	}
}

function print(text="", end ="\n", color="white") {
	const output = document.getElementById("output");
	var newSpan = document.createElement("span");
	newSpan.innerText = text;
	newSpan.style = "color: " + color + ";";
	output.appendChild(newSpan);
	var endNode = document.createElement("span");
	endNode.innerText = end;
	output.appendChild(endNode);
}

// Adiciona inputs que alteram "inputValue" e se destroem quando se dá o enter.
function addInput() {
	const output = document.getElementById("output");
	var newInput = document.createElement("input");
	newInput.className = "consoleInput";
	// newInput.onkeydown = "function(event){if (event.keyCode == 10) {inputValue = this.value; print(inputValue); this.remove(); interrupt = false;};}";
	newInput.addEventListener("keydown", 
		(event) => {
			if (event.code == "Enter") {
				inputValue = newInput.value;
				print(inputValue);
				newInput.remove();
				interrupt = false;
				executePseudo();
			};
		}
	);
	output.appendChild(newInput);
}

function hasSpecialCharacters(text) {
	var ret = ""
	for (var i = 0; i < text.length; i++) {
		var chr = text[i];
		var chrCode = chr.charCodeAt(0);
		// console.log(chr);
		if ((chrCode < 48 || (chrCode > 57 && chrCode < 65) || (chrCode > 90 && chrCode < 97) || chrCode > 122) && chr != "_") {ret = chr; break;}
	}
	return ret;
}

function getAttributesFromText(text) {
	let char_index = 0;
	let attributes = [""];
	while (char_index < text.length && text[char_index] != "(") {
		char_index += 1;
	}
	if (char_index == text.length) {
		return "Erro: Não foi encontrado \"(\" em \"" + text + "\"";
	}
	let stringStarter = ""; // Identificador de início de "string" nos atributos. O início de "string" é marcado por " ou '.
	let expressionStarter = "" // Mesma função do indicador acima só que com expressões. Ademais, os símbolos são acumulados aqui.
	
char_index += 1; // Adiciona 1 ao índice de leitura para não considerar a abertura dos atributos ("(") um elemento deles

	if (debug) console.log("Reading attributes in: " + text);
	// Lê os atributos para retorná-los
	while (char_index < text.length && (text[char_index] != ")" || stringStarter != "" || expressionStarter != "")) {
		// Verifica caracteres de abertura
		if (text[char_index] == "," && expressionStarter == "" && stringStarter == "") {
			attributes.push("");
			char_index += 1;
			continue;
		}
		if (text[char_index] == ")" && stringStarter == "" && expressionStarter == "") {
			break;
		}

		if (debug) console.log(text[char_index] + ", " + stringStarter + ", " + expressionStarter); // Por propósitos de depuração apenas
		if (text[char_index] != ")" || stringStarter != "" || expressionStarter != "") attributes[attributes.length - 1] += text[char_index];
		
		if ("([{".includes(text[char_index]) && stringStarter == "") { // Obtém caractere de abertura de expressão
			expressionStarter += text[char_index];
			char_index += 1;
			continue;
		}
		if (")]}".includes(text[char_index]) && expressionStarter.length > 0 && stringStarter == "") { // Obtém o término da expressão aberta
			expressionStarter = expressionStarter.substr(0, expressionStarter.length - 1);
			char_index += 1;
			continue;
		}

		if ("\"\'".includes(text[char_index]) && stringStarter == "") { // Encontra a abertura de "strings".
			stringStarter = text[char_index];
			char_index += 1;
			continue;
		}
		if (text[char_index] == stringStarter) { // Procura o término de uma "string". Ele desconsidera \" e \'.
			if (debug) ;
			if (char_index > 1 && text[char_index - 1] == "\\") { // Se a posição do leitor (char_index) for menor que dois, provavelmente não haverá probabilidade da string ser \\" ou \\'
				if (text[char_index - 2] == "\\") { // Verifica se não é \\ ao invés de \" ou \'
					stringStarter = "";
					char_index += 1;
					continue;
				}
			} else {
				// console.log("Ending String");
				stringStarter = "";
				char_index += 1;
				continue;
			}
		}

		// attributes[attributes.length - 1] += text[char_index];
		
		char_index += 1;
	}
	if (debug) console.log("Attributes found: " + attributes);
	return attributes;
}

function lookForObjectInArray(arr, obj) {
	let index = -1;
	let counter = 0;
	arr.some(elm => {
		if (elm[obj]) index = counter;
		counter++;
	});
	return index;
}

// Filtra comandos javascripts e variáveis internas para a evaluação da expressão passada
function filterEvaluate(expression) {
	let modifiedExpression = ""; // Expressão a ser calculada
	let specialName = ""; // Nomes especiais, como o de variáveis, para substituir o valor durante a evaluação
	let stringStarter = "";
	// Funções internas. Índice par, incluindo zero, função do pseudo código, índice ímpar, tradução para JavaScript.
	const builtInFunctions = ["min", "Math.min", "max", "Math.max", "Int", "parseInt", "Real", "parseFloat", "abs", "Math.abs", "arrendondar", "Math.round", "raiz", "Math.sqrt", "potencia", "Math.pow", "PI", "Math.PI", "pi", "Math.PI", "Pi", "Math.PI", "versao", "\"1.0.0\"", "desenvolvedor", "\"Pablo BC\"", "theOldCommodore", "\"The Big 64!\"", "avaliar", "filterEvaluate"];
	for (var i = 0; i < expression.length; i++) {
		if (expression[i] == stringStarter) { // Procura o término de uma "string". Ele desconsidera \" e \'.
			
			if (i > 1 && expression[i - 1] == "\\") { // Se a posição do leitor (char_index) for menor que dois, provavelmente não haverá probabilidade da string ser \\" ou \\'
				if (expression[i - 2] == "\\") { // Verifica se não é \\ ao invés de \" ou \'
					modifiedExpression += stringStarter;
					stringStarter = "";
					i += 1;
					continue;
				}
			} else {
				// console.log("Ending String");
				modifiedExpression += stringStarter;
				stringStarter = "";
				i += 1;
				// console.log(i);
				if (i >= expression.length) break;
				continue;
			}
		}
		if (stringStarter != "") {
			modifiedExpression += expression[i];
			continue;
		}
		if (hasSpecialCharacters(expression[i]) == "" && stringStarter == "" && i < expression.length - 1) { // Verifica se é um nome/número ou operação. Para evitar, também, que o último caractere da expressão seja perdido, é verificado o fim da expressão
			specialName += expression[i];
		} else {
			// Verifica se está no fim da expressão para adicionar o último caractere
			if (hasSpecialCharacters(expression[i]) == "" && i >= expression.length - 1) specialName += expression[i];

			// Verifica se é uma função interna (palavra reservada)
			let buildInIndex = builtInFunctions.findIndex((x) => x == specialName);
			if (buildInIndex >= 0 && (buildInIndex & 1) == 0) {
				modifiedExpression += builtInFunctions[buildInIndex + 1];
				if (debug) console.log("Found built in function \"" + builtInFunctions[buildInIndex] + "\" that is \"" + builtInFunctions[buildInIndex + 1] + "\" in JavaScript.");
				specialName = "";
			}
			// Verifica se é uma variável ou um número
			else if (isNaN(Number(specialName))) {
				const findIndexCondition = (exp) => exp.name == specialName; // Condição para realizar a comparação do valor de "specialName" com o nome das variáveis registradas.
				
				let variableIndex = (Variables.findIndex(findIndexCondition));
				// console.log(variableIndex); // Teste
				if (variableIndex >= 0) {
					switch (Variables[variableIndex].type) { // Verifica o tipo da variável para adicionála apropriadamente
						case "Int": 
							modifiedExpression += parseInt(Variables[variableIndex].value);
							break;
						case "Real": 
							modifiedExpression += parseFloat(Variables[variableIndex].value);
							break;
						case "String": 
							modifiedExpression += "\"" + Variables[variableIndex].value + "\"";
							break;
						case "Bool": 
							modifiedExpression += Variables[variableIndex].value == true;
							break;
						default:
							erro = 2;
							print("Tipo da variável \"" + Variables[variableIndex].name + "\" irreconhecível: " + Variables[variableIndex].type, "\n\n", "red");
							return 0;
					}
					specialName = ""; // Limpa o nome para evitar repetições
				
				} else {
					if (isNaN(Number(specialName[0]))) { // Verifica se começa com número ou letra para determinar se é uma variável inexistente ou um valor equivocado
						print("Variável \"" + specialName + "\" inexistente.", "\n\n", "red");
					} else {
						print("Valor \"" + specialName + "\" irreconhecível.", "\n\n", "red");
					}
					erro = 4;
					return 0;
				}
			} else {
				modifiedExpression += specialName;
				specialName = ""; // Limpa o nome para evitar repetições
			}
			if (expression[i] == " ") {
				continue;
			} else if ("+-(*),.[/]{}".includes(expression[i])) { // Verifica se o caractere de "expression" na posição "i" é uma operação ou um ponto matemático.
				modifiedExpression += expression[i]; // Adiciona operações básicas
			} else if ("\"'".includes(expression[i]) && stringStarter == "") { // Verifica se é o início de uma "string"
				stringStarter = expression[i];
				modifiedExpression += stringStarter;
			}
		}
	}
	if (debug) {
		console.log("Original expression for eval: " + expression);
		console.log("Modified expression for eval: " + modifiedExpression);
	}
	modifiedExpression = eval(modifiedExpression); // Atribui o resultado a uma veriável já existente para a verificação de casos especiais, como "Infinity".
	if (modifiedExpression == "Infinity") return "Infinito";
	// else if (modifiedExpression == "NaN") return "NaoDef";
	else return modifiedExpression;
};
