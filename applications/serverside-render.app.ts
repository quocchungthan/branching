import express from 'express';
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
        console.log(req.originalUrl);
        storage.get(req.originalUrl).then(data => {
            console.log(data);
            res.render(element.viewName);
        });
    });

    app.post(`${widgetPrefix}/${element.identifier}`, (req, res) => {
        console.log(req.originalUrl);
        console.log(req.originalUrl);
        
        const submission: Submission = {
            targetUrl: 'https://localhost:1212/trangchu',
            originIPAddress: '192.168.78.24',
            timeStamps: new Date().toISOString()
        };

        storage.insert(submission)
            .then((newIdentifier) => {
                console.log(newIdentifier);
                res.render(element.viewName);
            });
    });
});

const port = + (prompt.acceptArgument(portArgName).extract().find(x => x.argName == portArgName)?.value ?? 1998);

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});