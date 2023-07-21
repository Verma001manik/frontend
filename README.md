# Introduction
In this project we have created few functions in the solidity programming language and used javascript to display all the functions to the frontend .

# Description 
In this project we created few functions in the solidity programming language to interact with them using the frontend model . 
There were lot of things involved in getting this project done. This project was done for the course listed in the metacrafters platform . 

# Getting Started


After cloning the github, you will want to do the following to get the code running on your computer.

1. Inside the project directory, in the terminal
```
npm i
```
   
2. Open two additional terminals in your VS code
3. In the second terminal type:
```
npx hardhat node
```
4. In the third terminal, type:
```
npx hardhat run --network localhost scripts/deploy.js
```
You will get some output like this :
```
Compiled 1 Solidity file successfully
A contract with balance of 1 eth deployed to 0x00000000000000000000000000
```
5. Paste the contract address in the index.js file . 

5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/

Play around and add your own functions to get better understanding of the code and the technology used behind it . 

# License 
This project was licensed under MIT.
