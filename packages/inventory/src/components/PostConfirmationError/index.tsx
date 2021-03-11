/** shown during inventory csv bulk upload when committing entries
 * to the db fails and returns a csv error */
import React from 'react';
import { Card, Table, Divider } from 'antd';
import lang from '../../lang';
import { WarningOutlined } from '@ant-design/icons';
import { errorsTableColumnsNameSpace, INVENTORY_BULK_UPLOAD_URL } from '../../constants';
import { Link } from 'react-router-dom';
import { ColumnsType } from 'antd/lib/table/interface';
import { BadRequestError } from '../../helpers/dataLoaders';
import { CardTitle } from '../../helpers/utils';
import { format } from 'util';
import { useTranslation } from 'react-i18next';

type TableData = BadRequestError['errors'][0];

/** props for file start upload */
interface PostConfirmErrorProps {
  errorObj?: BadRequestError;
  filename: string;
}

const defaultProps = {
  filename: '',
};

/** Card shows errors from validation step
 *
 * @param props - components props
 */
const PostConfirmError = (props: PostConfirmErrorProps) => {
  const { errorObj, filename } = props;
  useTranslation();

  const columns: ColumnsType<TableData> = [
    {
      title: lang.ROW_NUMBER,
      dataIndex: 'row',
      key: `${errorsTableColumnsNameSpace}-${lang.ROW_NUMBER}`,
    },
    {
      title: lang.ERRORS,
      dataIndex: 'failureReason',
      key: `${errorsTableColumnsNameSpace}-${lang.ERRORS}`,
    },
  ];

  const cardTitle = (
    <CardTitle
      IconRender={<WarningOutlined className="card-title__icon" />}
      text={lang.INVENTORY_PROCESSING_ERROR}
    />
  );

  const dataSource = errorObj?.errors.map((error) => {
    return {
      ...error,
      key: error.row,
    };
  });

  const rowsProcessed = Number(errorObj?.rowsProcessed ?? '0');
  const totalRows = Number(errorObj?.rowsNumber ?? '0');
  const failedRowsNum = totalRows - rowsProcessed;

  return (
    <Card title={cardTitle} className="full-page-card">
      <p>{format(lang.INVENTORY_ITEMS_FAILED_TO_BE_ADDED, failedRowsNum, filename)}</p>
      <ol>
        <li>{format(lang.EXTRACT_THE_ROWS_LISTED, filename)}</li>
        <li>{lang.PASTE_THE_ROWS}</li>
        <li>
          <Link to={INVENTORY_BULK_UPLOAD_URL}>{lang.UPLOAD_THE_CSV_FILE}</Link>
        </li>
      </ol>
      <p>
        {lang.INVENTORY_ITEMS_NOT_LISTED_BELOW}{' '}
        <Link to={INVENTORY_BULK_UPLOAD_URL}>{lang.SERVICE_POINT_INVENTORY}</Link>.{' '}
        <strong>{lang.CAUTION_DO_NOT_RE_UPLOAD_THE_SUCCESSFULLY_UPLOADED_ITEMS}</strong>
      </p>
      <Divider></Divider>
      <p>{format(lang.INVENTORY_ITEMS_FROM_FILE_THAT_WERE_NOT_ADDED, filename)}</p>
      <Table columns={columns} dataSource={dataSource}></Table>
    </Card>
  );
};

PostConfirmError.defaultProps = defaultProps;

export { PostConfirmError };
