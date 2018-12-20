import React, {Component,Fragment} from 'react';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import { Link, withRouter } from "react-router-dom";
import Div from '../../components/div';
import Form from '../../components/Form';
import Button from '../../components/button';
import DeleteBtn from '../../components/DeleteBtn';
import Label from '../../components/label';
import Input from '../../components/input';
import './App.css';
import API from '../../../utils/API';
import fire from '../../../config/Fire';


//sortableItem function with value passed into it to call it within JSX
const SortableItem = SortableElement(({value,onClick}) =>
  //{value} = arrayElements
  <div className='p-5'>
    <button id={value._id} className='delete-btn float-left d-inline-block ml-5' name='editCat' onClick={onClick}>✎</button>
    <h1 key={value._id} className='shadow bg-light display-1 inline-block'>{value.category}</h1>
    <button id={value._id} className='delete-btn float-right d-inline-block' name='deleteCat' onClick={onClick}>x</button> 
  </div>
);

//sortableList functions with itemsArray passed into it using .map to list each element
const SortableList = SortableContainer(({items,onClick}) => 
    <div className='d-flex justify-content-center'>
      {items.map((value, index) => (
        <SortableItem key={`cat-${index}`} id={value.id} index={index} value={value} onClick={onClick}/>
      ))}
    </div>
);

//Customize Categories Class
class CustomCats extends Component {
  constructor(props){
    super(props)
    this.logout = this.logout.bind(this);
    this.state = {
      //updating items with the 
      items: [],
      //updating category state via input handle change 
      category:[],
  
      menuItems:[]

    };
    //Logging state on update
    console.log(this.state.category);
  }
    //When components mount call load categories function
    componentDidMount() {
      this.loadCats();
    }



 /*------------------------------------------------------------------------------------------------------------------------------------------------*/  
//CREATE MODULES(s)
    //Adding Category function
    addCat = (e)=>{
      e.preventDefault();
      let category = this.state.category[0]
      console.log(category);
      console.log(this.state.items.length);
      API.saveCat(
            {
              category:category,
              sortOrder:this.state.items.length+6
            }
            ).then(res=> this.loadCats())
      e.target.reset();
    }
 /*------------------------------------------------------------------------------------------------------------------------------------------------*/ 
//READ MODULE(s):
    //Load categories function
    loadCats = () =>{
      API.getCats()
      .then(res =>{
        console.log(res.data);
        this.setState({items:res.data,menuItems:res.data})
      })
      .catch(err => console.log(err));
    }
 /*------------------------------------------------------------------------------------------------------------------------------------------------*/
 //UPDATE MODULES(s)
    //handleChange functions
    handleChange = data=>{
      const {name,value} = data.target;
      console.log(value);
      this.setState({
        [name]:[value]
      })
    }

  //sort end method taking in oldIndex and newIndex values
  onSortEnd = ({oldIndex, newIndex}) => {
    //updating the state after sorting ends
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    })
    //logging the updated state to verify state position
    console.log(this.state.items,oldIndex,newIndex);
  };
 /*------------------------------------------------------------------------------------------------------------------------------------------------*/
 //DELETE MODULE(s)   
    //Delete Category by _id
    deleteCat = (data)=>{
      const {id} = data.target;
      //Make API Call to delete cat by passing in the id of the Category that user clicked
      API.deleteCat(id)
      //invoke the loadCats function
        .then(res=> this.loadCats())
        .catch(err => console.log(err));
    }
/*------------------------------------------------------------------------------------------------------------------------------------------------*/
//CATEGORIES PAGE fn MODULE(s)
    //Edit Category by _id
      editCat = (e)=>{
        console.log(e.target.id)
        this.props.history.push('/cust/' + e.target.id)
        console.log(this.props) 
      }
    //redirect to home
      redirect = (e)=>{
        console.log(e.target.id)
        this.props.history.push('/')
        console.log(this.props) 
      }

    //Logout
      logout() {
        fire.auth().signOut();
    }

      //Display Category
      displayCat = ()=>{

        return(
        <Fragment>
        <Div className='container'>
        <Div className='row d-flex justify-content-center'>
            <Div className='form-group'>
              <Form className='form-inline p-3' onSubmit={this.addCat}>
                <Label for='category mr-3'>Add <br/>Category:  
                <Input type='text' className='form-control'name='category' onChange={this.handleChange}/>
                </Label> 
                <Input id='submit' type='submit' value='+'/>
              </Form>
            </Div>
          </Div>
        </Div>
        <Div className='container-fluid'>
          <Div className='row d-flex justify-content-center align-content-center'>
            <Div className='displayChg d-flex justify-content-center align-content-center'>
            <SortableList axis='x' items={this.state.items} onSortEnd={this.onSortEnd} 
              onClick={(data)=>{data.target.name === 'deleteCat' ? this.deleteCat(data):this.editCat(data)}}/>
            </Div>
            </Div>
        </Div>
        </Fragment>
        )
      }


  render() {

    return (

      <Fragment>
        <img className='img-fluid' src='mualogosm.jpg'/><br/>
        <button onClick={this.redirect} className='logout mt-3'>
          <i class="fas fa-home"></i><span>Home</span>
        </button>
        <button onClick={this.logout} className='logout mt-3'>
          <i className="fas fa-user"></i><span>Logout</span>
        </button>
        {this.displayCat()}
      </Fragment>
    )
  }
}

export default withRouter(CustomCats);
