// @flow
import _ from 'lodash';
import type {Advertising} from '../constants';

export type AdvertisingCube = {
    [index: number]: Advertising,
};

export type AdvertisingTable = {
    [cubeIndex: number]: AdvertisingCube,
};

export type AdvertisingGroup = {
    name: string,
    index: number,
    viewType: number,
    items: AdvertisingTable | Advertising[],
};

function pushToCube(cube: AdvertisingCube, item: Advertising): boolean {
    if (!(0 in cube)) {
        cube[0] = item;
        return true;
    }
    if (!(1 in cube) && cube[0].height < 2 && item.height < 2) {
        cube[1] = item;
        return true;
    }
    if (
        !(2 in cube) &&
        cube[0].width < 2 &&
        item.width < 2 &&
        (!(1 in cube) || (cube[1].width < 2 || item.height < 2))
    ) {
        cube[2] = item;
        return true;
    }
    if (
        item.height > 1 ||
        item.width > 1 ||
        3 in cube ||
        (2 in cube && cube[2].height > 1) ||
        (1 in cube && cube[1].width > 1) ||
        (0 in cube && cube[0].width > 1 && cube[0].height > 1)
    ) {
        return false;
    }
    cube[3] = item;
    return true;
}

/*
function hasFillWidth(cube: AdvertisingCube, index: number): boolean {
    if (!(index in cube)) {
        return false;
    }
    if (index <= 0) {
        return !(2 in cube || (cube[index].height > 1 && 3 in cube));
    }
    if (index === 1) {
        return !(3 in cube || (2 in cube && cube[2].height > 1));
    }
    return false;
}

function hasFillHeight(cube: AdvertisingCube, index: number): boolean {
    if (!(index in cube)) {
        return false;
    }
    if (index <= 0) {
        return !(1 in cube || (cube[index].width > 1 && 3 in cube));
    }
    if (index === 2) {
        return !(3 in cube || (1 in cube && cube[1].width > 1));
    }
    return false;
}
 */

export function buildAdvertisingTable(items: Advertising[]): AdvertisingTable {
    let table: AdvertisingTable = {},
        cube: AdvertisingCube = {},
        index: number = 0;
    items.forEach((item: Advertising) => {
        if (!pushToCube(cube, item)) {
            table[index] = {...cube};
            cube = {};
            index++;
            pushToCube(cube, item);
        }
    });
    if (_.size(cube) > 0) {
        table[index] = cube;
    }
    return table;
}
