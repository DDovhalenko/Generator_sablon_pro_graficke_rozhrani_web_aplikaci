/*! ******************************************************************************************************** *
 *
 * Copyright 2026 Oidis
 *
 * SPDX-License-Identifier: BSD-3-Clause
 * The BSD-3-Clause license for this file can be found in the LICENSE.txt file included with this distribution
 * or at https://spdx.org/licenses/BSD-3-Clause.html#licenseText
 * 
 * Authored by Dmytro Dovhalenko
 *
 * ********************************************************************************************************* */

import { BaseConnector } from "@io-oidis-services/Io/Oidis/Services/Primitives/BaseConnector.js";
import { Loader } from "@io-oidis-gui/Io/Oidis/Gui/Loader.js";
import { WebServiceClientType } from "@io-oidis-commons/Io/Oidis/Commons/Enums/WebServiceClientType.js";
import { IBootstrapConfig } from "../Interfaces/IBootstrapConfig.js";
import { IProjectConfig } from "../Interfaces/IProjectConfig.js";
import { ILoadedFile } from "../Interfaces/ILoadedFile.js";

export class FileHelperConnector extends BaseConnector {

    public static getClient() : FileHelperConnector {
        const instance : FileHelperConnector =
            new FileHelperConnector(true, Loader.getInstance().getHttpManager().CreateLink("/connector.config.jsonp"));
        FileHelperConnector.getClient = () : FileHelperConnector => {
            return instance;
        };
        return instance;
    }

    public async loadFileByPath(encodedPath: string) : Promise<ILoadedFile | null> {
        return await this.asyncInvoke("loadFileByPath", encodedPath);
    }

    public async getBootstrapConfigFile(encodedPath: string) : Promise<{
        bootstrapConfig: IBootstrapConfig | null,
        projectConfig: IProjectConfig | null
    } | null> {
       return await this.asyncInvoke("getBootstrapConfigFile", encodedPath);
    }

    public async getResourceAsDataUrl(encodedGuiRoot: string, resourcePath: string): Promise<string | null> {
        return await this.asyncInvoke("getResourceAsDataUrl", encodedGuiRoot, resourcePath);
    }

    public async saveFile(encodedPath: string, importString:string, variableCreationString:string,
                          variableInitializationString:string, html :string) : Promise<void> {
        return await this.asyncInvoke("saveFile", encodedPath, importString, variableCreationString, variableInitializationString, html);
    }

    public async saveFileUnmarked(encodedPath: string, currentVars: any[], importString: string,
                                  variableCreationString: string, variableInitializationString: string,
                                  html: string) : Promise<void> {
        return await this.asyncInvoke("saveFileUnmarked", encodedPath, currentVars, importString,
            variableCreationString, variableInitializationString, html);
    }

    protected getClientType() : WebServiceClientType {
        return WebServiceClientType.WEB_SOCKETS;
    }

    protected getServerNamespaces() : any {
        const namespaces : any = {};
        namespaces[WebServiceClientType.WEB_SOCKETS] = "Io.Oidis.Studio.Utils.FileHelper";
        return namespaces;
    }

}
