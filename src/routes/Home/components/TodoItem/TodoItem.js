import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classes from './TodoItem.scss'
import { ListItem } from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'
import Delete from 'material-ui/svg-icons/action/delete-forever'
import Edit from 'material-ui/svg-icons/action/build'
import Done from 'material-ui/svg-icons/action/done'
import { isObject } from 'lodash'

export default class Greeting extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: props.todo.text, edit: false }
  }

  render() {
    let todo = this.props.todo
    let id = this.props.id
    let onCompleteClick = this.props.onCompleteClick
    let onDeleteClick = this.props.onDeleteClick
    let onEditClickDone = this.props.onEditClickDone

    return (
      <div className={classes.container}>
        <ListItem
          leftIcon={
            <Checkbox
              defaultChecked={todo.done}
              onCheck={() => onCompleteClick(todo, todo._key || id)}
            />
          }
          rightIcon={
            <div>
              {this.state.edit && (
                <Done onClick={() => { this.setState({edit:false}); onEditClickDone(this.state.text, todo._key || id) } } />
              )}

              {!this.state.edit && (
                <Edit onClick={() => this.setState({edit:true}) } />
              )}

              <Delete onClick={() => onDeleteClick(todo._key || id)} />
            </div>
          }
          secondaryText={
            <div>
              {!this.state.edit && <span className="TodoItem-Text">{todo.text}</span>}
              {this.state.edit && (
                <div>
                  <input
                    type="text"
                    value={this.state.text}
                    onChange={event => {
                      this.setState({ text: event.target.value })
                    }}
                  />
                </div>
              )}
            </div>
          }
          secondaryTextLines={2}
        />
      </div>
    )
  }
}
