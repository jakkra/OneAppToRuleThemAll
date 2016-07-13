import { connect } from 'react-redux';
import NavigationRoot from '../components/NavRoot';
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
)(NavigationRoot);

// function mapDispatchToProps (dispatch) {
//   return {
//     pushRoute: (route) => dispatch(push(route)),
//     popRoute: () => dispatch(pop())
//   }
// }
