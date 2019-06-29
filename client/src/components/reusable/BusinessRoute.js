import React from 'react'
import { Route, Redirect } from  'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import Axios from 'axios';

// class BusinessRoute extends Component {
//   state = {
//     isAdmin: false
//   }
//   componentDidMount() {
//     Axios.get('/api/profile/is-admin')
//       .then(res => this.setState({isAdmin: res.data}))
//       .catch(err => console.log(err.response.data))
//   }
//   render() {
//     const Component = this.props.component;
//     const { auth } = this.props;
//     const { isAdmin } = this.state;
//     const isValid = auth.isAuth === true && isAdmin;
//     console.log(isValid);
//     return (
//       <Route
//         component={ props => 
//           (isValid) ? (
//             <Component {...props} />
//           ) : (
//             <Redirect to="/lokalsbiz/login" />
//           )
//         }
//         {...this.props}
//       />
//     )
//   }
// }

const BusinessRoute = ({
  component: Component,
  auth,
  path,
  ...rest
}) => {
  console.log(auth);
  return (
  <Route 
    render={props => 
      auth.isAuth === true && auth.isAdmin ? (
        <Component {...props} />
      ) : (
        <Redirect 
          to={{
            pathname: '/login',
            state: { from: path, business_route: true }
          }}
        />
      )
    }
    {...rest}
  />
)}

BusinessRoute.proptypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(BusinessRoute)
