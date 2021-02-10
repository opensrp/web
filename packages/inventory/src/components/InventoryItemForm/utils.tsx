import { sendErrorNotification } from '@opensrp/notifications';
import { OpenSRPService, handleSessionOrTokenExpiry } from '@opensrp/react-utils';
import { HTTPError } from '@opensrp/server-service';
import { InventoryPost } from '../../ducks/inventory';
import { Dispatch, SetStateAction } from 'react';
import { OPENSRP_ENDPOINT_STOCK_RESOURCE } from '../../constants';

import { ERROR_GENERIC } from '../../lang';

/**
 * Submit form
 *
 * @param values values to be submitted
 * @param openSRPBaseURL OpenSRP API base URL
 * @param setSubmitting set isSubmitting value in the form's state
 * @param setIfDoneHere set ifDoneHere value in the form's state
 * @param inventoryID ID of inventory item during editing
 */
export const submitForm = async (
  values: InventoryPost,
  openSRPBaseURL: string,
  setSubmitting: Dispatch<SetStateAction<boolean>>,
  setIfDoneHere: Dispatch<SetStateAction<boolean>>,
  inventoryID?: string
) => {
  setSubmitting(true);
  const token = await handleSessionOrTokenExpiry();
  const customOptions = () => {
    return {
      body: inventoryID
        ? JSON.stringify({
            ...values,
            stockId: inventoryID,
          })
        : JSON.stringify(values),
      headers: {
        authorization: `Bearer ${token}`,
        accept: '*/*',
        'content-type': 'application/json',
      },
      method: inventoryID ? 'PUT' : 'POST',
    };
  };

  if (!inventoryID) {
    const service = new OpenSRPService(
      OPENSRP_ENDPOINT_STOCK_RESOURCE,
      openSRPBaseURL,
      customOptions
    );
    service
      .create(values)
      .then(() => {
        setIfDoneHere(true);
      })
      .catch((_: HTTPError) => {
        sendErrorNotification(ERROR_GENERIC);
      })
      .finally(() => {
        setSubmitting(false);
      });
  } else {
    const service = new OpenSRPService(
      `${OPENSRP_ENDPOINT_STOCK_RESOURCE}${inventoryID}`,
      openSRPBaseURL,
      customOptions
    );
    service
      .update({
        ...values,
        stockId: inventoryID,
      })
      .then(() => {
        setIfDoneHere(true);
      })
      .catch((_: HTTPError) => {
        sendErrorNotification(ERROR_GENERIC);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }
};
