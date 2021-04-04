const modal = {
    open(){
        //abrir modal
        //adicionar a class active ao modal
        document
            .querySelector('.modalOverlay')
            .classList
            .add('active')
    },
    close(){
        //fechar o modal
        //remover a class active modal
        document
            .querySelector('.modalOverlay')
            .classList
            .remove('active')
    }
}

//pegar informaçoes das transaçoes e guarda
const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finance:transactions")) ||
        []

    },

    set(transactions){
        localStorage.setItem("dev.finance:transactions",
        JSON.stringify(transactions))
    },
}

const Transaction = {
    //refatorando
    all: Storage.get(),

    //transactions,
    add(transaction){
        Transaction.all.push(transaction)
        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)
        App.reload()
    },

    incomes(){
        //somar as entradas
        //pegar todas transaçoes verificar 
        let income = 0;

        //para cada transação
        Transaction.all.forEach(transaction => {
            //se ela for maior que zero
            if (transaction.amount > 0) {
                //soma a uma variavel e retornar a variavel
                income += transaction.amount;
                
            }
        })
        return income;
    },

    expenses(){
        //somar as saidas
        //pegar todas transaçoes verificar 
        let expense = 0;

        //para cada transação
        Transaction.all.forEach(transaction => {
            //se ela for menor que zero
            if (transaction.amount < 0) {
                //soma a uma variavel e retornar a variavel
                expense += transaction.amount;
                
            }
        })
        return expense;
    },

    total(){
        return Transaction.incomes() + Transaction.expenses()
    }
}

//Substituir os dados do html(trasaçoes) com os dados do java script
const DOM = {
    //contem as tres entradas de dados
    transactionsContainer: document.querySelector('#data-table tbody'),

    //responsavel por adicionar as trasaçoes
    addTransaction(transaction, index) {
        
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
       // console.log(tr.innerHTML)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
    },

    //função que substitui o modelo de trasaçoes do htmltransaction.add is not a function
    innerHTMLTransaction(transaction, index){

        //variavel para condição de entrada e saida
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.descreption}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick= "Transaction.remove(${index})" src="./assets/minus.svg" alt="remove transação">
            </td>
        `
        return html
    },

    updateBalance(){
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency( Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency( Transaction.total())        
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {

    formatAmount(value){
        value = Number(value.replace(/\,\./g, "")) * 100
        
        return value
    },

    //formatando data
    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
        
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR",{
            style: "currency",
            currency: "BRL"
        })
        
        return signal + value
    }
}

//captura de dados do formulario
const Form = {

    //conexao java scrip e html 
    descreption: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    //objeto com os valores
    getValues(){
        return{
            descreption: Form.descreption.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields(){
        //
        const {descreption, amount, date} = Form.getValues()

        //se campos estiverem vazios
        if (descreption.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
                throw new Error("Por favor preencha todos os dados")
        }
    },


    formatDataValues(){
        let {descreption, amount, date} = Form.getValues()
        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return{
            descreption,
            amount,
            date
        }
    },

    //salvando transação
    saveTransaction(transaction){
        Transaction.add(transaction)
    },

    //apaga dados do formulario
    clearFields(){
        Form.descreption.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()
        try {
        
        Form.validateFields()
            
        const transaction = Form.formatDataValues()
        
        Form.saveTransaction(transaction)

        Form.clearFields()

        //fecha modal
        modal.close()
        

       // App.reload()

        //verificar se todas as informaçoes foram preenchidas
        //formatar os dados pra salvar
        //salvar
        //apagar os dados do formulario
        //fechar modal
        //atualizar a aplicaçao

        } catch (error) {
            alert(error.message)
        }
       
    }
}



const App = {
    init(){
        //array que para cada elemnto faz uma funcionalidade
        Transaction.all.forEach((transaction, index) =>{
            DOM.addTransaction(transaction, index)
        })
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
        
    },
    reload(){
        DOM.clearTransactions()
        App.init()
    },
}

App.init()