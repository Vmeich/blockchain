// implémente la librairie crypto-js
const SHA256 = require('crypto-js/sha256');

//définit ce qu'est un block  
class Block{
    constructor (index, timestamp, data, previousHash=''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
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
        this.Cooldown = 5; 
    }
        // fonction de création du block génèse
    creationGenesisBlock(){
        return new Block(0, "01/01/2020", "GenesisBlock", "0");
    }
    
        // fonction pour trouver le dernier block créé 
    getBlockRécent(){
        return this.chain[this.chain.length - 1]; 
    }

        
    ajouterBlock(newBlock){
        newBlock.previousHash = this.getBlockRécent().hash; 
        newBlock.Blockmining(this.Cooldown);
        this.chain.push(newBlock);
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

console.log('minage du block 1')
Test1.ajouterBlock(new Block(1, "10/02/2020", {amount: 3})) ;
console.log('minage du block 2')
Test1.ajouterBlock(new Block(2, "12/03/2020", {amount: 6})) ; 

// test dans terminal de création et Validation
//console.log('validé ? ' + Test1.validationChain()); 
//console.log(JSON.stringify(Test1, null, 4))