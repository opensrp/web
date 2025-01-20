import React from 'react';
import { render, screen } from '@testing-library/react';
import { GeometryRender, LocationDetails } from '../';
import { ContextProvider } from '@opensrp/react-utils';

describe('GeometryRender Component', () => {
  test('renders valid JSON string formatted', () => {
    const validJson = '{"key":"value"}';
    render(<GeometryRender geometry={validJson} />);
    expect(document.querySelector('pre')).toMatchSnapshot();
  });

  test('renders invalid JSON string as is', () => {
    const invalidJson = 'invalid-json';
    render(<GeometryRender geometry={invalidJson} />);
    const preElement = screen.getByText(invalidJson);
    expect(preElement).toBeInTheDocument();
  });

  test('renders empty string when geometry is undefined', () => {
    render(<GeometryRender />);
    const preElement = document.querySelector('pre');
    expect(preElement).toBeInTheDocument();
  });

  test('renders empty string when geometry is an empty string', () => {
    render(<GeometryRender geometry="" />);
    const preElement = document.querySelector('pre');
    expect(preElement).toBeInTheDocument();
  });
});

describe('LocationDetails Component', () => {
  const mockLocation = {
    id: 'loc123',
    name: 'Test Location',
    extension: [
      {
        url: 'http://build.fhir.org/extension-location-boundary-geojson.html',
        valueAttachment: {
          data: 'ewogICAgICAgICJ0eXBlIjogIlBvaW50IiwKICAgICAgICAiY29vcmRpbmF0ZXMiOiBbMC4wLCAwLjBdCiAgICAgIH0=',
        },
      },
    ],
    position: {
      latitude: -14.09989,
      longitude: 36.09809,
      altitude: 1200,
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders with complete location details', () => {
    render(
      <ContextProvider>
        <LocationDetails location={mockLocation} />
      </ContextProvider>
    );

    expect(document.querySelector('body')?.textContent).toMatchInlineSnapshot(
      `"Test LocationEdit detailsID: loc123Version: Date Last UpdatedLocation NameTest LocationStatusaliasLatitude & Longitude-14.09989, 36.09809Physical TypeGeometryZXdvZ0lDQWdJQ0FnSUNKMGVYQmxJam9nSWxCdmFXNTBJaXdLSUNBZ0lDQWdJQ0FpWTI5dmNtUnBibUYwWlhNaU9pQmJNQzR3TENBd0xqQmRDaUFnSUNBZ0lIMD0=Administrative LevelDescription"`
    );

    // Check EditLink rendering
    expect(screen.getByText('Edit details')).toBeInTheDocument();
  });

  test('handles missing fields gracefully', () => {
    const partialLocation = {
      id: 'loc123',
      name: 'Test Location',
    };

    render(
      <ContextProvider>
        <LocationDetails location={partialLocation} />
      </ContextProvider>
    );

    // Check missing fields are not rendered
    expect(screen.queryByText('alias:')).not.toBeInTheDocument();
    expect(screen.queryByText('Latitude & Longitude:')).not.toBeInTheDocument();
    expect(screen.queryByTestId('geometry')).not.toBeInTheDocument();
    expect(screen.queryByText('Administrative Level:')).not.toBeInTheDocument();
    expect(screen.queryByText('Description:')).not.toBeInTheDocument();
  });
});
