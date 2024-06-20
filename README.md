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
