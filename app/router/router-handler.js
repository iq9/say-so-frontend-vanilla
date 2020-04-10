var Navigo = require('navigo');
import {CLoginComponent} from "../pages/login.comp";
import {CLogoutComponent} from "../pages/logout.comp";
import {AuthDefender} from "../auth/auth-defender";
import {SettingsComponent} from "../pages/settings.comp";
import {EditorComponent} from "../pages/editor.comp";
import {ArticlePreviewComponent} from "../pages/article-preview.comp";
import {ProfileComponent} from "../pages/profile.comp";
import {CRegisterComponent} from "../pages/register.comp";
import {HomeComponent} from "../pages/home.comp";

export class RouterHandler {
    constructor() {
        if (!RouterHandler.instance) {
            RouterHandler.instance = this;
        } else {
            throw new Error('use getInstance');
        }

        var root = null;
        var useHash = true;
        var hash = '#';
        this.router = new Navigo(root, useHash, hash);

        return RouterHandler.instance;
    }

    static get getInstance() {
        return RouterHandler.instance;
    }

    static inject(component) {
        const outlet = document.querySelector('router-outlet');
        while (outlet.firstChild) {
            outlet.removeChild(outlet.firstChild);
        }
        outlet.appendChild(component);
    }

    init() {
        const routes = [
            {path: '/settings', resolve: SettingsComponent, canActivate: AuthDefender.canActivate},
            {path: '/login', resolve: CLoginComponent},
            {path: '/logout', resolve: CLogoutComponent},
            {path: '/register', resolve: CRegisterComponent},
            {path: '/profile/:username', resolve: ProfileComponent},
            {path: '/article/:slug', resolve: ArticlePreviewComponent},
            {path: '/editor/:slug', resolve: EditorComponent, canActivate: AuthDefender.canActivate},
            {path: '/editor', resolve: EditorComponent, canActivate: AuthDefender.canActivate}
        ];

        this.router.on(() => {
            RouterHandler.inject(new HomeComponent())
        }).resolve();

        routes.forEach(route => {
            this.router.on(
                route.path,
                (params) => {
                    RouterHandler.inject(new route.resolve(params))
                },
                {
                    before: (done, params) => {
                        if (!route.canActivate || route.canActivate()) {
                            done();
                        } else {
                            this.router.navigate('/');
                            done(false);
                        }
                    }
                }
            ).resolve();
        });

    }
}
RouterHandler.instance = null;

