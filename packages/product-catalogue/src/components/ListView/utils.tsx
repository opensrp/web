import React from 'react';
import { Divider, Spin, Alert } from 'antd';
import { ProductCatalogue } from '../../ducks/productCatalogue';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';
import {
  CATALOGUE_EDIT_VIEW_URL,
  CATALOGUE_LIST_VIEW_URL,
  TableColumnsNamespace,
} from '../../constants';
import { Link } from 'react-router-dom';
import lang, { Lang } from '../../lang';
import { Column } from 'react-utils/dist/types';

/**
 * component rendered in the action column of the table
 *
 * @param record - represent row as records
 */
export const ActionsColumnCustomRender: ColumnType<ProductCatalogue>['render'] = (record) => {
  return (
    <>
      <Link to={`${CATALOGUE_EDIT_VIEW_URL}/${record.uniqueId}`}>{lang.EDIT}</Link>
      <Divider type="vertical" />
      <Link to={`${CATALOGUE_LIST_VIEW_URL}/${record.uniqueId}`}>{lang.VIEW_DETAILS}</Link>
    </>
  );
};

/** product Catalogue table columns
 *
 * @param langObj - the lang translation object
 */
export const columnsFactory = (langObj: Lang = lang): Column<ProductCatalogue>[] => {
  const columns: Column<ProductCatalogue>[] = [
    {
      title: langObj.PRODUCT_NAME_TH,
      dataIndex: 'productName',
      key: `${TableColumnsNamespace}-productName` as keyof ProductCatalogue,
      defaultSortOrder: 'descend',
      sorter: (rec1, rec2) => {
        if (rec1.productName > rec2.productName) {
          return -1;
        } else if (rec1.productName < rec2.productName) {
          return 1;
        } else {
          return 0;
        }
      },
    },
    {
      title: langObj.ID_TH,
      dataIndex: 'uniqueId',
      key: `${TableColumnsNamespace}-uniqueId` as keyof ProductCatalogue,
    },
    {
      title: langObj.ACTIONS_TH,
      key: `${TableColumnsNamespace}-actions` as keyof ProductCatalogue,
      render: ActionsColumnCustomRender,
      width: '20%',
    },
  ];
  return columns;
};

/** util component shown when there is a pending promise */

export const CatalogueLoading = () => {
  return (
    <Spin tip={lang.LOADING_ELLIPSIS}>
      <Alert
        message={lang.FETCHING_PRODUCT}
        description={lang.FETCHING_PRODUCT_DESCRIPTION}
        type="info"
      />
    </Spin>
  );
};
