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

const store: Store<{}> = createStore(rootReducer, applyMiddleware(thunk));

/** not clear in documentation ( notes on use of skjemautfyller):
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

  const { isLoading: questRespIsLoading, data: questResp, error: questRespError } = useQuery(
    [questionnaireResponseResourceType, resourceId],
    () => new FHIRServiceClass(fhirBaseURL, questionnaireResponseResourceType).read(resourceId),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: !isQuestionnaire,
    }
  );

  /** get relative url to questionnaire from questionnaireResponse
   * TODO: This does not account for qr.questionnaire containing absolute urls
   * we assume both questionnaires and questionnaireR are in the same server and linked using relative links
   */
  const questId = isQuestionnaire
    ? `${questionnaireResourceType}/${resourceId}`
    : questResp?.questionnaire;
  const { isLoading, data, error } = useQuery(
    [questionnaireResourceType, questId],
    () => {
      return new FHIRServiceClass(fhirBaseURL, '').read(questId);
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: isQuestionnaire || !!questResp?.questionnaire,
    }
  );

  if (isLoading || questRespIsLoading) {
    return <Spin />;
  }

  if (error && !data && questRespError && !questResp) {
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
            formCancel: 'Cancel',
            formSend: 'Submit',
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
  const isQuestionnaire = resourceType === 'Questionnaire';
  const { fhirBaseURL } = props;

  const onSubmit = (qr: IQuestionnaire) => {
    const service = new FHIRServiceClass<IQuestionnaire>(
      fhirBaseURL,
      questionnaireResponseResourceType
    );
    const op = isQuestionnaire ? () => service.create(qr) : () => service.update(qr);
    op()
      .then(() => sendSuccessNotification('Questionnaire Response resource submitted successfully'))
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