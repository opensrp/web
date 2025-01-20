import { CodeableConcept as TCodeableConcept } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/codeableConcept';
import { Tooltip } from 'antd';
import { Coding } from '../Coding';
import { Typography } from 'antd';
import React, { Fragment } from 'react';

const { Text } = Typography;

export interface CodeableConceptProps {
  concept: TCodeableConcept;
}

export const CodeableConcept = (props: CodeableConceptProps) => {
  const { concept } = props;
  const { coding, text } = concept;

  const codingsTitle = (
    <>
      {(coding ?? []).map((coding, index) => (
        <Fragment key={`coding-${index}`}>
          <Coding coding={coding}></Coding>,{' '}
        </Fragment>
      ))}
    </>
  );
  return (
    <Tooltip data-testid="concept-tooltip" title={codingsTitle} color="white">
      {text ? <Text>{text}</Text> : codingsTitle}
    </Tooltip>
  );
};
