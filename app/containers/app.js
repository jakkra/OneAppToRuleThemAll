import { connect } from 'react-redux';
import NavRoot from '../components/NavRoot';
import { push, pop, reset } from '../actions/navAction';

function mapStateToProps(state) {
  return {
    navigation: state.navReducer,
  };
}

export default connect(
  mapStateToProps,
  {
    pushRoute: (route) => push(route),
    popRoute: () => pop(),
    resetRoute: () => reset(),
  }
)(NavRoot);

// function mapDispatchToProps (dispatch) {
//   return {
//     pushRoute: (route) => dispatch(push(route)),
//     popRoute: () => dispatch(pop())
//   }
// }
