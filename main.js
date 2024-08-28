// Seleciona os elementos do form
const form = document.querySelector('form');
const amount = document.querySelector('#amount');
const expense = document.querySelector('#expense');
const category = document.querySelector('#category');

//Seleciona os elementos da lista
const expenseLista = document.querySelector("ul");
const expenseQuantidade = document.querySelector("aside header p span");
const expenseTotal = document.querySelector("aside header h2");

//Captura evento de input para formatar o valor.
amount.oninput = () => {
    //Obtém o valor atual do input e remove os caracteres não númericos
    let valor =  amount.value.replace(/\D/g, "")
    //Transformar em centavos
    valor = Number(valor)/100
    //Atualiza o valor do input
    amount.value = formatCurrencyBRL(valor);
}

//Converte para moeda local
function formatCurrencyBRL(value){
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })

    return value;
}

//ação do botão adicionar despesa
form.onsubmit = (event) => {
    event.preventDefault();
    //cria o novo objeto
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }
    //chama a função que adiciona o objeto
    expenseAdd(newExpense);
}

//adiciona um novo metodo na lista
function expenseAdd(newExpense){
    try {
        //cria o elemento li para adicionar na lista
        const expenseItem  = document.createElement("li")
        expenseItem.classList.add("expense")

        //cria icone da categoria
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        //cria a info da despesa
        const expenseInfo =  document.createElement("div")
        expenseInfo.classList.add("expense-info")

        //cria o nome da despesa
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense;

        //cria a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name;

        //adiciona nome e categoria na div de informações desoesa
        expenseInfo.append(expenseName, expenseCategory)

        //cria valor da despesa
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

        //cria o icone de remover
        const expenseRemove = document.createElement("img")
        expenseRemove.classList.add("remove-icon")
        expenseRemove.setAttribute("src", `img/remove.svg`)
        expenseRemove.setAttribute("alt", "Remover")

        //adiciona informação do item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, expenseRemove);

        //adiciona o item na lista
        expenseLista.append(expenseItem);

        //limpa o formulario para add items
        formClear();

        //chama função totais
        updateTotal();

    } catch (error) {
        alert("Não foi possível atualizar a lista de despesas.")
        console.log(error)
    }
}

//atualiza quantidade de despesas e total
function updateTotal(){
    try {
        //Recupera todos itens da li da ul
        const items = expenseLista.children

        //Atualiza a quantidade dos itens da lista
        expenseQuantidade.textContent = `${items.length} ${items.length > 1 ? "despesas": "despesa"}`
        
        //variavel para incrementar o total
        let total = 0

        //percorre o items li da lista ul
        for(let item = 0; item < items.length; item++){
            const itemAmount = items[item].querySelector(".expense-amount")
            
            //Remove caracteres não numericos e substitui a virgula pelo ponto
            let valor = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")
            
            //convert o valor para float
            valor = parseFloat(valor)

            //verifica se é numero valido
            if(isNaN(valor)){
                return alert("Não foi possivel calcular o total. o valor não parece ser um número.")
            }
            
            //incrementa o valor total
            total += Number(valor)
            
        }
        
        // Cria a span pra adicionar o R$ formatado
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        // Formata o valor e remove o R$ que será exibido pela small com um estilo customizado
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        // Limpa o conteúdo do elemento
        expenseTotal.innerHTML = ""

        // Adiciona o símbolo da moeda e o valor total formatado
        expenseTotal.append(symbolBRL, total)

    } catch (error) {
        console.log(error)
        alert("Não foi possicel atualizar os Totais.")
    }
}

//Evento que captura o clique nos itens da lista
expenseLista.addEventListener('click', function(event) {
    //verificar se é o item
    if(event.target.classList.contains('remove-icon')) {
        //obtem o li pai do elemento clicado
        const item = event.target.closest('.expense')
        //remove item da lista
        item.remove()
    }
    //atualiza os totais
    updateTotal()
})

function formClear() {
    expense.value = ""
    category.value = ""
    amount.value = ""

    expense.focus();
}