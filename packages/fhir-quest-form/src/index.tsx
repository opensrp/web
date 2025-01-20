/** Renders questionnaire resource or a questionnaire response resource as a form */
import React from 'react';
import rootReducer from '@helsenorge/skjemautfyller/reducers';
import { SkjemautfyllerContainer } from '@helsenorge/skjemautfyller/components';
import { Store, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { RouteComponentProps, useHistory, useParams } from 'react-router';
import { FHIRServiceClass, BrokenPage } from '@opensrp/react-utils';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import { useQuery } from 'react-query';
import type { IQuestionnaire } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaire';
import { useTranslation } from './mls';
import { v4 } from 'uuid';
import { IQuestionnaireResponse } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaireResponse';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const store: Store<Record<string, any>> = createStore(rootReducer, applyMiddleware(thunk));

/**
 * not clear in documentation ( notes on use of skjemautfyller):
 * gotchas:
 *  - dependencies are actually peer dependencies, versions are left to trial and error
 *  - node-sass is left out.
 *  - comes with its own redux-store arch
 * TODOs:
 *  - validation errors are not intuitive
 *
 * Issues:
 * - some forms are not displayed, they just show submit and cancel buttons
 *  - This function `getRootQuestionnaireResponseItemFromData` in skjemautfyller is passed stale formData parameter,
 *    due to a bug in redux action creator
 */

export interface BaseQuestRFormProps {
  resourceId: string;
  isQuestionnaire?: boolean;
  fhirBaseURL: string;
  onSubmit: (qr: IQuestionnaire) => void;
  onCancel: () => void;
}

export const questionnaireResponseResourceType = 'QuestionnaireResponse' as const;
export const questionnaireResourceType = 'Questionnaire' as const;

export const BaseQuestRForm = (props: BaseQuestRFormProps) => {
  const { resourceId, fhirBaseURL, onSubmit, onCancel, isQuestionnaire } = props;
  const { t } = useTranslation();

  const {
    isLoading: questRespIsLoading,
    data: questResp,
    error: questRespError,
  } = useQuery(
    [questionnaireResponseResourceType, resourceId],
    () =>
      new FHIRServiceClass<IQuestionnaireResponse>(
        fhirBaseURL,
        questionnaireResponseResourceType
      ).read(resourceId),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: !isQuestionnaire,
    }
  );

  /**
   * get relative url to questionnaire from questionnaireResponse
   * TODO: This does not account for qr.questionnaire containing absolute urls
   * we assume both questionnaires and questionnaireR are in the same server and linked using relative links
   */
  const questId = isQuestionnaire
    ? `${questionnaireResourceType}/${resourceId}`
    : questResp?.questionnaire;
  const { isLoading, data, error } = useQuery(
    [questionnaireResourceType, questId],
    () => {
      return new FHIRServiceClass(fhirBaseURL, '').read(questId as string);
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: isQuestionnaire || !!questResp?.questionnaire,
    }
  );

  if (isLoading || questRespIsLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if ((error && !data) || (questRespError && !questResp)) {
    return <BrokenPage errorMessage={`${error}`} />;
  }

  return (
    <div className="content-section">
      <Provider store={store} key="1">
        <SkjemautfyllerContainer
          store={store}
          questionnaire={data}
          questionnaireResponse={questResp}
          onSubmit={onSubmit}
          onCancel={onCancel}
          resources={{
            formCancel: t('Cancel'),
            formSend: t('Submit'),
          }}
          authorized={true} // Hacky - leave authentication and authorization to be handled higher up in the app during routing
        />
      </Provider>
    </div>
  );
};

export const resourceIdParam = 'resourceId' as const;
export const resourceTypeParam = 'resourceType' as const;
export interface RouteParams {
  [resourceIdParam]: string;
  [resourceTypeParam]: typeof questionnaireResourceType | typeof questionnaireResponseResourceType;
}

export type QuestRFormProps = Pick<BaseQuestRFormProps, 'fhirBaseURL'> &
  RouteComponentProps<RouteParams>;

export const QuestRForm = (props: QuestRFormProps) => {
  const { resourceId, resourceType } = useParams<RouteParams>();
  const history = useHistory();
  const { t } = useTranslation();
  const isQuestionnaire = resourceType === 'Questionnaire';
  const { fhirBaseURL } = props;

  const onSubmit = (qr: IQuestionnaire) => {
    const payload = { ...qr, id: v4() };
    const service = new FHIRServiceClass<IQuestionnaire>(
      fhirBaseURL,
      questionnaireResponseResourceType
    );
    service
      .update(payload)
      .then(() =>
        sendSuccessNotification(t('Questionnaire Response resource submitted successfully'))
      )
      .catch((e) => sendErrorNotification(e));
  };
  const onCancel = () => history.goBack();

  const rawQuestProps = {
    resourceId,
    isQuestionnaire,
    onSubmit,
    onCancel,
    fhirBaseURL,
  };

  return <BaseQuestRForm {...rawQuestProps} />;
};
