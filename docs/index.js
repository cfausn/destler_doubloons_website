var abi = require('../')
var contractAddress = '0x045129CBA354A107eCEb686300DABe2BdEe6e453' // Destler Doubloons!
var is_rit_field
var token
var addr
//var id_token

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3 = new Web3(web3.currentProvider);
  } else {
    console.log('No web3? You should consider trying MetaMask!')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    web3 = new Web3(new Web3.providers.HttpProvider("http://destler-doubloons.com/"));
  }

  token = web3.eth.contract(abi).at(contractAddress)
  // Now you can start your app & access web3 freely:
  //startApp()
  id_token = ""
})

window.onload = function(){

  token.totalSupply.call(function(err, supply){
    document.getElementById("total").innerHTML = numberWithCommas(supply)
  })

  token.circulatingSupply.call(function(err, supply){
    document.getElementById("circulating").innerHTML = numberWithCommas(supply)
  })

  token.next_giveaway.call(function(err, supply){
    document.getElementById("giveaway").innerHTML = numberWithCommas(supply)
  })

  is_rit_field = document.getElementById("is_RIT");
  document.getElementById("click").onclick = startApp;

}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function printID(x){
  console.log(x)
}

function startApp(){
  addr = web3.eth.accounts[0]

  //id_token
  // Now to write a tx to the blockchain:
  if(id_token != ""){

    console.log("CLICKED");
    token.getFromFaucet(id_token, function (err, hash) {
      if (err){
        is_rit_field.innerHTML = "Problem sending tokens."
        return console.error('Problem sending tokens', err)
      }
      console.log('tokens transferred in tx with hash', hash)
      is_rit_field.innerHTML = '<a color="#fff" href="https://etherscan.io/tx/' + hash + '">Doubloons sent, click here to see transaction!</a>'

      // Now we poll for tx inclusion:
      var interval = setInterval(function() {
        web3.eth.getTransactionReceipt(hash, function (err, receipt) {
          if (err) return console.error('error getting receipt', err)

          console.log('tx receipt is:')
          console.dir(receipt)

          clearInterval(interval)
        })
      }, 1000)

    })
  }
}
