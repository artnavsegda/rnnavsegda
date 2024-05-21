// @flow
import hash from '@emotion/hash';
import {emptyObject} from '../../constants';
import React, {useState, useEffect} from 'react';
import {SvgProps, SvgXml} from 'react-native-svg';
import {CacheStore, getMessage} from '../../utils';
import * as Animatable from 'react-native-animatable';

export type Props = {
    [key: string]: any,
    source?:
        | {
              uri: string | null,
              headers?: any,
          }
        | any,
    override?: SvgProps,
    style?: any,
};

export default function CachedSvgUri({source, style, ...props}: Props) {
    const {uri, headers} = source || emptyObject;
    const [xml, setXml] = useState(null);
   // console.log('XML', uri);
    useEffect(() => {
        const cacheKey = uri ? `svg-uri-${hash(uri)}` : null;
        uri
            ? CacheStore.get(cacheKey)
                  .then((text: ?string) => (text && text.length > 0 ? setXml(text) : Promise.reject(null)))
                  .catch(() => {
                      fetch(uri, {
                          method: 'GET',
                          headers,
                      })
                          .then((resp) => (resp ? resp.text() : Promise.reject(new Error('Invalid response'))))
                          .then((text) => {
                              setXml(text) || CacheStore.set(cacheKey, text);
                          })
                          .catch((error) => console.warn('Cannot load svg xml', uri, getMessage(error)));
                  })
            : setXml(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uri]);
    return xml ? (
        <Animatable.View style={style} duration={200} useNativeDriver animation="fadeIn">
            <SvgXml xml={xml} override={{...props, color: '#ff3467', opacity: '0.7'}} />
        </Animatable.View>
    ) : null;
}
