require("@nomiclabs/hardhat-waffle");

module.exports = {
  defaultNetwork: "goerli",
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/BGMUa_1WmCtJOB6vsHYHyvQeJZMmVyRY",
      accounts: [
        "86f4c286c4ccdaf4b49a884237316306d2f2a707f6a7b9e823d6c363a6e36e40",
      ],
    },
  },
};
