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
    } 
    // calcul le hash du bloc
    calculHash(){
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data)).toString();
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.creationGenesisBlock()]; 
         
    }
    creationGenesisBlock(){
        return new Block(0, "01/01/2020", "GenesisBlock", "0");
    }
    
    
    getBlockRécent(){
        return this.chain[this.chain.length - 1]; 
    }

        
    ajouterBlock(newBlock){
        newBlock.previousHash = this.getBlockRécent().hash; 
        newBlock.hash = newBlock.calculHash(); 
        this.chain.push(newBlock);
    }
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

let Test1 = new Blockchain();
Test1.ajouterBlock(new Block(1, "10/02/2020", {amount: 3})) ;
Test1.ajouterBlock(new Block(2, "12/03/2020", {amount: 6})) ; 

console.log('validé ? ' + Test1.validationChain());   

//console.log(JSON.stringify(Test1, null, 4))