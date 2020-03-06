import "jest";
import {IDynaduxReducerDic} from "../index";
import {combineMultipleReducers} from "./combineMultipleReducers";

describe('Dynadux', () => {

  describe('combineMultipleReducers', () => {
    test('no duplicate actions', () => {
      const log: string[] = [];
      const products: IDynaduxReducerDic<any> = {
        LOGIN: () => log.push('products-LOGIN') as any,
        GET_PRODUCTS: () => log.push('products-GET_PRODUCTS') as any,
        LOGOUT: () => log.push('products-LOGOUT') as any,
      };
      const cart: IDynaduxReducerDic<any> = {
        LOGIN: () => log.push('cart-LOGIN') as any,
        ADD_PRODUCT: () => log.push('cart-ADD_PRODUCT') as any,
        REMOVE_PRODUCT: () => log.push('cart-REMOVE_PRODUCT') as any,
        LOGOUT: () => log.push('cart-LOGOUT') as any,
      };

      const allReducers = combineMultipleReducers(products, cart);

      allReducers['LOGIN']('reducerAPI' as any);
      allReducers['GET_PRODUCTS']('reducerAPI' as any);
      allReducers['ADD_PRODUCT']('reducerAPI' as any);
      allReducers['REMOVE_PRODUCT']('reducerAPI' as any);
      allReducers['LOGOUT']('reducerAPI' as any);

      expect(log).toMatchSnapshot();

    });
  });

});
