/** get the full product Catalogue
 */

import { store, makeAPIStateSelector } from '@opensrp/store';
import {
  getFetchOptions,
  OpenSRPService as GenericOpenSRPService,
  HTTPMethod,
} from '@opensrp/server-service';
import { OPENSRP_API_BASE_URL, OPENSRP_PRODUCT_CATALOGUE } from '../constants';
import { fetchProducts, ProductCatalogue } from '../ducks/productCatalogue';
import { Dictionary } from '@onaio/utils';

const sessionSelector = makeAPIStateSelector();

/** OpenSRP service */
export class OpenSRPService extends GenericOpenSRPService {
  constructor(
    endpoint: string,
    baseURL: string = OPENSRP_API_BASE_URL,
    fetchOptions: typeof getFetchOptions = getFetchOptions
  ) {
    const accessToken = sessionSelector(store.getState(), { accessToken: true });
    super(accessToken, baseURL, endpoint, fetchOptions);
  }
}

/**
 * @param {string} baseURL -  base url of api
 * @param {OpenSRPService} service - the opensrp service
 * @param {fetchProducts}actionCreator - Action creator; creates actions thad adds products to the store
 *
 * @returns {Promise<void>}
 */
export async function loadProductCatalogue(
  baseURL: string,
  service: typeof OpenSRPService = OpenSRPService,
  actionCreator: typeof fetchProducts = fetchProducts
) {
  const serve = new service(OPENSRP_PRODUCT_CATALOGUE, baseURL);
  return serve
    .list()
    .then((response: ProductCatalogue[]) => {
      actionCreator(response);
    })
    .catch((err: Error) => {
      throw err;
    });
}

/**
 * @param {string} baseURL -  base url of api
 * @param {number | string} id - id of the product to be fetched
 * @param {OpenSRPService} service - the opensrp service
 * @param {fetchProducts}actionCreator - Action creator; creates actions thad adds products to the store
 *
 * @returns {Promise<void>}
 */
export async function loadSingleProduct(
  baseURL: string,
  id: number | string,
  service: typeof OpenSRPService = OpenSRPService,
  actionCreator: typeof fetchProducts = fetchProducts
) {
  const serve = new service(OPENSRP_PRODUCT_CATALOGUE, baseURL);
  return serve
    .read(id)
    .then((response: ProductCatalogue | {}) => {
      if (Object.keys(response).length === 0) {
        return Promise.reject(new Error('Product not found in the catalogue'));
      }
      actionCreator([response as ProductCatalogue]);
    })
    .catch((err: Error) => {
      throw err;
    });
}

/**
 * custom function that returns options to pass to fetch
 *
 * @param {AbortSignal} _ - signal object that allows you to communicate with a DOM request
 * @param {string} accessToken - the access token
 * @param {string} method - the HTTP method
 * @param {Dictionary} payload - the payload
 * @returns {object} options to be passed to fetch
 */
export const postPutOptions = (
  _: AbortSignal,
  accessToken: string,
  method: HTTPMethod,
  payload: Dictionary
): RequestInit => {
  const data = new FormData();
  const productPhotoKeyName = 'file';
  const formFieldsFileKeyName = 'productCatalogue';

  const file = payload.productPhoto;
  if (file) {
    data.append(productPhotoKeyName, file, file.name);
  }

  // curate the other values
  const formFields = { ...payload };
  if (method === 'POST') {
    delete formFields.uniqueId;
  }
  delete formFields.productPhoto;

  // random file name to give to this file.
  const formFieldsFileName = 'product.json';
  const formFieldsFile = new File([JSON.stringify(formFields)], formFieldsFileName, {
    type: 'application/json',
  });
  data.append(formFieldsFileKeyName, formFieldsFile, formFieldsFileName);

  const bearer = `Bearer ${accessToken}`;
  return {
    body: data,
    headers: { authorization: bearer, accept: 'application/json' },
    method,
  };
};

/**
 * @param {string} baseURL - base url of the api
 * @param {Dictionary} payload - the payload
 * @param {OpenSRPService} service - the opensrp service
 * @returns {Promise<void>}
 */
export async function postProduct(
  baseURL: string,
  payload: Dictionary,
  service: typeof OpenSRPService = OpenSRPService
) {
  const serve = new service(OPENSRP_PRODUCT_CATALOGUE, baseURL, postPutOptions);
  return serve.create(payload).catch((err: Error) => {
    throw err;
  });
}

/**
 * @param {string} baseURL - base url of the api
 * @param {Dictionary} payload - the payload
 * @param {OpenSRPService} service - the opensrp service
 * @returns {Promise<void>}
 */
export async function putProduct(
  baseURL: string,
  payload: Dictionary,
  service: typeof OpenSRPService = OpenSRPService
) {
  const serve = new service(
    `${OPENSRP_PRODUCT_CATALOGUE}/${payload.uniqueId}`,
    baseURL,
    postPutOptions
  );
  return serve.update(payload).catch((err: Error) => {
    throw err;
  });
}
