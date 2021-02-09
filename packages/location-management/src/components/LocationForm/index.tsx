import React, { useState } from 'react';
import { Form, Input, Space, Button, Radio } from 'antd';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { Redirect } from 'react-router';
import { ExtraFields } from './ExtraFields';
import {
  defaultFormField,
  generateLocationUnit,
  getLocationTagOptions,
  getServiceTypeOptions,
  LocationFormFields,
  Setting,
  validationRules,
} from './utils';
import { baseURL, SERVICE_TYPES_SETTINGS_ID, URL_LOCATION_UNIT } from '../../constants';
import { LocationUnitStatus, LocationUnitTag } from '../../ducks/location-units';
import { CustomSelect } from './CustomSelect';
import { loadLocationTags, loadSettings, postPutLocationUnit } from '../../helpers/dataLoaders';
import { OpenSRPService } from '@opensrp/react-utils';
import {
  CANCEL,
  ENTER_A_LOCATION_GROUP_NAME_PLACEHOLDER,
  ENTER_LOCATION_NAME_PLACEHOLDER,
  EXTERNAL_ID_LABEL,
  GEOMETRY_LABEL,
  GEOMETRY_PLACEHOLDER,
  ID_LABEL,
  INSTANCE_LABEL,
  LOCATION_ACTIVE_STATUS_LABEL,
  LOCATION_CATEGORY_LABEL,
  LOCATION_INACTIVE_STATUS_LABEL,
  LOCATION_JURISDICTION_LABEL,
  LOCATION_STRUCTURE_LABEL,
  NAME_LABEL,
  PARENT_LABEL,
  PLEASE_SELECT_PLACEHOLDER,
  SAVE,
  SAVING,
  SELECT_STATUS_LABEL,
  SELECT_TYPE_LABEL,
  SERVICE_TYPES_LABEL,
  STATUS_LABEL,
  SUCCESSFULLY_CREATED_LOCATION,
  SUCCESSFULLY_UPDATED_LOCATION,
  TYPE_LABEL,
  UNIT_GROUP_LABEL,
  USERNAME_LABEL,
} from '../../lang';
import { CustomTreeSelect } from './CustomTreeSelect';
import { TreeNode } from '../../ducks/locationHierarchy/types';
import { fetchAllHierarchies } from '../../ducks/location-hierarchy';
import { useDispatch } from 'react-redux';

const { Item: FormItem } = Form;

/** props for the location form */
export interface LocationFormProps {
  initialValues: LocationFormFields;
  redirectAfterAction: string;
  openSRPBaseURL: string;
  hidden: string[];
  disabled: string[];
  onCancel: () => void;
  service: typeof OpenSRPService;
  username: string;
}

const defaultProps = {
  initialValues: defaultFormField,
  redirectAfterAction: URL_LOCATION_UNIT,
  hidden: [],
  disabled: [],
  onCancel: () => {
    return;
  },
  service: OpenSRPService,
  username: '',
  openSRPBaseURL: baseURL,
};

/** responsive layout for the form labels and columns */
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
    md: {
      span: 4,
    },
    lg: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 18,
    },
    md: {
      span: 16,
    },
    lg: {
      span: 14,
    },
  },
};

const tailLayout = {
  wrapperCol: {
    xs: { offset: 0, span: 16 },
    sm: { offset: 12, span: 24 },
    md: { offset: 8, span: 16 },
    lg: { offset: 6, span: 14 },
  },
};

/** form component to add/edit location units */

const LocationForm = (props: LocationFormProps) => {
  const {
    initialValues,
    redirectAfterAction,
    openSRPBaseURL,
    disabled,
    onCancel,
    hidden,
    service,
    username,
  } = props;
  const dispatch = useDispatch();
  const isEditMode = !!initialValues.id;
  const [areWeDoneHere, setAreWeDoneHere] = useState<boolean>(false);
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [selectedLocationTags, setLocationTags] = useState<LocationUnitTag[]>([]);
  const [selectedParentNode, setSelectedParentNode] = useState<TreeNode>();

  const isHidden = (fieldName: string) => hidden.includes(fieldName);
  const isDisabled = (fieldName: string) => disabled.includes(fieldName);

  const [form] = Form.useForm();

  const status = [
    { label: LOCATION_ACTIVE_STATUS_LABEL, value: LocationUnitStatus.ACTIVE },
    { label: LOCATION_INACTIVE_STATUS_LABEL, value: LocationUnitStatus.INACTIVE },
  ];

  // value options for isJurisdiction questions
  const locationCategoryOptions = [
    { label: LOCATION_STRUCTURE_LABEL, value: false },
    { label: LOCATION_JURISDICTION_LABEL, value: true },
  ];
  /** if plan is updated or saved redirect to plans page */
  if (areWeDoneHere) {
    return <Redirect to={redirectAfterAction} />;
  }

  return (
    <div className="location-form form-container">
      <Form
        {...formItemLayout}
        form={form}
        name="location-form"
        scrollToFirstError
        initialValues={initialValues}
        /* tslint:disable-next-line jsx-no-lambda */
        onFinish={(values) => {
          const payload = generateLocationUnit(
            values,
            username,
            selectedLocationTags,
            selectedParentNode
          );

          const successMessage = isEditMode
            ? SUCCESSFULLY_UPDATED_LOCATION
            : SUCCESSFULLY_CREATED_LOCATION;

          const params = {
            // eslint-disable-next-line @typescript-eslint/camelcase
            is_jurisdiction: values.isJurisdiction,
          };

          postPutLocationUnit(payload, openSRPBaseURL, service, isEditMode, params)
            .then(() => {
              dispatch(fetchAllHierarchies([])); // reset tree data to force refresh of other component
              sendSuccessNotification(successMessage);
              setAreWeDoneHere(true);
            })
            .catch((err: Error) => {
              sendErrorNotification(err.name, err.message);
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        <>
          <FormItem
            name="instance"
            label={INSTANCE_LABEL}
            rules={validationRules.instance}
            hidden
            id="instance"
          >
            <Input disabled></Input>
          </FormItem>

          <FormItem name="id" label={ID_LABEL} rules={validationRules.id} hidden id="id">
            <Input disabled></Input>
          </FormItem>

          <FormItem name="username" label={USERNAME_LABEL} hidden id="username">
            <Input disabled></Input>
          </FormItem>

          <FormItem
            id="parentId"
            hidden={isHidden('parentId')}
            label={PARENT_LABEL}
            name="parentId"
            rules={validationRules.parentId}
          >
            <CustomTreeSelect
              service={service}
              baseURL={openSRPBaseURL}
              disabled={disabled.includes('parentId')}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder={PLEASE_SELECT_PLACEHOLDER}
              fullDataCallback={setSelectedParentNode}
            />
          </FormItem>

          <FormItem
            id="name"
            rules={validationRules.name}
            hidden={isHidden('name')}
            name="name"
            label={NAME_LABEL}
            hasFeedback
          >
            <Input
              disabled={disabled.includes('name')}
              placeholder={ENTER_LOCATION_NAME_PLACEHOLDER}
            ></Input>
          </FormItem>

          <FormItem
            id="status"
            rules={validationRules.status}
            hidden={isHidden('status')}
            label={STATUS_LABEL}
            name="status"
          >
            <Radio.Group options={status}></Radio.Group>
          </FormItem>

          <FormItem
            hidden={isHidden('isJurisdiction')}
            label={LOCATION_CATEGORY_LABEL}
            name="isJurisdiction"
            id="isJurisdiction"
            rules={validationRules.isJurisdiction}
          >
            <Radio.Group
              disabled={disabled.includes('isJurisdiction')}
              options={locationCategoryOptions}
            ></Radio.Group>
          </FormItem>

          <FormItem
            id="type"
            rules={validationRules.type}
            hidden={isHidden('type')}
            name="type"
            label={TYPE_LABEL}
          >
            <Input disabled={disabled.includes('type')} placeholder={SELECT_TYPE_LABEL} />
          </FormItem>

          <FormItem
            hidden={isHidden('serviceTypes')}
            name="serviceTypes"
            id="serviceTypes"
            label={SERVICE_TYPES_LABEL}
            rules={validationRules.serviceTypes}
          >
            <CustomSelect<Setting>
              disabled={disabled.includes('serviceTypes')}
              loadData={(setData) => {
                return loadSettings(SERVICE_TYPES_SETTINGS_ID, openSRPBaseURL, service, setData);
              }}
              getOptions={getServiceTypeOptions}
            />
          </FormItem>

          <FormItem
            id="externalId"
            hidden={isHidden('externalId')}
            name="externalId"
            label={EXTERNAL_ID_LABEL}
            rules={validationRules.externalId}
          >
            <Input disabled={disabled.includes('externalId')} placeholder={SELECT_STATUS_LABEL} />
          </FormItem>

          <FormItem
            id="geometry"
            rules={validationRules.geometry}
            hidden={isHidden('geometry')}
            name="geometry"
            label={GEOMETRY_LABEL}
          >
            <Input.TextArea
              disabled={disabled.includes('geometry')}
              rows={4}
              placeholder={GEOMETRY_PLACEHOLDER}
            />
          </FormItem>

          <FormItem
            id="locationTags"
            hidden={isHidden('locationTags')}
            label={UNIT_GROUP_LABEL}
            name="locationTags"
            rules={validationRules.locationTags}
          >
            <CustomSelect<LocationUnitTag>
              disabled={disabled.includes('locationTags')}
              mode="multiple"
              allowClear
              showSearch
              placeholder={ENTER_A_LOCATION_GROUP_NAME_PLACEHOLDER}
              loadData={(setData) => {
                return loadLocationTags(openSRPBaseURL, service, setData);
              }}
              getOptions={getLocationTagOptions}
              fullDataCallback={setLocationTags}
            />
          </FormItem>

          <ExtraFields
            baseURL={openSRPBaseURL}
            service={service}
            hidden={isHidden('extraFields')}
            disabled={isDisabled('extraFields')}
          />

          <FormItem {...tailLayout}>
            <Space>
              <Button
                type="primary"
                id="location-form-submit-button"
                disabled={isSubmitting}
                htmlType="submit"
              >
                {isSubmitting ? SAVING : SAVE}
              </Button>
              <Button id="location-form-cancel-button" onClick={() => onCancel()}>
                {CANCEL}
              </Button>
            </Space>
          </FormItem>
        </>
      </Form>
    </div>
  );
};

LocationForm.defaultProps = defaultProps;

export { LocationForm };
