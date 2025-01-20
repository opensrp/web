import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { CodeableConcept } from '../CodeableConcept';
import { CodeableConcept as TCodeableConcept } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/codeableConcept';
import userEvent from '@testing-library/user-event';

describe('CodeableConcept Component', () => {
  test('renders with text and hides coding in tooltip', async () => {
    const concept: TCodeableConcept = {
      text: 'Test Concept',
      coding: [
        { display: 'Code 1', system: 'http://system1', code: '123' },
        { display: 'Code 2', system: 'http://system2', code: '456' },
      ],
    };
    render(<CodeableConcept concept={concept} />);
    expect(screen.getByText('Test Concept')).toBeInTheDocument();
    userEvent.hover(screen.getByText('Test Concept'));
    await waitFor(() => {
      expect(screen.getByText('Code 1(http://system1|123)')).toBeInTheDocument();
      expect(screen.getByText('Code 2(http://system2|456)')).toBeInTheDocument();
    });
  });

  test('renders tooltip with coding when text is absent', async () => {
    const concept: TCodeableConcept = {
      coding: [{ display: 'Code 1', system: 'http://system1', code: '123' }],
    };
    render(<CodeableConcept concept={concept} />);
    expect(screen.getByText('Code 1(http://system1|123)')).toBeInTheDocument();
  });

  test('renders multiple codings in tooltip', () => {
    const concept: TCodeableConcept = {
      coding: [
        { display: 'Code 1', system: 'http://system1', code: '123' },
        { display: 'Code 2', system: 'http://system2', code: '456' },
      ],
    };
    render(<CodeableConcept concept={concept} />);
    expect(screen.getByText('Code 1(http://system1|123)')).toBeInTheDocument();
    expect(screen.getByText('Code 2(http://system2|456)')).toBeInTheDocument();
  });

  test('renders with empty coding array and no text', () => {
    const concept: TCodeableConcept = {};
    render(<CodeableConcept concept={concept} />);
    expect(document.querySelector('body')).toMatchInlineSnapshot(`
      <body>
        <div>
          <span />
        </div>
      </body>
    `);
  });

  test('renders with empty coding array but with text', () => {
    const concept: TCodeableConcept = { text: 'Test Concept', coding: [] };
    render(<CodeableConcept concept={concept} />);
    expect(screen.getByText('Test Concept')).toBeInTheDocument();
    expect(screen.queryByText(',')).not.toBeInTheDocument();
  });
});
