## Abstract

Fun little project which takes an existing project to do image classification dataset labelling, and transforms it into:

1. using decentralized protocols to store your datasets in a secure private way
2. a dataset market (soon to come) where you can purchase datasets that other people have annotated.
   a. There is a review system by which people's datasets can be reviewed so you can gain some trust in somebody's dataset labelling + collection.

## Techs used

- IPFS for dataset storage
- Metamask for dataset encryption + decryption
- Built on the EVM for actual dataset ownership tracking + purchasing. Using solidity.
- UUPS upgradable contract for initial deployment. Can transfer ownership until things are stable, and then will implement a contract that is no longer upgradable.

Frontend built with tailwind, Next.js, React, Typescript.

## Guide to install/start running

1. install foundry.

- `curl -L https://foundry.paradigm.xyz | bash` and then `foundryup`

2. get the right version of nvm/npm etc

- nvm=20.9.0 // can do something like `nvm install 20` and `nvm use 20`
- npm=10.1.0

3. boot up your backend:

- in tab number 1, open up anvil with `anvil`

- in another tab, from the root dir (ie `datamarket`) run:

```
forge script script/DeployDataMarket.s.sol --rpc-url http://127.0.0.1:7545 --broadcast --private-key {GET_ANY_PRIVATE_KEY_FROM_ANVIL}
```

Note it's ok to expose private key here ONLY because private key is a default anvil one and won't hold real funds.

- go to metamask, add the network of http://127.0.0.1:7545 with a chainid of 31337 and symbol of ETH.
- add the metamask wallet by importing new wallet with PK=PK you used above

4. open up your frontend. from the frontend dir (ie `datamarket/datamarket`) run:
   `npm run dev`. Then go to `http://localhost:3000`.
