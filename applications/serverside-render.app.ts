import express, { Request } from 'express';
import path from 'path';
import { WidgetConfiguration } from './models/WidgetConfiguration';
import { IPromptFactory, PromptFactory } from '../commands/prompt.factory';
import { IStorageClient } from './data/abstract.client';
import { FileStorage } from './data/filestorage.client';
import { Submission } from './models/Submission';

// Bootstrapping
const prompt: IPromptFactory = new PromptFactory();
const storage: IStorageClient = new FileStorage();

// App Start
let app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views", "pug"));

// TODO: To be set up automatically since this a pluggable design

const portArgName = 'port';
const widgetPrefix = "/widgets";
const widgetsConfiguration: WidgetConfiguration[] = [
    {
        identifier: "comments",
        viewName: "comments"
    },
    {
        identifier: "likes",
        viewName: "likes"
    },
];

widgetsConfiguration.forEach(element => {
    app.get(`${widgetPrefix}/${element.identifier}`, (req, res) => {
        console.log(getTargetUrl(req));
        storage.get(getTargetUrl(req)).then(data => {
            console.log(data);
            console.log(data.length);
            res.render(element.viewName, { numerOfLikes: data.length });
        });
    });

    app.post(`${widgetPrefix}/${element.identifier}`, (req, res) => {
        console.log('got in', getTargetUrl(req));
        
        const submission: Submission = {
            targetUrl: getTargetUrl(req),
            originIPAddress: '192.168.78.24',
            timeStamps: new Date().toISOString()
        };

        storage.insert(submission)
            .then((newIdentifier) => {
                return storage.get(getTargetUrl(req));
            })
            .then(data => {
                console.log(data);
                console.log(data.length);
                res.render(element.viewName, { numerOfLikes: data.length });
            });
    });
});

const getTargetUrl = (req: Request) => {
    return req.originalUrl;
}

const port = + (prompt.acceptArgument(portArgName).extract().find(x => x.argName == portArgName)?.value ?? 1998);

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});