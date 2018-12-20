
import React, {Component,Fragment} from 'react';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import {withRouter} from 'react-router-dom';
import MenuItem from './MenuItem';
import Div from '../../components/div';
import Form from '../../components/Form';
import Label from '../../components/label';
import Input from '../../components/input';
import './App.css';
import API from '../../../utils/API';
import fire from '../../../config/Fire';


//sortableItem function with value passed into it to call it within JSX
const SortableItem = SortableElement(({value,onClick}) =>
  //{value} = arrayElements
  <div className='col-lg-12 d-block'>
    <button id={value._id} className='delete-btn' name='deleteItem' onClick={onClick}>x</button> 
    <MenuItem key={value._id} name={value.name} image={value.image} price={value.price} description={value.description}/>
  </div>
);

//sortableList functions with itemsArray passed into it using .map to list each element
const SortableList = SortableContainer(({items,onClick}) => 
    <div className='d-block'>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} id={value.id} index={index} value={value} onClick={onClick}/>
      ))}
    </div>
);

//CustomItems class 
class CustomItems extends Component {

    constructor(props){
        super(props)

        this.state = {

            name:'',
            category: '',
            description: '',
            image:'',
            price: '',
            items: []
        }
    }
    componentWillMount() {
            console.log(this.props.match.params.id);
                //fires loadItems fn
                this.loadItems();

    }
/*------------------------------------------------------------------------------------------------------------------------------------------------*/
    //CREATE & UPDATE MODULE(s)
    //addItem fn
    addItem = (e)=>{
        //prevent the page to reload
        e.preventDefault();
        //create a variable storing category name
        let category = this.state.category
        console.log(category);
        console.log(this.state);
        //API call to save an item
        API.saveItem(
            //Inheriting from constructor storing relevant values to name,category, description, image, price
              {
                name:this.state.name,
                category: category,
                description:this.state.description,
                image:this.state.image,
                price:this.state.price,
                //manually assign sortOrder for prototyping reasons
                sortOrder:106
              }
              //Hold the response to make another API call to update category's associated menuItems in db and refreshing the data  
              ).then(res=> {
                  //API call to update category's associated menuItems in db and refreshing the data
                API.updateCat(this.props.match.params.id,res.data._id)
                    .then(res=>{
                        console.log(res.data);
                        this.loadItems();
                    })
              })
              //Resetting the input value to null
        e.target.reset();
      }
    //UPDATE MODULE(s):

    //onSortEnds fn:
      //sort end method taking in oldIndex and newIndex values
      onSortEnd = ({oldIndex, newIndex}) => {
        //updating the state after sorting ends
        this.setState({
        items: arrayMove(this.state.items, oldIndex, newIndex),
        })
        //logging the updated state to verify state position
        console.log(oldIndex,this.state.items,newIndex);
    };
    // handleChange functions
    handleChange = data=>{
        const {name,value} = data.target;
        console.log(name,value);
        this.setState({
            [name]:value,
        })
        }
/*------------------------------------------------------------------------------------------------------------------------------------------------*/
    //READ MODULE(s)
        //LoadItems Component
        //Get categories data from the server & set the category state to response data.
    loadItems = ()=>{
        //API call to get specific Category passing the endpoint "catId" to controller
        API.getCat(this.props.match.params.id)
        //hold the response from the server and update category state to category name associated with the catId.
        .then(res =>{
            // console.log(res.data);

            //use res.data.category to access the array of object's key 'categories' values and set the category state to array of cat
            this.setState({
                category:res.data.category
            }) 
            //Console lot to ensure the state is updated
            console.log(this.state.category)
            //use menu Items from the response data to 
            res.data.menuItem.map(itemId=>{
                // console.log(itemId);
                API.getItem(itemId)
                .then(res=>{
                    //console log the response
                    console.log(res.data)
                    //if response exists
                    if (res.data){
                        //update the items array adding to it's existing data using spread
                    this.setState({
                        items:[...this.state.items,res.data]
                    })
                    }
                })
            })
            
        })
    }
/*------------------------------------------------------------------------------------------------------------------------------------------------*/
    //DELETE MODULE(s):
    //deleteItem Component
    deleteItem = (data)=>{
        const {id} = data.target;
        API.deleteItem(id)
          .then(res=> this.loadItems())
          .catch(err => console.log(err));
      }


/*------------------------------------------------------------------------------------------------------------------------------------------------*/
//Items Page Fn 
    backtocat = (e)=>{
        console.log(e.target.id)
        this.props.history.push('/cats')
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

    //Render
     render() {
        
        return (
            
            <div>
                <Div className='container-fluid'>
                <Div className='row d-flex justify-content-start'>
                    <img className='img-fluid' src='../mualogosm.jpg'/>
                </Div>      
                <Div className='row d-flex justify-content-start'>
                    <button onClick={this.backtocat} className='logout mt-3'><i class="fas fa-chevron-circle-left"></i><span>Categories</span></button><br/>
                </Div>      
                <Div className='row d-flex justify-content-start'>
                    <button onClick={this.redirect} className='logout mt-3'><i class="fas fa-home"></i><span>Home</span></button><br/>
                </Div>      
                <Div className='row d-flex justify-content-start'>
                    <button onClick={this.logout} className='logout mt-3'><i className="fas fa-user"></i><span>Logout</span></button><br/>
                </Div>      
                <Div className='row d-flex justify-content-center'>
                
                    <Form className='form-inline p-3' onSubmit={this.addItem}>
                    <Label for='Item'>Item:
                    <Input type='text' className='form-control'name='name' onChange={this.handleChange}/>
                    </Label> 
                    <Label for='Image'>Image:
                    <Input type='file' className='form-control file'name='image' onChange={this.handleChange}/>
                    </Label> 
                    <Label for='Price'>Price:
                    <Input type='text' className='form-control'name='price' onChange={this.handleChange}/>
                    </Label> 
                    <Label for='Description'>Description:
                    <textarea className='form-control'name='description' onChange={this.handleChange}/>
                    </Label> 
                    <Input id='submit' type='submit' value='Add Item'/>
                    </Form>
                </Div>
                </Div>
                <br/>
                <div className='row d-flex justify-content-center'>
                    <h1 className='display-2 text-center'>{this.state.category}</h1>
                </div>
                    
                <div className='row d-flex justify-content-center'>
                    <SortableList items={this.state.items} onSortEnd={this.onSortEnd} 
                    onClick={(data)=>{this.deleteItem(data)}}/>         
                        {/* {this.state.items.map(Item => (
                            <MenuItem key={Item.id} name={Item.name} image={Item.image} price={Item.price} description={Item.description}/>
                        ))} */}
                </div>
            </div>
        )
    }
}

export default withRouter(CustomItems);





