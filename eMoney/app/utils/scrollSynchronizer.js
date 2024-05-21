//@flow
import _ from 'lodash';
import type {ScrollEvent} from 'react-native/Libraries/Types/CoreEventTypes';

// noinspection SpellCheckingInspection
export type ScrollSynchronizerAgent = {
    onScroll: (event: ScrollEvent) => void,
    onScrollBeginDrag: () => void,
    onRef: (ref: any) => void,
};

class Agent {
    _id: string;
    _scrollRef: any = null;
    // noinspection SpellCheckingInspection
    _synchronizer: ?ScrollSynchronizer = null;

    // noinspection SpellCheckingInspection
    constructor(id: string, synchronizer: ScrollSynchronizer) {
        this._id = id;
        this._synchronizer = synchronizer;
    }

    destroy = () => {
        this._scrollRef = null;
        this._synchronizer = null;
    };

    // noinspection JSUnusedGlobalSymbols
    onRef = (ref: any) => {
        if (!this._synchronizer) {
            return;
        }
        this._scrollRef = ref;
    };

    // noinspection JSUnusedGlobalSymbols
    onScrollBeginDrag = () => {
        if (!this._synchronizer) {
            return;
        }
        this._synchronizer.setActiveId(this._id);
    };

    // noinspection JSUnusedGlobalSymbols
    onScroll = (event: ScrollEvent) => {
        if (!this._synchronizer) {
            return;
        }
        this._synchronizer.syncScroll(this._id, {
            ...(event.nativeEvent.contentOffset || {x: 0, y: 0}),
        });
    };

    scrollTo = (offset: {x: number, y: number}) => {
        if (!this._scrollRef) {
            return;
        }
        if (this._scrollRef.scrollTo) {
            return this._scrollRef.scrollTo({x: offset.x, y: offset.y, animated: false});
        }
        if (this._scrollRef.scrollToOffset) {
            return this._scrollRef.scrollToOffset({
                offset: offset.x !== 0 ? offset.x : offset.y,
                animated: false,
            });
        }
    };
}

export class ScrollSynchronizer {
    _map: {[key: string]: Agent} = {};
    _destroyed: boolean = false;
    _activeId: string = '';

    destroy = () => {
        this._destroyed = true;
        _.values(this._map).forEach((agent: Agent) => agent.destroy());
        this._map = {};
    };

    setActiveId = (id: string) => {
        this._activeId = id;
    };

    syncScroll = (id: string, offset: {x: number, y: number}) =>
        _.keys(this._map).forEach(key => {
            if (key === id || key === this._activeId) {
                return;
            }
            this._map[key].scrollTo(offset);
        });

    // noinspection JSUnusedGlobalSymbols
    agent(id: string): ?ScrollSynchronizerAgent {
        if (this._destroyed) {
            return null;
        }
        if (!(id in this._map && this._map[id])) {
            this._map[id] = new Agent(id, this);
        }
        return this._map[id];
    }
}
