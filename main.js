// implémente la librairie crypto-js
const SHA256 = require('crypto-js/sha256');


class transactions{
    constructor(fromAddress, toAddress, Amount){
        this.fromAddress = fromAddress ;
        this.toAddress = toAddress ;
        this.Amount = Amount ; 

    }
}


//définit ce qu'est un block  
class Block{
    constructor (timestamp, transactions, previousHash=''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculHash();
        this.nonce = 0;
    } 
    // calcul le hash du bloc
    calculHash(){
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data)+ this.nonce).toString();
    }

    Blockmining(Cooldown){
        while(this.hash.substring(0,Cooldown)!== Array(Cooldown + 1).join("0")){
            this.nonce++; 
            this.hash = this.calculHash();
        }

        console.log("test de minage : " + this.hash);
    }
}

class Blockchain{
        //chaque chaine créé commence automatiquement par un block "génèse" dont l'index est 0  
    constructor(){
        this.chain = [this.creationGenesisBlock()]; 
        this.Cooldown = 2;
        this.cooldownTransactions = [] ;
        this.Reward = 150;   
    }
        // fonction de création du block génèse
    creationGenesisBlock(){
        return new Block("01/01/2020", "GenesisBlock", "0");
    }
    
        // fonction pour trouver le dernier block créé 
    getBlockRécent(){
        return this.chain[this.chain.length - 1]; 
    }
                                                    //ancienne méthode
        
    //ajouterBlock(newBlock){
        //newBlock.previousHash = this.getBlockRécent().hash; 
        //newBlock.Blockmining(this.Cooldown);
        //this.chain.push(newBlock);
    
                                                    // nouvelle méthode
        
    cooldownedTransactionsMining(rewardAddress){
        let block = new Block(Date.now() ,this.cooldownTransactions) ;
        block.Blockmining (this.Cooldown);

        console.log("minage du block réussi");
        this.chain.push(block);

        this.cooldownTransactions =[
            new transactions(null , rewardAddress , this.Reward)
        ];
    }

    createTransaction(transaction){
        this.cooldownTransactions.push(transaction);

    }

    getBalanceOfaddress(address){
        let Balance = 0;

        for(const Block of this.chain){
            for(const trans of Block.transactions){
                
                if (trans.fromAddress === address){
                    Balance -= trans.Amount ;
                }

                if (trans.toAddress === address){
                    Balance += trans.Amount ;
                }
                

            }
        }
        return Balance ;
    }




        //fonction pour voir si la chaine est valide = non modifié
    validationChain(){
       for(let i = 1; i < this.chain.length; i++){
           const currentBlock = this.chain[i];
            
           if(currentBlock.hash !== currentBlock.calculHash()){
               return false;
           } 
           const previousBlock = this.chain[i - 1]; 
           
           if(currentBlock.previousHash !== previousBlock.hash){
            return false;
           }
        }
        return true;
    }
}

 // création d'une nouvelle Blockchain    
let Test1 = new Blockchain();
Test1.createTransaction(new transactions('address1', 'address2', 100))
Test1.createTransaction(new transactions('address2', 'address1', 10))

console.log('début du minage')
Test1.cooldownedTransactionsMining('Vic-address');

console.log('la balance de vic est :' , Test1.getBalanceOfaddress('Vic-adress'))

console.log('début du minage')
Test1.cooldownedTransactionsMining('Vic-address');

console.log('la balance de vic est :' , Test1.getBalanceOfaddress('Vic-adress'))
//console.log('minage du block 2')
//Test1.ajouterBlock(new Block(2, "12/03/2020", {amount: 6})) ; 

// test dans terminal de création et Validation
//console.log('validé ? ' + Test1.validationChain()); 
//console.log(JSON.stringify(Test1, null, 4))