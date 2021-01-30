import { useContext } from 'react';

import StateContext from '../context/state.context';

const useStateValue = () => useContext(StateContext);

export default useStateValue;
