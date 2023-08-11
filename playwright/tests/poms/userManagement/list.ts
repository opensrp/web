import { Page, Locator } from '@playwright/test';
import { Search } from '../common/search';

export class UserListDash extends Search {
    readonly page: Page
    readonly addUserBtn: Locator

    constructor(page: Page) {
        super(page)
        this.addUserBtn = page.getByRole('button', { name: /Add User/i })
    }
}