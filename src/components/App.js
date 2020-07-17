 import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import web3 from 'web3';
import evidence from '../abis/evidence.json'
// Added this new Library ipfs-api
const ipfsAPI = require('ipfs-api');
var memeHash=0;
// New code according to ipfs-api
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

class App extends Component {
 async componentWillMount(){
   await this.loadWeb3()
   await this.loadBloackchainData()
 } 
 async loadBloackchainData(){
   const web3 =window.web3
   const accounts = await web3.eth.getAccounts()
   this.setState({account:accounts[0]})
   const networkId = await web3.eth.net.getId()
   const networkData = evidence.networks[networkId]
   if(networkData){
      const abi=evidence.abi
      const address=networkData.address
      const contract = web3.eth.Contract(abi,address)
    this.setState({contract : contract})
    const memeHash = await contract.methods.get().call()
    this.setState({memeHash}) 
   }else{
     window.alert("smart contract not deployed in this network")
   }
 }
  constructor(props){
    super(props); 
    this.state ={
      account:'',
      buffer: null,
      contract:null,
      memeHash:"QmPRDLVE4ghc8HPeSA9sNRWwtoEvkZS95AxbApzufrd8VF"
    };
  }
  async loadWeb3(){
    if(window.ethereum){
      window.web3=new web3(window.ethereum)
      await window.ethereum.enable()
    }if (window.web3){
      window.web3 = new web3(window.web3.currentProvider)
    }else{
      window.alert('please use wallet');
    }
  }
  
  captureFile = (event)=>{
    event.preventDefault()
    //processing file for ipfs i.e converting into buffer
    const file=event.target.files[0]
    //console.log(file)
    const reader= new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = ()=>{
      this.setState({
        buffer:Buffer(reader.result)
      })
      const bufferfile= Buffer(reader.result)
      // Uploading File Code
      // Ive written code to upload file to the IPFS here itself
      ipfs.files.add(bufferfile, function (err, file) {
        if (err) {
          console.log(err);
        }
        // This will print the hash
        memeHash=file[0].hash
      this.state.contract.methods.set(memeHash).send({from: this.state.account }).then((r)=>{
          this.setState({memeHash})
        })
        console.log("click on submit")
      })
    }
    this.setState({memeHash: memeHash})
  }
  onSubmit=(event)=>{
    console.log("we are here")
    console.log(memeHash)
    // To Get the file uploaded
    // This is how you can view the file 
    // https://ipfs.io/ipfs/QmPRDLVE4ghc8HPeSA9sNRWwtoEvkZS95AxbApzufrd8VF
    // Above is the example of file i uploaded through IPFS capturefile function
    //const validCID = 'QmPRDLVE4ghc8HPeSA9sNRWwtoEvkZS95AxbApzufrd8VF'

    //ipfs.get(validCID, function (err, files) {
       //  files.forEach((file) => {
        //  console.log(file.path)
          //console.log(file.content.toString('utf8'))
        //})
      //})
      event.preventDefault()
    // const getToken = async () => {
    // for await (const file of ipfs.add(urlSource('https://ipfs.io/images/ipfs-logo.svg'))) {
    // console.log(file) }
    // };
    // getToken()
    // event.preventDefault()
    // ipfs.add(urlSource('https://ipfs.io/images/ipfs-logo.svg'),(error,result)=>{
      
    //   console.log('ipfs result',result)
    //   console.log("submitting the form...")
    //   if(error){
    //     console.error(error)
    //     return
    //   }
    // })
    
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            semil ipfs 
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrop d-none d-sm-none d-sm-block"></li>
            <small className="text-white">{this.state.account}</small>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={'https://ipfs.io/ipfs/'+this.state.memeHash} className="App-logo" />
                </a>
                <p>&nbsp;</p>
                <h2>upload evidence</h2>
                <form onSubmit={this.onSubmit}>
                  <input type='file' onChange={this.captureFile} />
                  <input type='submit' onChange={this.onSubmit}/>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
