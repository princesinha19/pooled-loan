Pooled Loan: DeFi Chit Fund
===========================
 <img src="https://github.com/princesinha19/pooled-loan/blob/master/src/assets/logo.png" height="150" width="300">
 
This project uses a factory contract to spawn new loan pools. This combines a browser-based frontend with the ethereum smart contract using web3.js. Anyone can create the pool using the form on the application. During the creation of the pool, the pool creator needs to fill in the necessary details and, need to choose the lending pool between Aave & Mstable. Based on the choice, a new smart contract will get generated using the factory contract. The details of the pool will get stored on the graph using the-graph SDK. The participants will be able to join any chit fund pool available to participate from the frontend. They need to deposit the collateral amount and, the collateral will generate a yield from the lending platforms (Aave or Mstable). 
The loan auction will start once at least 2 participants will join the pool. During the auction, the participant can bid the amount to win the loan if they want. The number of the auction will depend upon the total number of participants in the pool. The highest bidder will be able to claim the loan, once the auction period will be over. The loan amount will be equal to the loan amount - bid amount (the loan amount is also equal to the collateral deposited at the beginning). The bid amount will remain stored on the lending pool and it will get distributed among all the participants with yield generated from lending pools after all auctions. The advantage of this approach is that the last participant gets the loan interest free and on top of that earns interest on the collateral. The interest paid by other borrowers is used to earn an additional interest which is also distributed among all the participants.

Demo Video
==========
[![youtube_video](https://img.youtube.com/vi/x3KVD3sJVVo/0.jpg)](https://youtu.be/x3KVD3sJVVo) 

Running Project Locally
=======================
1. Prerequisites: Make sure you've installed [Node.js] ≥ 12 and [Rust with correct target][Rust]
2. Install dependencies: `yarn install`
3. Run the local development server: `yarn start` (see `package.json` for a
   full list of `scripts` you can run with `yarn`)
