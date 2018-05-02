import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { compose, withHandlers } from 'recompose'
import { isEmpty, withFirebase } from 'react-redux-firebase'
import { List } from 'material-ui/List'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'
import { withNotifications } from 'modules/notification'
import { spinnerWhileLoading } from 'utils/components'
import TodoItem from '../TodoItem'
import classes from './TodosList.scss'

const TodosList = ({
  todos,
  toggleDone,
  deleteTodo,
  editTodo,
  editTodoDone
}) => (
  <Paper className={classes.container}>
    {!isEmpty(todos) ? (
      <div>
        <Subheader>Todos</Subheader>
        <List className={classes.list}>
          {map(todos, (todo, id) => (
            <TodoItem
              key={id}
              id={id}
              todo={todo}
              onCompleteClick={toggleDone}
              onDeleteClick={deleteTodo}
              onEditClick={editTodo}
              onEditClickDone={editTodoDone}
            />
          ))}
        </List>
      </div>
    ) : (
      <div className={classes.empty}>No Todos</div>
    )}
  </Paper>
)

TodosList.propTypes = {
  todos: PropTypes.object,
  toggleDone: PropTypes.func, // from withHandlers
  deleteTodo: PropTypes.func, // from withHandlers
  editTodo: PropTypes.func, // from withHandlers
  editTodoDone: PropTypes.func, // from withHandlers
  firebase: PropTypes.object // eslint-disable-line react/no-unused-prop-types
}

export default compose(
  withFirebase, // firebaseConnect() can also be used
  withNotifications, // adds props.showError from notfication module
  spinnerWhileLoading(['todos']),
  withHandlers({
    toggleDone: props => (todo, id) => {
      const { firebase, auth } = props
      return firebase.set(`todos/${id}/done`, !todo.done)
    },

    deleteTodo: props => id => {
      const { todos, auth, firebase } = props
      return firebase.remove(`todos/${id}`).catch(err => {
        // TODO: Have error caught by epic
        console.error('Error removing todo: ', err) // eslint-disable-line no-console
        props.showError('Error Removing todo')
        return Promise.reject(err)
      })
    },
    editTodoDone: props => (text, id) => {
      const { firebase, auth } = props
      return firebase.set(`todos/${id}/text`, text)
    }
  })
)(TodosList)
