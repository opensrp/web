import { Space, Radio } from 'antd';
import React from 'react';
import { FilterDescription, RegisterFilter } from '@opensrp/react-utils';
import { useTranslation } from '../../../mls';
import { Trans } from '@opensrp/i18n';
import { parseEusmCommodity } from './ViewDetails';

export type TableData = ReturnType<typeof parseEusmCommodity>;

export interface GroupGridFilerRowProps {
  updateFilterParams: RegisterFilter<TableData>;
  currentFilters: FilterDescription<TableData>;
}

const isAnAssetDataIdx = 'isAnAsset';
const statusFilterDataIdx = 'status';

export const GroupGridFilerRow = (props: GroupGridFilerRowProps) => {
  const { t } = useTranslation();
  const { updateFilterParams, currentFilters } = props;
  return (
    <div className="filter-row" data-testid="filter-row">
      <Space size={'large'}>
        <Trans t={t} i18nKey="attractiveFilter">
          <Space>
            Asset:
            <Radio.Group
              size="small"
              value={currentFilters[isAnAssetDataIdx]?.value}
              buttonStyle="solid"
              onChange={(event) => {
                const val = event.target.value;
                if (val !== undefined) {
                  updateFilterParams(
                    isAnAssetDataIdx,
                    (el: TableData) => {
                      return el.attractive === val;
                    },
                    val
                  );
                } else {
                  updateFilterParams(isAnAssetDataIdx, undefined);
                }
              }}
            >
              <Radio.Button value={true}>Yes</Radio.Button>
              <Radio.Button value={false}>No</Radio.Button>
              <Radio.Button value={undefined}>Show all</Radio.Button>
            </Radio.Group>
          </Space>
        </Trans>
        <Trans t={t} i18nKey="groupStatusFilter">
          <Space>
            Status:
            <Radio.Group
              size="small"
              value={currentFilters[statusFilterDataIdx]?.value}
              buttonStyle="solid"
              onChange={(event) => {
                const val = event.target.value;
                if (val !== undefined) {
                  updateFilterParams(
                    statusFilterDataIdx,
                    (el: TableData) => {
                      return el.active === val;
                    },
                    val
                  );
                } else {
                  updateFilterParams(statusFilterDataIdx, undefined);
                }
              }}
            >
              <Radio.Button value={true}>Active</Radio.Button>
              <Radio.Button value={false}>Inactive</Radio.Button>
              <Radio.Button value={undefined}>Show all</Radio.Button>
            </Radio.Group>
          </Space>
        </Trans>
      </Space>
    </div>
  );
};
