/// <reference types="react" />
import { KeycloakService } from '@opensrp/keycloak-service';
import { KeycloakUser, fetchKeycloakUsers, removeKeycloakUsers } from '../../ducks/user';
/** interface for component props */
export interface Props {
    serviceClass: typeof KeycloakService;
    fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
    removeKeycloakUsersCreator: typeof removeKeycloakUsers;
    keycloakUsers: KeycloakUser[];
    accessToken: string;
    keycloakBaseURL: string;
}
/** default component props */
export declare const defaultProps: {
    accessToken: string;
    serviceClass: typeof KeycloakService;
    fetchKeycloakUsersCreator: (usersList?: KeycloakUser[]) => import("../../ducks/user").FetchKeycloakUsersAction;
    removeKeycloakUsersCreator: () => import("../../ducks/user").RemoveKeycloakUsersAction;
    keycloakUsers: never[];
    keycloakBaseURL: string;
};
declare const UserList: {
    (props: Props): JSX.Element;
    defaultProps: {
        accessToken: string;
        serviceClass: typeof KeycloakService;
        fetchKeycloakUsersCreator: (usersList?: KeycloakUser[]) => import("../../ducks/user").FetchKeycloakUsersAction;
        removeKeycloakUsersCreator: () => import("../../ducks/user").RemoveKeycloakUsersAction;
        keycloakUsers: never[];
        keycloakBaseURL: string;
    };
};
export { UserList };
export declare const ConnectedUserList: import("react-redux").ConnectedComponent<{
    (props: Props): JSX.Element;
    defaultProps: {
        accessToken: string;
        serviceClass: typeof KeycloakService;
        fetchKeycloakUsersCreator: (usersList?: KeycloakUser[]) => import("../../ducks/user").FetchKeycloakUsersAction;
        removeKeycloakUsersCreator: () => import("../../ducks/user").RemoveKeycloakUsersAction;
        keycloakUsers: never[];
        keycloakBaseURL: string;
    };
}, Pick<Props, "keycloakBaseURL" | "serviceClass"> & Props>;
