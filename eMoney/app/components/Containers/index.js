//@flow
import BPS from './BPS';
import View from './View';
import KeyboardAvoiding from './KeyboardAvoiding';

const Containers: {
    KeyboardAvoiding: typeof KeyboardAvoiding,
    View: typeof View,
    BPS: typeof BPS,
} = {
    KeyboardAvoiding,
    View,
    BPS,
};

export default Containers;
