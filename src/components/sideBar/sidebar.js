import React, {Component} from 'react'
import FAChevronDown from 'react-icons/lib/md/keyboard-arrow-down'
import FAMenu from 'react-icons/lib/fa/list-ul'
import FASearch from 'react-icons/lib/fa/search'
import MdEject from 'react-icons/lib/md/eject'
import SideBarOption from './sideBarOptions'
import {get, last, differenceBy } from 'lodash'
import {createChatNameFromUsers} from '../../factories'

export default class SideBar extends Component{
  static type = {
    CHATS:"chats",
    USERS:"users"
  }
  constructor(props){
    super(props)
    this.state = {
      reciever:"",
      activeSideBar: SideBar.type.CHATS
    }
  }
  handleSubmit = (e) =>{
    e.preventDefault()
    const {reciever} = this.state
    const {onSendPrivateMessage} = this.props

    onSendPrivateMessage(reciever)
    this.setState({reciever:""})
  }
  setActiveSideBar = (newSideBar) =>{
    this.setState({activeSideBar: newSideBar})
  }

  addChatForUser = (username) =>{
    this.props.onSendPrivateMessage(username)
    this.setActiveSideBar(SideBar.type.CHATS)
  }

  render(){
    const {chats, activeChat, user, users, setActiveChat, logout} = this.props
    const {reciever, activeSideBar} = this.state
    return(<div id="side-bar">
      <div className="heading">
        <div className="app-name">Our Cool Chat<FAChevronDown/></div>
          <div className="menu">
            <FAMenu />
          </div>
      </div>
      <form onSubmit={this.handleSubmit} className="search">
      <i className = "search-icon"><FASearch/></i>
      <input
        placeholder="search"
        type="text"
        value={reciever}
        onChange={(e)=>{this.setState({reciever:e.target.value})}}
        />
      <div className = "plus"></div>
      </form>
        <div className= "side-bar-select">
          <div
          onClick = {()=>{this.setActiveSideBar(SideBar.type.CHATS)}}
          className={`side-bar-select__option ${(activeSideBar === SideBar.type.CHATS) ? 'active':''}`}>
          <span>Chats</span>
          </div>
          <div
          onClick = {()=>{this.setActiveSideBar(SideBar.type.USERS)}}
          className={`side-bar-select__option ${(activeSideBar === SideBar.type.USERS) ? 'active':''}`}>
          <span>Users</span>
          </div>
        </div>
      <div
      className="users"
      ref='users'
      onClick={(e)=>{(e.target === this.refs.user) && setActiveChat(null)}}>
      {
        activeSideBar === SideBar.type.CHATS ?
        chats.map((chat)=>{
          if(chat.name){
            return(
              <SideBarOption
              key = {chat.id}
              name = {chat.isCommunity ? chat.name : createChatNameFromUsers(chat.users, user.name)}
              lastMessage = {get(last(chat.messages), 'message', '')}
              active = { activeChat.id === chat.id }
              onClick= {()=>{this.props.setActiveChat(chat)}}
              />
            )
          }
          return null
        })
      :
      differenceBy(users, [user], 'name').map((otherUser) => {
          return(
            <SideBarOption
            key = {otherUser.id}
            name = {otherUser.name}
            onClick = {()=>{ this.addChatForUser(otherUser.name) }}/>
          )
        })
      }
      </div>
      <div className = "current-user">
        <span>{user.name}</span>
        <div onClick={()=>{logout()}} title="Logout" className="logout">
            <MdEject/>
        </div>
      </div>
    </div>);
  }
}
