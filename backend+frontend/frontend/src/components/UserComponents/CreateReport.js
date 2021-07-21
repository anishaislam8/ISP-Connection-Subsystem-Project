import React from 'react'
import axios from 'axios'
import _ from 'lodash';
import { Link , NavLink } from 'react-router-dom';
import { Form, Button, Modal } from 'react-bootstrap';
import * as AiIcons from 'react-icons/ai';
import * as GoIcons from 'react-icons/go';
import UserHeader from './Header';




class UserCreateReport extends React.Component{
    constructor(props){
        super(props);
        this.state={
            user_id : "",
            name : "",
            users : [],
            unions:[],
            areas:[],
            user:"",
            user_areas:[],
            user_isps:[],
            category:"", //option
            area_id:"", //option
            isp_id:"", //option
            isps:[],
            problemCategoryError:"", //error
            provideDetailsError:"", // error
            areaError:"", // error
            ispError:"", // error
            details:"",//option
            modalTitle : "",
            modalBody:"",
            contracts:[],
            done:false

        }

        this.handleChangeProblemCategory =this.handleChangeProblemCategory.bind(this);
        this.handleChangeArea = this.handleChangeArea.bind(this);
        this.handleChangeISP = this.handleChangeISP.bind(this);
        this.handleChangeDetails = this.handleChangeDetails.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getUser = this.getUser.bind(this);
        this.getUserName = this.getUserName.bind(this);
        this.getISP = this.getISP.bind(this); //gives name
        this.getUnion= this.getUnion.bind(this); //gives name
        this.getArea= this.getArea.bind(this); //gives name
        this.handleClose = this.handleClose.bind(this);

    }

    componentDidMount(){

        let apiUrl = "http://localhost:7000/api/union";
        axios.get(apiUrl)
        .then(response => {
            this.setState({ unions: response.data.data })
        })
        .catch((error) => {
          console.log(error);
        })

        apiUrl = "http://localhost:7000/api/area";
        axios.get(apiUrl)
        .then(response => {
            this.setState({ areas: response.data.data })
        })
        .catch((error) => {
          console.log(error);
        })

        apiUrl = "http://localhost:7000/api/isp";
        axios.get(apiUrl)
        .then(response => {
            this.setState({ isps: response.data.data })
        })
        .catch((error) => {
          console.log(error);
        })
        

         apiUrl = "http://localhost:7000/api/user";
        axios.get(apiUrl)
        .then(response => {
           
            this.setState({ users: response.data.data , name : this.props.location.state.data})
        })
        .catch((error) => {
          console.log(error);
        })

       


        apiUrl = "http://localhost:7000/api/userContracts";
        axios.get(apiUrl)
        .then(response => {
            this.setState({ contracts: response.data.data, user_id : this.props.location.state.id }, () => {
            
                let newcontracts = this.state.contracts.filter((contract) => contract.user_id.toString() === this.state.user_id);
      
                let user = this.getUser(this.state.user_id);
             
                this.setState({
                    user,
                    user_areas : [... new Set(newcontracts.map((contract) => contract.area_id))],
                    user_isps : [... new Set(newcontracts.map((contract) => contract.isp_id))],
                });
                
            })
        })
        .catch((error) => {
          console.log(error);
        })

        
    }

    getUserName = (user_id) => {
       

        for(let i = 0; i < this.state.users.length; i++){
            if(this.state.users[i]._id.toString() === user_id){
                
                return this.state.users[i].name
            }
        }
    }

    getUser(user_id){
        for(let i = 0; i < this.state.users.length; i++){
            if(this.state.users[i]._id.toString() === user_id){
                //console.log("hit");
                return this.state.users[i]
            }
        }
    }

    getISP(isp_id){
        for(let i = 0; i < this.state.isps.length; i++){
            if(this.state.isps[i]._id === isp_id){
                //console.log("hit");
                return this.state.isps[i].name
            }
        }
    }

    getUnion(union_id){
        //console.log(this.state.unions.length);
        for(let i = 0; i < this.state.unions.length; i++){
            if(this.state.unions[i].union_id === union_id){
                //console.log("Here ",this.state.unions[i]);           
                return this.state.unions[i].name
            
            }
        }
    }

    getArea(area_id){ // no toString()
        //console.log(this.state.areas.length);
       
        for(let i = 0; i < this.state.areas.length; i++){
            if(this.state.areas[i]._id === area_id){
                //console.log("Here ",this.state.areas[i]);           
                return this.state.areas[i].name
            
            }
        }
    }

    
    handleSubmit(e){
        e.preventDefault();
        if(!this.state.category){
            this.setState({
                problemCategoryError:"Please select a problem category"
            })
        }
        if(!this.state.isp_id){
            this.setState({
                ispError:"Please select an ISP"
            })
        }
        if(!this.state.area_id){
            this.setState({
                areaError : "Please provide an area name"
            })
        }
        if(!this.state.details.trim()){
            this.setState({
                provideDetailsError : "Please provide details of the problem you are facing"
            })
        }
        if(this.state.category && this.state.isp_id && this.state.area_id && this.state.details.trim()){

            let apiUrl = "http://localhost:7000/user/reports";
            let object = {
                user_id : this.state.user_id,
               
                isp_id : this.state.isp_id,
                area_id : this.state.area_id,
                category : this.state.category,
                details : this.state.details
            }
            axios.post(apiUrl, object)
            .then(response => {
                if(response.data.data.length === 0){
                    // problem submitting the report
                    this.setState({
                        modalTitle:"Error",
                        modalBody:"There was an error while submitting the report, please try again!"
                    }, () => {
                        this.setState({
                            done:true
                        })
                    })
                }
                else {
                    // clear all inputs and open modal
                    this.setState({
                        
                        area_id : "",
                        category : "",
                        details : "",
                        isp_id :"",
                        problemCategoryError:"",ispError:"",provideDetailsError:"",areaError:"",
                        modalTitle:"Success",
                        modalBody:"Your report has been sent to ISP"
                    }, () => {
                        this.setState({
                            done:true
                        })
                    })
                }
            })
            .catch((error) => {
            console.log(error);
            })
           
        }
    }

    handleChangeProblemCategory(e){
        this.setState({
            category : e.target.value
        }, () => {
            this.setState({
                problemCategoryError:""
            })
        })
    }

    handleChangeArea(e){
        this.setState({
            area_id:e.target.value
        }, () => {
            this.setState({
                areaError : ""
            })
        })
    }

    handleChangeISP(e){
        this.setState({
            isp_id:e.target.value
        }, () => {
            this.setState({
                ispError : ""
            })
        })
    }

    handleChangeDetails(e){
        this.setState({
            details:e.target.value
        }, () => {
            this.setState({
                provideDetailsError : ""
            })
        })
    }

    handleClose(){
        this.setState({
            done : false,
         
        })
    }
   

    render(){
        return(
            <div>
               <UserHeader data={this.state.name} id={this.state.user_id} />
                
               <br></br>
               <br></br>
               <br></br>
               <div className="container">
             
            
               <div className="container" >
                    <center><h2>Report a problem</h2></center>
                
                <Form onSubmit={this.handleSubmit}>
                    
                     <Form.Group style={{"margin":30, "marginLeft":200, "marginRight" : 200}}>
                          <Form.Label>Select Problem Category</Form.Label>
                          <Form.Control as="select" value={this.state.category} onChange={this.handleChangeProblemCategory}>
                          <option disabled hidden value="">Problem Type</option>
                          <option value="0">Low Bandwidth</option>
                          <option value="1">Physical Connection Related Problem</option>
                          <option value="2">Platform Related Problem</option>
                          <option value="3">Others</option>
                          </Form.Control>
                          <Form.Text style={{"color":"red"}}>
                          {this.state.problemCategoryError}
                        </Form.Text>
                      </Form.Group>
                     
                    <Form.Group controlId="exampleForm.ControlSelect2" style={{"margin":30, "marginLeft":200, "marginRight" : 200}}>
                        <Form.Label>Select Area</Form.Label>
                        <Form.Control as="select" value={this.state.area_id} onChange={this.handleChangeArea}>
                          <option value="" disabled hidden>Select Area</option>
                          {
                              this.state.user_areas.map((area) => <option key={area} value={area}>{this.getArea(area)}</option>)
                          }
                          </Form.Control>
                          <Form.Text style={{"color":"red"}}>
                          {this.state.areaError}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlSelect3" style={{"margin":30, "marginLeft":200, "marginRight" : 200}}>
                        <Form.Label>Select ISP</Form.Label>
                        <Form.Control as="select" value={this.state.isp_id} onChange={this.handleChangeISP}>
                          <option value="" disabled hidden>Select ISP</option>
                          {
                              this.state.user_isps.map((isp) => <option key={isp} value={isp}>{this.getISP(isp)}</option>)
                          }
                          </Form.Control>
                          <Form.Text style={{"color":"red"}}>
                          {this.state.ispError}
                        </Form.Text>
                    </Form.Group>
                    
                    <Form.Group controlId="exampleForm.ControlTextarea1" style={{"margin":30, "marginLeft":200, "marginRight" : 200}}>
                        <Form.Label>Provide Details</Form.Label>
                        <Form.Control as="textarea" value = {this.state.details} rows={3} onChange={this.handleChangeDetails} />
                        <Form.Text style={{"color":"red"}}>
                        {this.state.provideDetailsError}
                        </Form.Text>
                    </Form.Group>
                    

                    <Form.Group>
                      
                      <Button variant="success" type="submit" style={{"margin":30, "marginLeft":200, "marginRight" : 200}}>
                      <AiIcons.AiOutlineSend size={30}/>  Submit
                        </Button>
                    </Form.Group>
                    </Form>

               
                    <Modal show={this.state.done} onHide={this.handleClose} animation={false}>
                        <Modal.Header closeButton>
                        <Modal.Title>{this.state.modalTitle}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        {this.state.modalBody}
                        </Modal.Body>
                        <Modal.Footer>
                        <Link type="button" onClick={this.handleClose} className="btn btn-warning" to={{
                            pathname: `/user/${this.state.user_id}`,
                            state : {
                                data : this.state.name,
                                id : this.state.user_id

                            }}}><AiIcons.AiOutlineHome size={20}/>  Go to Home</Link>

                        <Link type="button" onClick={this.handleClose} className="btn btn-info" to={{
                             pathname: `/user/${this.state.user_id}/viewReports`,
                             state: {
                                data : this.state.name,
                                id : this.state.user_id
                             }}}><GoIcons.GoReport size={20}/>  View Reports</Link>
                        </Modal.Footer> 
                    </Modal>
                    
                    
                    
                </div>
         
                
               </div>
                
            </div>
        );
    }
}

export default UserCreateReport