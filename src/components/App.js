import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import web3 from 'web3';
import evidence from '../abis/evidence.json';
// Added this new Library ipfs-api
const ipfsAPI = require('ipfs-api');
// New code according to ipfs-api
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})
var memeHash=0;
var memeHashes=[];
/******** you need to take a unique id which would be given to us whenever someone is redirected to website****** */
var unique_id=0;//store that unique id here
memeHashes[0]=unique_id;
var pointer_memeHashes=1;//this pointer is for memeHashes array
class App extends Component {

  constructor(props){
    super(props); 
    this.state ={
      account:'',
      buffer: null,
      contract:null,
    };
  }
  /*async loadWeb3(){
    if(window.ethereum){
      window.web3=new web3(window.ethereum)
      await window.ethereum.enable()
    }if (window.web3){
      window.web3 = new web3(window.web3.currentProvider)
    }else{
      window.alert('please use wallet');
    }
  }*/
  
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
        console.log("click on submit")
      })
    }
  }
  /*on submit code*/
  onSubmit=(event)=>{
    console.log("we are here")
    console.log(memeHash)
    event.preventDefault()
    //you need to call set function smart contract where you will give memeHash in string 
    //and it will return index of that hash in Integer shore that in memehashes array
  }
  onDone=(event)=>{
      //here you need to call done method and send the memeHashes array 
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            semil ipfs 
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrop d-none d-sm-none d-sm-block"></li>
            <small className="text-white">{this.state.account}</small>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a>
                  <img src={'http://ipfs.io/ipfs/Qme8KvWTgE6bvBGMzR6pGXYaWN1FpMRgaw66FrNyp2mMzB'} className="App-logo" />
                </a>
                <p>&nbsp;</p>
                <h2>upload evidence</h2>
                <form onSubmit={this.onSubmit}>
                <div className="submit">
                  <input type='file' onChange={this.captureFile} />
                  <input type='submit' onChange={this.onSubmit}/>
                  </div>
                  <div className="button">
                  <button type="submit" value="Submit">Done</button>
                  </div>
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
